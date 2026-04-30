import { describe, it, expect, beforeEach } from 'vitest'
import { PosService } from '../src/modules/pos/services/pos-service'
import { ProductionService } from '../src/services/production-service'
import prisma from '../src/lib/prisma'

describe('Combo Meal Deductions (K-2+)', () => {
    let tenantId: string
    let branchId: string
    let userId: string
    let posService: PosService
    let productionService: ProductionService

    beforeEach(async () => {
        tenantId = `tenant-combo-${Math.random().toString(36).substring(7)}`
        branchId = `branch-combo-${Math.random().toString(36).substring(7)}`
        userId = `user-combo-${Math.random().toString(36).substring(7)}`
        const userEmail = `test-${Math.random().toString(36).substring(7)}@user.com`
        
        posService = new PosService(tenantId, branchId)
        productionService = new ProductionService(tenantId, branchId)

        // Cleanup
        await prisma.orderItem.deleteMany({ where: { order: { tenantId } } })
        await prisma.order.deleteMany({ where: { tenantId } })
        await prisma.productionRecord.deleteMany({ where: { branch: { tenantId } } })
        await prisma.preparedStock.deleteMany({ where: { branch: { tenantId } } })
        await prisma.recipeItem.deleteMany({ where: { product: { tenantId } } })
        await prisma.recipeItem.deleteMany({ where: { componentProduct: { tenantId } } })
        await prisma.product.deleteMany({ where: { tenantId } })
        await prisma.user.deleteMany({ where: { tenantId } })
        await prisma.role.deleteMany({ where: { tenantId } })
        await prisma.branch.deleteMany({ where: { tenantId } })
        await prisma.tenant.deleteMany({ where: { id: tenantId } })

        // Setup
        await prisma.tenant.create({ data: { id: tenantId, name: 'Combo Test Tenant', features: ['pos', 'inventory'] } })
        await prisma.branch.create({ data: { id: branchId, name: 'Branch 1', tenantId } })
        const role = await prisma.role.create({ data: { name: 'OWNER', tenantId } })
        await prisma.user.create({
            data: {
                id: userId,
                email: userEmail,
                name: 'Test User',
                password: 'dummy',
                tenantId: tenantId,
                roleId: role.id
            }
        })
    })

    it('should prevent double-deduction by stopping recursion at the ON_PRODUCTION boundary', async () => {
        // 1. Create a raw ingredient (Flour)
        const flour = await prisma.ingredient.create({
            data: { name: 'Flour', unit: 'kg', tenantId }
        })
        await prisma.stock.create({
            data: { tenantId, branchId, ingredientId: flour.id, quantity: 100 }
        })

        // 2. Create a batch-cooked component (Buns) that uses 0.5kg Flour
        const buns = await prisma.product.create({
            data: {
                name: 'Buns (Batch)',
                price: 20,
                tenantId,
                deductionModel: 'ON_PRODUCTION',
                batchSize: 10,
                ingredients: {
                    create: {
                        ingredientId: flour.id,
                        amount: 0.5
                    }
                }
            }
        })

        // 3. Create a Burger (Combo) that uses 1 Bun
        const burger = await prisma.product.create({
            data: {
                name: 'Standard Burger',
                price: 100,
                tenantId,
                deductionModel: 'ON_ORDER',
                ingredients: {
                    create: {
                        componentProductId: buns.id,
                        amount: 1
                    }
                }
            }
        })

        // 4. Chef produces 1 batch of Buns (10 pcs)
        // This SHOULD deduct 0.5kg Flour (1 batch * 0.5kg)
        await productionService.recordProduction(buns.id, 1)

        const flourAfterProduction = await prisma.stock.findUnique({
            where: { branchId_ingredientId: { branchId, ingredientId: flour.id } }
        })
        expect(flourAfterProduction?.quantity).toBe(99.5) // 100 - 0.5

        // 5. Cashier sells 2 Burgers
        // This SHOULD deduct 2 Buns from prepared stock
        // This SHOULD NOT deduct more Flour (Double Deduction Prevention)
        await posService.createOrder(userId, [
            { productId: burger.id, quantity: 2, price: 100 }
        ])

        // Verify Bun stock: 10 - 2 = 8
        const bunsStock = await prisma.preparedStock.findUnique({
            where: { branchId_productId: { branchId, productId: buns.id } }
        })
        expect(bunsStock?.quantity).toBe(8)

        // Verify Flour stock remains 99.5 (No second deduction during sale)
        const flourFinal = await prisma.stock.findUnique({
            where: { branchId_ingredientId: { branchId, ingredientId: flour.id } }
        })
        expect(flourFinal?.quantity).toBe(99.5)
    }, 30000)

    it('should recursively deduct raw ingredients for nested ON_ORDER components', async () => {
        // 1. Raw Ingredient (Sugar)
        const sugar = await prisma.ingredient.create({
            data: { name: 'Sugar', unit: 'kg', tenantId }
        })
        await prisma.stock.create({
            data: { tenantId, branchId, ingredientId: sugar.id, quantity: 10 }
        })

        // 2. Simple Component (Syrup) - ON_ORDER
        const syrup = await prisma.product.create({
            data: {
                name: 'Simple Syrup',
                price: 10,
                tenantId,
                deductionModel: 'ON_ORDER',
                ingredients: {
                    create: { ingredientId: sugar.id, amount: 0.1 }
                }
            }
        })

        // 3. Combo (Iced Coffee) - ON_ORDER
        const coffee = await prisma.product.create({
            data: {
                name: 'Iced Coffee',
                price: 50,
                tenantId,
                deductionModel: 'ON_ORDER',
                ingredients: {
                    create: { componentProductId: syrup.id, amount: 2 } // Uses 2 shots of syrup
                }
            }
        })

        // 4. Sell 1 Coffee
        // Should deduct 2 shots of syrup -> 2 * 0.1kg Sugar = 0.2kg
        await posService.createOrder(userId, [
            { productId: coffee.id, quantity: 1, price: 50 }
        ])

        const sugarFinal = await prisma.stock.findUnique({
            where: { branchId_ingredientId: { branchId, ingredientId: sugar.id } }
        })
        expect(sugarFinal?.quantity).toBe(9.8) // 10 - 0.2
    }, 30000)

    it('should NOT deduct sub-components during a sale if the parent component is ON_PRODUCTION', async () => {
        // 1. Create Component B (e.g. Special Sauce) - ON_PRODUCTION
        const sauce = await prisma.product.create({
            data: {
                name: 'Special Sauce (Batch)',
                price: 10,
                tenantId,
                deductionModel: 'ON_PRODUCTION',
                batchSize: 50
            }
        })
        await productionService.recordProduction(sauce.id, 1) // Produce 50 units

        // 2. Create Component A (e.g. Pre-prepped Patty) - ON_PRODUCTION
        // USES Component B
        const patty = await prisma.product.create({
            data: {
                name: 'Patty (Batch)',
                price: 50,
                tenantId,
                deductionModel: 'ON_PRODUCTION',
                batchSize: 20,
                ingredients: {
                    create: {
                        componentProductId: sauce.id,
                        amount: 1 // 1 unit of sauce per patty
                    }
                }
            }
        })

        // Chef produces 1 batch of Patty (20 units)
        // This SHOULD deduct 20 units of Sauce from Prepared Stock
        await productionService.recordProduction(patty.id, 1)

        const sauceAfterPattyProd = await prisma.preparedStock.findUnique({
            where: { branchId_productId: { branchId, productId: sauce.id } }
        })
        expect(sauceAfterPattyProd?.quantity).toBe(30) // 50 - 20

        // 3. Create Combo (The Ultimate Burger) - ON_ORDER
        const burger = await prisma.product.create({
            data: {
                name: 'Ultimate Burger',
                price: 200,
                tenantId,
                deductionModel: 'ON_ORDER',
                ingredients: {
                    create: {
                        componentProductId: patty.id,
                        amount: 1
                    }
                }
            }
        })

        // 4. Sell 5 Ultimate Burgers
        // Should deduct 5 Patties from Prepared Stock.
        // Should NOT deduct any more Sauce (Double Deduction Prevention).
        await posService.createOrder(userId, [
            { productId: burger.id, quantity: 5, price: 200 }
        ])

        const pattyStock = await prisma.preparedStock.findUnique({
            where: { branchId_productId: { branchId, productId: patty.id } }
        })
        expect(pattyStock?.quantity).toBe(15) // 20 - 5

        const sauceFinal = await prisma.preparedStock.findUnique({
            where: { branchId_productId: { branchId, productId: sauce.id } }
        })
        // IF BUGGY: This will be 25 (30 - 5)
        // IF CORRECT: This will remain 30
        expect(sauceFinal?.quantity).toBe(30)
    }, 30000)
})
