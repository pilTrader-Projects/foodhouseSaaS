import { BaseService } from '@/services/BaseService'
import prisma from '@/lib/prisma'

/**
 * PosService handles the minimal transaction pipeline for POS-lite.
 * It focuses on capturing sales and persisting them to the correct branch.
 */
export class PosService extends BaseService {
    /**
     * Records a new sale/order.
     * Mandates 'pos' feature availability and branch scoping.
     */
    async createOrder(items: { productId: string; quantity: number; price: number }[]) {
        await this.ensureFeature('pos')

        if (!this.branchId) {
            throw new Error('Branch ID is required to create an order.')
        }

        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

        return await prisma.$transaction(async (tx) => {
            return await tx.order.create({
                data: {
                    tenantId: this.tenantId,
                    branchId: this.branchId!,
                    userId: 'system', // TODO: Link to actual user session
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
        })
    }

    /**
     * Fetches the daily sales for the branch.
     */
    async getDailySales() {
        await this.ensureFeature('pos')

        const startOfToday = new Date()
        startOfToday.setHours(0, 0, 0, 0)

        return prisma.order.findMany({
            where: {
                ...this.getScope(),
                createdAt: { gte: startOfToday },
            },
            include: { items: true },
        })
    }
}
