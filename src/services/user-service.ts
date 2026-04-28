import { BaseService } from './base-service'
import prisma from '@/lib/prisma'
import { ROLES } from '@/lib/constants'

/**
 * UserService manages branch personnel, invitations, and role assignments.
 */
export class UserService extends BaseService {
    /**
     * Invites a new user to the business and assigns them to a branch and role.
     * Enforces plan-based user limits.
     */
    async inviteUser(data: {
        name: string;
        email: string;
        roleName: string;
        branchId: string;
        password?: string;
    }) {
        // 1. Check Feature Gating / Limits
        const currentUsers = await prisma.user.count({
            where: { tenantId: this.tenantId }
        })

        const canCreate = await this.featureService.checkLimit(this.tenantId, 'max_users', currentUsers)
        if (!canCreate) {
            throw new Error('Subscription limit reached: You have reached the maximum number of users allowed for your plan.')
        }

        // 2. Resolve Role
        const role = await prisma.role.findFirst({
            where: {
                name: data.roleName,
                OR: [
                    { tenantId: this.tenantId },
                    { tenantId: null } // System-wide roles
                ]
            }
        })

        if (!role) {
            throw new Error(`Role '${data.roleName}' not found.`)
        }

        // 3. Create User
        return prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password || 'change-me-later',
                tenantId: this.tenantId,
                branchId: data.branchId,
                roleId: role.id
            },
            include: { role: true, branch: true }
        })
    }

    /**
     * Fetches all employees for the tenant, optionally filtered by branch.
     */
    async getTeam(branchId?: string) {
        return prisma.user.findMany({
            where: { 
                tenantId: this.tenantId,
                ...(branchId ? { branchId } : {})
            },
            include: { role: true, branch: true },
            orderBy: { createdAt: 'desc' }
        })
    }
}
