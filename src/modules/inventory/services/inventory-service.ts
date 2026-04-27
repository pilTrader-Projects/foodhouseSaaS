import { BaseService } from '@/services/base-service'
import prisma from '@/lib/prisma'

/**
 * InventoryService handles the logical deduction of ingredients
 * based on products sold at a specific branch.
 */
export class InventoryService extends BaseService {
    /**
     * Consumes ingredients based on the quantity of a product sold.
     * Supports external Prisma transactions.
     */
    async consumeIngredients(productId: string, quantity: number, tx?: any) {
        const db = tx || prisma

        // 1. Feature Gate
        await this.ensureFeature('inventory')

        // 2. Fetch the product recipe
        const product = await db.product.findUnique({
            where: { id: productId },
            include: {
                ingredients: {
                    include: { ingredient: true }
                }
            },
        })

        if (!product) throw new Error('Product not found')

        // 2. Iterate through ingredients and deduct stock
        for (const recipeItem of product.ingredients) {
            // Only deduct if it's a raw ingredient (not a component product)
            if (!recipeItem.ingredientId) continue;

            const amountToDeduct = recipeItem.amount * quantity

            await db.stock.updateMany({
                where: {
                    tenantId: this.tenantId,
                    branchId: this.branchId,
                    ingredientId: recipeItem.ingredientId,
                },
                data: {
                    quantity: {
                        decrement: amountToDeduct,
                    },
                },
            })
        }
    }

    /**
     * Creates a new ingredient for the tenant.
     */
    async createIngredient(data: { name: string; unit: string }) {
        await this.ensureFeature('inventory')
        return prisma.ingredient.create({
            data: {
                ...data,
                tenantId: this.tenantId,
            },
        })
    }

    /**
     * Fetches all ingredients for the current tenant.
     */
    async getIngredients() {
        return prisma.ingredient.findMany({
            where: { tenantId: this.tenantId },
            orderBy: { name: 'asc' },
        })
    }
}
