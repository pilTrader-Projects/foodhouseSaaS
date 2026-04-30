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
     * Compares performance across all branches, including those with zero sales.
     */
    async getBranchPerformance() {
        await this.ensureFeature('dashboard')

        // 1. Fetch all branches for the tenant
        const branches = await prisma.branch.findMany({
            where: { tenantId: this.tenantId },
            select: { id: true, name: true }
        })

        // 2. Fetch aggregated sales per branch
        const sales = await prisma.order.groupBy({
            by: ['branchId'],
            where: {
                tenantId: this.tenantId,
            },
            _sum: {
                totalAmount: true,
            }
        })

        // 3. Merge branches with sales data
        return branches.map(branch => {
            const branchSales = sales.find(s => s.branchId === branch.id)
            return {
                branchId: branch.id,
                branchName: branch.name,
                _sum: {
                    totalAmount: branchSales?._sum?.totalAmount || 0
                }
            }
        }).sort((a, b) => (b._sum.totalAmount || 0) - (a._sum.totalAmount || 0))
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
