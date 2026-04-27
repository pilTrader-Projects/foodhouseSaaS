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
     * 2. Increases the prepared stock for the product.
     * 3. Logs the production event.
     */
    async recordProduction(productId: string, quantity: number) {
        // Enforce branch scope
        if (!this.branchId) throw new Error('Branch context required for production')

        // 1. Deduct Ingredients
        await this.inventoryService.consumeIngredients(productId, quantity)

        // 2. Increase Prepared Stock
        await prisma.preparedStock.upsert({
            where: {
                branchId_productId: {
                    branchId: this.branchId,
                    productId
                }
            },
            update: {
                quantity: { increment: quantity }
            },
            create: {
                branchId: this.branchId,
                productId,
                quantity
            }
        })

        // 3. Log Production
        return prisma.productionRecord.create({
            data: {
                branchId: this.branchId,
                productId,
                quantity
            }
        })
    }

    /**
     * Deducts from prepared stock (finished goods) during a sale.
     * This is used for products with deductionModel = 'ON_PRODUCTION'.
     */
    async consumePreparedStock(productId: string, quantity: number) {
        if (!this.branchId) throw new Error('Branch context required for consumption')

        return prisma.preparedStock.upsert({
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
