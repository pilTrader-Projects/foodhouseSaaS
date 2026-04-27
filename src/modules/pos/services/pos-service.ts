import { BaseService } from '@/services/base-service'
import prisma from '@/lib/prisma'
import { InventoryService } from '../../inventory/services/inventory-service'
import { ProductionService } from '@/services/production-service'

/**
 * PosService handles order creation and coordinates with the 
 * Inventory module to ensure stock is deducted in a single transaction.
 */
export class PosService extends BaseService {
    private inventoryService: InventoryService
    private productionService: ProductionService

    constructor(tenantId: string, branchId: string) {
        super(tenantId, branchId)
        this.inventoryService = new InventoryService(tenantId, branchId)
        this.productionService = new ProductionService(tenantId, branchId)
    }

    /**
     * Creates a new order. 
     * This logic is wrapped in a Prisma transaction to ensure 
     * that inventory is only deducted if the order is successfully created.
     */
    async createOrder(items: { productId: string; quantity: number; price: number }[]) {
        // 1. Feature Gate
        await this.ensureFeature('pos')

        return await prisma.$transaction(async (tx) => {
            // 1. Calculate total and create the order
            const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

            const order = await tx.order.create({
                data: {
                    tenantId: this.tenantId,
                    branchId: this.branchId!,
                    userId: 'user-admin', // Use the admin user created during seeding
                    totalAmount,
                    items: {
                        create: items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            pricePaid: item.price,
                        })),
                    },
                },
            })

            // 2. Delegate inventory consumption based on the hybrid model
            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId }
                })

                if (product?.deductionModel === 'ON_PRODUCTION') {
                    // Logic for pre-cooked items: Deduct from PREPARED stock
                    await this.productionService.consumePreparedStock(item.productId, item.quantity)
                } else {
                    // Logic for made-to-order items: Deduct raw ingredients directly
                    await this.inventoryService.consumeIngredients(item.productId, item.quantity)
                }
            }

            return order
        })
    }
}
