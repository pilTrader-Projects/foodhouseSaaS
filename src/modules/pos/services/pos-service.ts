import { BaseService } from '@/services/base-service'
import prisma from '@/lib/prisma'
import { DeductionService } from '@/services/deduction-service'

/**
 * PosService handles order creation and coordinates with the 
 * DeductionService to ensure stock is accurately accounted for.
 */
export class PosService extends BaseService {
    private deductionService: DeductionService

    constructor(tenantId: string, branchId: string) {
        super(tenantId, branchId)
        this.deductionService = new DeductionService(tenantId, branchId)
    }

    /**
     * Creates a new order. 
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
                    userId: 'user-admin',
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

            // 2. Delegate deduction to specialized service
            for (const item of items) {
                await this.deductionService.deductStock(item.productId, item.quantity, tx)
            }

            return order
        })
    }
}
