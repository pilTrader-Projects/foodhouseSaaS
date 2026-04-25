import prisma from '@/lib/prisma'

/**
 * TenantService handles the core SaaS management logic, 
 * including onboarding new businesses and creating branches.
 */
export class TenantService {
    /**
     * Creates a new business tenant with initial configuration.
     */
    async createTenant(data: { name: string }) {
        return prisma.tenant.create({
            data: {
                name: data.name,
                plan: 'basic',
                features: [],
            },
        })
    }

    /**
     * Creates a new branch for a specific tenant.
     */
    async createBranch(data: { name: string; tenantId: string }) {
        return prisma.branch.create({
            data: {
                name: data.name,
                tenantId: data.tenantId,
            },
        })
    }
}
