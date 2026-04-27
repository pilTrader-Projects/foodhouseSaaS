import { BaseService } from './base-service'
import prisma from '@/lib/prisma'

/**
 * RecipeService manages Bill of Materials (BOM) for products.
 * It links products to ingredients or other component products.
 */
export class RecipeService extends BaseService {
    /**
     * Replaces the current recipe for a product.
     * Uses a transaction to ensure atomic replacement.
     */
    async updateRecipe(productId: string, items: {
        ingredientId?: string;
        componentProductId?: string;
        amount: number
    }[]) {
        return prisma.$transaction(async (tx) => {
            // 1. Delete existing recipe items
            await tx.recipeItem.deleteMany({
                where: { productId }
            })

            // 2. Create new recipe items
            return await Promise.all(
                items.map(item => tx.recipeItem.create({
                    data: {
                        productId,
                        ingredientId: item.ingredientId,
                        componentProductId: item.componentProductId,
                        amount: item.amount
                    }
                }))
            )
        })
    }

    /**
     * Fetches the recipe for a product, including ingredient details.
     */
    async getRecipe(productId: string) {
        return prisma.recipeItem.findMany({
            where: { productId },
            include: {
                ingredient: true,
                componentProduct: true
            }
        })
    }
}
