import prisma from '@/lib/prisma'
import { FeatureService } from './feature-service'

export interface Session {
    userId: string
    tenantId: string
    branchId?: string
    role: string
    permissions: string[]
}

/**
 * AuthService manages user identity, sessions, and RBAC enforcement.
 */
export class AuthService {
    private featureService: FeatureService

    constructor() {
        this.featureService = new FeatureService()
    }

    /**
     * Simplified login for prototype. 
     * Returns a session object scoped to the user's primary tenant and branch.
     */
    async login(email: string): Promise<Session | null> {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                role: {
                    include: { permissions: true }
                }
            },
        })

        if (!user) return null

        return {
            userId: user.id,
            tenantId: user.tenantId,
            branchId: user.branchId || undefined,
            role: user.role.name,
            permissions: user.role.permissions.map(p => p.name)
        }
    }

    /**
     * Switches the active branch context for a session.
     */
    async switchBranch(userId: string, branchId: string): Promise<Session | null> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { 
                role: {
                    include: { permissions: true }
                } 
            },
        })

        if (!user) return null

        return {
            userId: user.id,
            tenantId: user.tenantId,
            branchId,
            role: user.role.name,
            permissions: user.role.permissions.map(p => p.name)
        }
    }

    /**
     * Checks if a user has a specific permission.
     */
    async hasPermission(userId: string, permissionName: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                role: {
                    include: {
                        permissions: true,
                    },
                },
            },
        })

        if (!user) return false

        // "tenant:admin" permission grants all access
        return user.role.permissions.some(
            (p) => p.name === permissionName || p.name === 'tenant:admin'
        )
    }
}
