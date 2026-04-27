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

    /**
     * Complete onboarding transaction: Tenant + Multi-standard Roles + Owner User + Initial Branch.
     */
    async setupNewBusiness(data: {
        user: { name: string; email: string; password?: string };
        business: { name: string; plan?: string };
        branch: { name: string };
    }) {
        // 1. Validate redundancy
        const existingUser = await prisma.user.findUnique({
            where: { email: data.user.email }
        })
        if (existingUser) {
            throw new Error('Email already in use')
        }

        // 2. Execute Transaction
        return await prisma.$transaction(async (tx) => {
            // a. Create Tenant
            const tenant = await tx.tenant.create({
                data: {
                    name: data.business.name,
                    plan: data.business.plan || 'basic',
                }
            })

            // b. Create standard Roles for this tenant
            const standardRoles = ['Owner', 'Manager', 'Staff', 'Chef']
            const createdRoles = await Promise.all(
                standardRoles.map(roleName => tx.role.create({
                    data: { name: roleName, tenantId: tenant.id }
                }))
            )

            const ownerRole = createdRoles.find(r => r.name === 'Owner')!

            // c. Create initial Branch
            const branch = await tx.branch.create({
                data: {
                    name: data.branch.name,
                    tenantId: tenant.id
                }
            })

            // d. Create Owner User
            const user = await tx.user.create({
                data: {
                    name: data.user.name,
                    email: data.user.email,
                    password: data.user.password || 'password123',
                    tenantId: tenant.id,
                    roleId: ownerRole.id,
                    branchId: branch.id
                }
            })

            return { tenant, user, branch }
        })
    }
}
