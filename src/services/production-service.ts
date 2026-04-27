import { BaseService } from './base-service'
import prisma from '@/lib/prisma'
import { InventoryService } from '@/modules/inventory/services/inventory-service'

/**
 * ProductionService handles batch cooking and prepared stock management.
 * It coordinates ingredient deduction when items are produced by the kitchen.
 */
export class ProductionService extends BaseService {
    private inventoryService: InventoryService

    constructor(tenantId: string, branchId: string) {
        super(tenantId, branchId)
        this.inventoryService = new InventoryService(tenantId, branchId)
    }

    /**
     * Records a production batch by the Chef.
     * 1. Deducts raw ingredients from branch inventory.
     * 2. Increases the prepared stock for the product based on BATCH YIELD.
     * 3. Logs the production event.
     */
    async recordProduction(productId: string, numBatches: number) {
        if (!this.branchId) throw new Error('Branch context required for production')

        // 0. Fetch Product to get batchSize
        const product = await prisma.product.findUnique({
            where: { id: productId }
        })
        if (!product) throw new Error('Product not found')

        const yieldQuantity = numBatches * (product.batchSize || 1)

        // 1. Deduct Ingredients (based on number of batches)
        await this.inventoryService.consumeIngredients(productId, numBatches)

        // 2. Increase Prepared Stock (based on total yield)
        await prisma.preparedStock.upsert({
            where: {
                branchId_productId: {
                    branchId: this.branchId,
                    productId
                }
            },
            update: {
                quantity: { increment: yieldQuantity }
            },
            create: {
                branchId: this.branchId,
                productId,
                quantity: yieldQuantity
            }
        })

        // 3. Log Production
        return prisma.productionRecord.create({
            data: {
                branchId: this.branchId,
                productId,
                quantity: yieldQuantity
            }
        })
    }

    /**
     * Deducts from prepared stock (finished goods) during a sale.
     * This is used for products with deductionModel = 'ON_PRODUCTION'.
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
