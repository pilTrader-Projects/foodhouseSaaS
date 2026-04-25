import { BaseService } from '@/services/base-service'
import prisma from '@/lib/prisma'

/**
 * RecipeService manages the relationship between Products and Ingredients.
 */
export class RecipeService extends BaseService {
    /**
     * Defines the recipe for a product.
     * Clears existing recipe items and replaces them with the new set.
     */
    async setRecipe(productId: string, ingredients: { ingredientId: string, amount: number }[]) {
        await this.ensureFeature('inventory')

        return await prisma.$transaction(async (tx) => {
            // 1. Remove old recipe items
            await tx.recipeItem.deleteMany({
                where: { productId }
            })

            // 2. Add new recipe items
            return await tx.recipeItem.createMany({
                data: ingredients.map(item => ({
                    productId,
                    ingredientId: item.ingredientId,
                    amount: item.amount
                }))
            })
        })
    }
}
