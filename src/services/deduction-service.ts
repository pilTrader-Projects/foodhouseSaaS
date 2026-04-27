import { BaseService } from './base-service'
import prisma from '@/lib/prisma'
import { InventoryService } from '@/modules/inventory/services/inventory-service'

/**
 * DeductionService centralizes the "Inventory Strategy" logic.
 * It handles recursive deductions for both raw ingredients and batch-cooked components.
 */
export class DeductionService extends BaseService {
    private inventoryService: InventoryService

    constructor(tenantId: string, branchId: string) {
        super(tenantId, branchId)
        this.inventoryService = new InventoryService(tenantId, branchId)
    }

    /**
     * Executes recursive deduction logic for a product and its components.
     * This is the entry point for Sales/POS.
     */
    async deductStock(productId: string, quantity: number, tx: any) {
        const product = await tx.product.findUnique({
            where: { id: productId },
            include: { ingredients: true }
        })

        if (!product) return

        // 1. Deduct the top-level item based on its strategy
        if (product.deductionModel === 'ON_PRODUCTION') {
            await this.consumePreparedStock(productId, quantity, tx)
        } else {
            await this.inventoryService.consumeIngredients(productId, quantity, tx)
        }

        // 2. Recursively deduct recipe components
        await this.deductRecipeComponents(product, quantity, tx)
    }

    /**
     * Deducts only the recipe components of a product.
     * Used by ProductionService to consume ingredients without deducting the product itself.
     */
    async deductRecipeComponents(product: any, quantity: number, tx: any) {
        if (!product.ingredients) return

        for (const recipeItem of product.ingredients) {
            if (recipeItem.componentProductId) {
                // If it's a sub-product, use the standard recursive deduction
                await this.deductStock(
                    recipeItem.componentProductId,
                    recipeItem.amount * quantity,
                    tx
                )
            }
        }
    }

    /**
     * Deducts from prepared stock (finished goods) during a sale.
     * Moved from ProductionService to break circular dependency.
     */
    async consumePreparedStock(productId: string, quantity: number, tx?: any) {
        if (!this.branchId) throw new Error('Branch context required for consumption')
        const db = tx || prisma

        return db.preparedStock.upsert({
            where: {
                branchId_productId: {
                    branchId: this.branchId,
                    productId
                }
            },
            update: {
                quantity: { decrement: quantity }
            },
            create: {
                branchId: this.branchId,
                productId,
                quantity: -quantity
            }
        })
    }
}
