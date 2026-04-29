import prisma from '@/lib/prisma'

/**
 * GlobalAdminService provides platform-level management capabilities
 * for system administrators to oversee all tenants and platform health.
 */
export class GlobalAdminService {
    /**
     * Retrieves a list of all tenants in the system.
     */
    async getTenants() {
        return prisma.tenant.findMany({
            include: {
                _count: {
                    select: {
                        branches: true,
                        users: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
    }

    /**
     * Fetches detailed information and performance metrics for a specific tenant.
     */
    async getTenantDetails(tenantId: string) {
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId },
            include: {
                _count: {
                    select: {
                        branches: true,
                        users: true,
                        orders: true
                    }
                },
                branches: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        if (!tenant) throw new Error('Tenant not found')

        // Aggregate revenue
        const revenue = await prisma.order.aggregate({
            where: { tenantId },
            _sum: { totalAmount: true }
        })

        return {
            ...tenant,
            totalRevenue: revenue._sum.totalAmount || 0
        }
    }

    /**
     * Updates a tenant's subscription plan.
     */
    async updateTenantPlan(tenantId: string, plan: string) {
        return prisma.tenant.update({
            where: { id: tenantId },
            data: { plan }
        })
    }

    /**
     * Updates a tenant's operational status (e.g., ACTIVE, SUSPENDED).
     */
    async updateTenantStatus(tenantId: string, status: string) {
        return prisma.tenant.update({
            where: { id: tenantId },
            data: { status }
        })
    }

    /**
     * Aggregates platform-wide Key Performance Indicators.
     */
    async getPlatformStats() {
        const [totalTenants, activeTenants, totalOrders, totalRevenue] = await Promise.all([
            prisma.tenant.count(),
            prisma.tenant.count({ where: { status: 'ACTIVE' } }),
            prisma.order.count(),
            prisma.order.aggregate({ _sum: { totalAmount: true } })
        ])

        return {
            totalTenants,
            activeTenants,
            totalOrders,
            totalRevenue: totalRevenue._sum.totalAmount || 0
        }
    }

    /**
     * Performs a cascading delete of a tenant and all its associated data.
     * WARNING: Irreversible action.
     */
    async deleteTenant(tenantId: string) {
        return prisma.$transaction(async (tx) => {
            // 1. Delete transactional data (Deepest in the FK chain)
            await tx.orderItem.deleteMany({ where: { order: { tenantId } } })
            await tx.order.deleteMany({ where: { tenantId } })
            await tx.productionRecord.deleteMany({ where: { branch: { tenantId } } })
            await tx.preparedStock.deleteMany({ where: { branch: { tenantId } } })
            await tx.purchaseRecord.deleteMany({ where: { tenantId } })
            await tx.stock.deleteMany({ where: { tenantId } })
            
            // 2. Delete structural data
            await tx.recipeItem.deleteMany({ where: { product: { tenantId } } })
            await tx.branchProduct.deleteMany({ where: { branch: { tenantId } } })
            await tx.product.deleteMany({ where: { tenantId } })
            await tx.ingredient.deleteMany({ where: { tenantId } })
            await tx.supplier.deleteMany({ where: { tenantId } })
            
            // 3. Delete organization data
            await tx.user.deleteMany({ where: { tenantId } })
            await tx.branch.deleteMany({ where: { tenantId } })
            await tx.role.deleteMany({ where: { tenantId } })
            
            // 4. Finally delete the tenant
            return tx.tenant.delete({ where: { id: tenantId } })
        })
    }
}
