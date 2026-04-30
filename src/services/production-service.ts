import { BaseService } from './base-service'
import prisma from '@/lib/prisma'
import { DeductionService } from './deduction-service'
import { InventoryService } from '@/modules/inventory/services/inventory-service'

/**
 * ProductionService handles batch cooking and prepared stock management.
 */
export class ProductionService extends BaseService {
    private deductionService: DeductionService
    private inventoryService: InventoryService

    constructor(tenantId: string, branchId: string) {
        super(tenantId, branchId)
        this.deductionService = new DeductionService(tenantId, branchId)
        this.inventoryService = new InventoryService(tenantId, branchId)
    }

    /**
     * Records a production batch by the Chef.
     */
    async recordProduction(productId: string, numBatches: number) {
        if (!this.branchId) throw new Error('Branch context required for production')

        return await prisma.$transaction(async (tx) => {
            // 0. Fetch Product to get batchSize
            const product = await tx.product.findUnique({
                where: { id: productId },
                include: { ingredients: true }
            })
            if (!product) throw new Error('Product not found')

            const yieldQuantity = numBatches * (product.batchSize || 1)

            // 1. Deduct Raw Ingredients (The Fix)
            await this.inventoryService.consumeIngredients(productId, numBatches, tx)

            // 2. Deduct Sub-Product Ingredients (recursive components only)
            await this.deductionService.deductRecipeComponents(product, yieldQuantity, tx)

            // 3. Increase Prepared Stock
            await tx.preparedStock.upsert({
                where: {
                    branchId_productId: {
                        branchId: this.branchId!,
                        productId
                    }
                },
                update: {
                    quantity: { increment: yieldQuantity }
                },
                create: {
                    branchId: this.branchId!,
                    productId,
                    quantity: yieldQuantity
                }
            })

            // 4. Log Production
            return tx.productionRecord.create({
                data: {
                    branchId: this.branchId!,
                    productId,
                    quantity: yieldQuantity
                }
            })
        })
    }

    /**
     * Gets the current prepared stock levels for the branch.
     */
    async getPreparedStock() {
        return prisma.preparedStock.findMany({
            where: { branchId: this.branchId! },
            include: { product: true }
        })
    }
}
