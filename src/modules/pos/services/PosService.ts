import { BaseService } from '@/services/BaseService'
import prisma from '@/lib/prisma'
import { InventoryService } from '../../inventory/services/InventoryService'

/**
 * PosService handles order creation and coordinates with the 
 * Inventory module to ensure stock is deducted in a single transaction.
 */
export class PosService extends BaseService {
    private inventoryService: InventoryService

    constructor(tenantId: string, branchId: string) {
        super(tenantId, branchId)
        this.inventoryService = new InventoryService(tenantId, branchId)
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

            // 2. Delegate inventory consumption to the Inventory module
            for (const item of items) {
                await this.inventoryService.consumeIngredients(item.productId, item.quantity)
            }

            return order
        })
    }
}
