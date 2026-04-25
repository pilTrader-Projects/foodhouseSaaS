import { BaseService } from '@/services/base-service'
import prisma from '@/lib/prisma'

/**
 * InventoryService handles the logical deduction of ingredients
 * based on products sold at a specific branch.
 */
export class InventoryService extends BaseService {
    /**
     * Consumes ingredients based on the quantity of a product sold.
     * This is a "destructive" operation that updates stock levels.
     */
    async consumeIngredients(productId: string, quantity: number) {
        // 1. Feature Gate
        await this.ensureFeature('inventory')

        // 2. Fetch the product recipe (ingredients and their required amounts)
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                ingredients: {
                    include: { ingredient: true }
                }
            },
        })

        if (!product) {
            throw new Error('Product not found')
        }

        // 2. Iterate through ingredients and deduct stock
        for (const recipeItem of product.ingredients) {
            const amountToDeduct = recipeItem.amount * quantity

            // Using updateMany scoped to tenant and branch for extra safety
            await prisma.stock.updateMany({
                where: {
                    tenantId: this.tenantId,
                    branchId: this.branchId,
                    ingredientId: recipeItem.ingredientId,
                },
                data: {
                    quantity: {
                        decrement: amountToDeduct,
                    },
                } as any,
            })
        }
    }
}
