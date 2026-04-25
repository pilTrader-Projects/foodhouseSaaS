import prisma from '@/lib/prisma'

/**
 * BaseService ensures that every database query is scoped to the correct tenant and branch.
 * This prevents data leakage between businesses.
 */
export class BaseService {
    protected tenantId: string
    protected branchId?: string

    constructor(tenantId: string, branchId?: string) {
        if (!tenantId) {
            throw new Error('Tenant ID is required for BaseService')
        }
        this.tenantId = tenantId
        this.branchId = branchId
    }

    /**
     * Helper to append tenant and branch scoping to Prisma queries.
     */
    protected getScope() {
        return {
            tenantId: this.tenantId,
            ...(this.branchId ? { branchId: this.branchId } : {}),
        }
    }
}
