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

        if (!product) throw new Error(`Product ${productId} not found for deduction`)

        // 1. Deduct the top-level item based on its strategy
        if (product.deductionModel === 'ON_PRODUCTION') {
            await this.consumePreparedStock(productId, quantity, tx)
            // STOP RECURSION: Components for batch-cooked items are deducted during production
            return;
        } else {
            // Standard raw ingredient deduction
            await this.inventoryService.consumeIngredients(productId, quantity, tx)
        }

        // 2. Recursively deduct recipe components (sub-products) for ON_ORDER items
        await this.deductRecipeComponents(product, quantity, tx)
    }

    /**
     * Deducts only the recipe components of a product.
     * Prevents infinite recursion by only processing componentProductId.
     */
    async deductRecipeComponents(product: any, quantity: number, tx: any) {
        if (!product.ingredients) return

        for (const recipeItem of product.ingredients) {
            if (recipeItem.componentProductId) {
                // Recursive call for sub-components
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
     */
    async consumePreparedStock(productId: string, quantity: number, tx: any) {
        const branchId = this.branchId
        if (!branchId) throw new Error('Branch context required for prepared stock consumption')

        return tx.preparedStock.upsert({
            where: {
                branchId_productId: {
                    branchId,
                    productId
                }
            },
            update: {
                quantity: { decrement: quantity }
            },
            create: {
                branchId,
                productId,
                quantity: -quantity
            }
        })
    }
}
