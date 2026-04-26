import prisma from '@/lib/prisma'
import { FeatureService } from './feature-service'

/**
 * TenantService handles the core SaaS management logic, 
 * including onboarding new businesses and creating branches.
 */
export class TenantService {
    private featureService: FeatureService

    constructor(featureService?: FeatureService) {
        this.featureService = featureService || new FeatureService()
    }
    /**
     * Creates a new business tenant with initial configuration.
     */
    async createTenant(data: { name: string; plan?: string }) {
        return prisma.tenant.create({
            data: {
                name: data.name,
                plan: data.plan || 'basic',
                features: [],
            },
        })
    }

    /**
     * Creates a new branch for a specific tenant.
     */
    async createBranch(data: { name: string; tenantId: string }) {
        // 1. Check Limits
        const currentBranches = await prisma.branch.count({
            where: { tenantId: data.tenantId }
        })

        const canCreate = await this.featureService.checkLimit(data.tenantId, 'max_branches', currentBranches)

        if (!canCreate) {
            throw new Error('Subscription limit reached: You have reached the maximum number of branches allowed for your plan.')
        }

        return prisma.branch.create({
            data: {
                name: data.name,
                tenantId: data.tenantId,
            },
        })
    }
}
