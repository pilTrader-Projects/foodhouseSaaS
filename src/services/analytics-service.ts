import { BaseService } from './base-service'
import prisma from '@/lib/prisma'

/**
 * AnalyticsService provides consolidated views of data across multiple branches.
 * This is primarily used by Tenant Owners and Accountants.
 */
export class AnalyticsService extends BaseService {
    /**
     * Aggregates total revenue across all branches for the tenant.
     */
    async getGlobalSales() {
        await this.ensureFeature('dashboard')

        const aggregation = await prisma.order.aggregate({
            where: {
                tenantId: this.tenantId,
            },
            _sum: {
                totalAmount: true,
            },
        })

        return aggregation._sum.totalAmount || 0
    }

    /**
     * Compares performance across branches.
     */
    async getBranchPerformance() {
        await this.ensureFeature('dashboard')

        return prisma.order.groupBy({
            by: ['branchId'],
            where: {
                tenantId: this.tenantId,
            },
            _sum: {
                totalAmount: true,
            },
            orderBy: {
                _sum: {
                    totalAmount: 'desc',
                },
            },
        })
    }

    /**
     * Identifies stock items that are below a certain threshold across all branches.
     */
    async getGlobalCriticalStock(threshold: number = 10) {
        await this.ensureFeature('inventory') // Cross-branch inventory also requires inventory feature

        return prisma.stock.findMany({
            where: {
                tenantId: this.tenantId,
                quantity: {
                    lte: threshold,
                },
            },
            include: {
                branch: { select: { name: true } },
                ingredient: { select: { name: true, unit: true } },
            },
        })
    }
}
