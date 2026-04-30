import prisma from '@/lib/prisma'
import { FeatureService } from './feature-service'
import { PERMISSIONS, ROLES } from '@/lib/constants'

/**
 * TenantService handles the core SaaS management logic, 
 * including onboarding new businesses and creating branches.
 */
export class TenantService {
    private featureService: FeatureService

    constructor(featureService?: FeatureService) {
        this.featureService = featureService || new FeatureService()
    }

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
     * Complete onboarding transaction: Tenant + Multi-standard Roles + Owner User + Initial Branch.
     */
    async setupNewBusiness(data: {
        user: { name: string; email: string; password?: string };
        business: { name: string; plan?: string };
        branch: { name: string };
    }) {
        const existingUser = await prisma.user.findUnique({ where: { email: data.user.email } })
        if (existingUser) throw new Error('Email already in use')

        return await prisma.$transaction(async (tx) => {
            // 1. Create Tenant
            const tenant = await tx.tenant.create({
                data: {
                    name: data.business.name,
                    plan: data.business.plan || 'basic',
                }
            })

            // 2. Fetch Global Permissions
            const perms = await tx.permission.findMany()
            const getPermIds = (...names: string[]) => perms.filter(p => names.includes(p.name)).map(p => ({ id: p.id }))

            // 3. Define Standard Roles with initial permission mapping
            const rolesData = [
                { name: ROLES.OWNER, permissions: perms.map(p => ({ id: p.id })) },
                {
                    name: ROLES.MANAGER,
                    permissions: getPermIds(
                        PERMISSIONS.ACCESS_DASHBOARD,
                        PERMISSIONS.ACCESS_POS,
                        PERMISSIONS.ACCESS_INVENTORY,
                        PERMISSIONS.ACCESS_KITCHEN,
                        PERMISSIONS.ACCESS_MENU
                    )
                },
                { name: ROLES.CHEF, permissions: getPermIds(PERMISSIONS.ACCESS_KITCHEN, PERMISSIONS.ACCESS_INVENTORY) },
                { name: ROLES.STAFF, permissions: getPermIds(PERMISSIONS.ACCESS_POS) }
            ]

            const createdRoles = await Promise.all(
                rolesData.map(role => tx.role.create({
                    data: {
                        name: role.name,
                        tenantId: tenant.id,
                        permissions: { connect: role.permissions }
                    }
                }))
            )

            const ownerRole = createdRoles.find(r => r.name === ROLES.OWNER)!

            // 4. Create initial Branch
            const branch = await tx.branch.create({
                data: {
                    name: data.branch.name,
                    tenantId: tenant.id
                }
            })

            // 5. Create Owner User
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
        }, {
            timeout: 15000
        })
    }

    /**
     * Provisions a new branch for a tenant.
     * 
     * [STRICT] New branches must be initialized in a clean state:
     * - No employees assigned.
     * - No initial inventory.
     * - No transaction history.
     */
    async createBranch(data: { name: string; tenantId: string }) {
        const currentBranches = await prisma.branch.count({ where: { tenantId: data.tenantId } })
        const canCreate = await this.featureService.checkLimit(data.tenantId, 'max_branches', currentBranches)

        if (!canCreate) {
            throw new Error('Subscription limit reached')
        }

        return prisma.branch.create({
            data: {
                name: data.name,
                tenantId: data.tenantId,
            },
        })
    }
}
