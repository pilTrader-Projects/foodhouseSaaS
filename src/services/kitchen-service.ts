import { BaseService } from './base-service'
import prisma from '@/lib/prisma'

/**
 * KitchenService manages the live order fulfillment pipeline.
 * It provides the data for the Kitchen Display System (KDS).
 */
export class KitchenService extends BaseService {
    /**
     * Fetches all orders that are currently in the kitchen.
     * Orders with status PENDING, PREPARING, or READY are returned.
     */
    async getActiveOrders() {
        return prisma.order.findMany({
            where: {
                branchId: this.branchId!,
                tenantId: this.tenantId,
                status: {
                    in: ['PENDING', 'PREPARING', 'READY']
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                user: {
                    select: { name: true }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        })
    }

    /**
     * Updates the status of an order (e.g., PENDING -> PREPARING).
     */
    async updateStatus(orderId: string, status: string) {
        // Simple validation of status flow
        const validStatuses = ['PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid order status: ${status}`);
        }

        return prisma.order.update({
            where: { id: orderId },
            data: { status }
        })
    }
}
