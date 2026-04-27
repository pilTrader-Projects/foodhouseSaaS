import { describe, it, expect, beforeEach } from 'vitest'
import { PosService } from '../src/modules/pos/services/pos-service'
import { ProductionService } from '../src/services/production-service'
import prisma from '../src/lib/prisma'

describe('Combo Meal Deductions (K-2+)', () => {
    const tenantId = 'tenant-combo-test'
    const branchId = 'branch-combo-1'
    let posService: PosService
    let productionService: ProductionService

    beforeEach(async () => {
        posService = new PosService(tenantId, branchId)
        productionService = new ProductionService(tenantId, branchId)

        // Cleanup
        await prisma.recipeItem.deleteMany({ where: { product: { tenantId } } })
        await prisma.orderItem.deleteMany({ where: { order: { tenantId } } })
        await prisma.order.deleteMany({ where: { tenantId } })
        await prisma.productionRecord.deleteMany({ where: { branch: { tenantId } } })
        await prisma.preparedStock.deleteMany({ where: { branch: { tenantId } } })
        await prisma.product.deleteMany({ where: { tenantId } })
        await prisma.branch.deleteMany({ where: { tenantId } })
        await prisma.tenant.deleteMany({ where: { id: tenantId } })

        // Setup
        await prisma.tenant.create({ data: { id: tenantId, name: 'Combo Test Tenant', features: ['pos', 'inventory'] } })
        await prisma.branch.create({ data: { id: branchId, name: 'Branch 1', tenantId } })
    })

    it('should deduct from prepared stock of a component product when composite meal is sold', async () => {
        // 1. Create a batch-cooked component (Garlic Chicken)
        const component = await prisma.product.create({
            data: {
                name: 'Garlic Chicken (PC)',
                price: 50,
                tenantId,
                deductionModel: 'ON_PRODUCTION',
                batchSize: 30 // 30 pcs per batch
            }
        })

        // 2. Create a combo meal that contains 1 pc of Garlic Chicken
        const combo = await prisma.product.create({
            data: {
                name: 'Solo Chicken Meal',
                price: 150,
                tenantId,
                deductionModel: 'ON_ORDER', // Combo itself is made to order
                ingredients: {
                    create: {
                        componentProductId: component.id,
                        amount: 1 // 1 pc per meal
                    }
                }
            }
        })

        // 3. Chef records 1 batch of Garlic Chicken (Yield = 30)
        await productionService.recordProduction(component.id, 1)

        const stockBefore = await prisma.preparedStock.findUnique({
            where: { branchId_productId: { branchId, productId: component.id } }
        })
        expect(stockBefore?.quantity).toBe(30)

        // 4. Cashier sells 2 Solo Chicken Meals
        await posService.createOrder([
            { productId: combo.id, quantity: 2, price: 150 }
        ])

        // 5. Verify stock of Garlic Chicken is now 28 (30 - 2)
        const stockAfter = await prisma.preparedStock.findUnique({
            where: { branchId_productId: { branchId, productId: component.id } }
        })
        expect(stockAfter?.quantity).toBe(28)
    }, 30000) // 30s timeout
})
