import prisma from '@/lib/prisma'

export class AuthService {
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

    /**
     * Verifies if a user belongs to a specific tenant/branch.
     */
    async verifyContext(userId: string, tenantId: string, branchId?: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user || user.tenantId !== tenantId) return false
        if (branchId && user.branchId && user.branchId !== branchId) return false

        return true
    }
}
