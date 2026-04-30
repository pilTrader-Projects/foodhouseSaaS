import { BaseService } from './base-service'
import prisma from '@/lib/prisma'

/**
 * AnalyticsService provides consolidated views of data across multiple branches.
 * This is primarily used by Tenant Owners and Accountants.
 */
export class AnalyticsService extends BaseService {
    /**
     * Aggregates total revenue across all branches (or a specific branch) for the tenant.
     */
    async getGlobalSales() {
        await this.ensureFeature('dashboard')

        const aggregation = await prisma.order.aggregate({
            where: this.getScope(),
            _sum: {
                totalAmount: true,
            },
        })

        return aggregation._sum.totalAmount || 0
    }

    /**
     * Compares performance across branches.
     * If scoped to a specific branch (Manager), only that branch is returned.
     */
    async getBranchPerformance() {
        await this.ensureFeature('dashboard')

        // 1. Fetch branches within the current scope (all for Owner, one for Manager)
        const branches = await prisma.branch.findMany({
            where: this.getBranchScope(),
            select: { id: true, name: true }
        })

        // 2. Fetch aggregated sales per branch within scope
        const sales = await prisma.order.groupBy({
            by: ['branchId'],
            where: this.getScope(),
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
     * Identifies stock items that are below a certain threshold within the current scope.
     */
    async getGlobalCriticalStock(threshold: number = 10) {
        await this.ensureFeature('inventory')

        return prisma.stock.findMany({
            where: {
                ...this.getScope(),
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
