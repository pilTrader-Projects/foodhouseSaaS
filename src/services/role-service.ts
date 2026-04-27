import prisma from '@/lib/prisma'

export class RoleService {
    /**
     * Fetch all roles applicable to a specific tenant.
     */
    async getRoles(tenantId: string) {
        return await prisma.role.findMany({
            where: {
                tenantId: tenantId
            },
            orderBy: {
                name: 'asc'
            }
        })
    }

    /**
     * Create a new custom position/role for a tenant.
     */
    async createRole(tenantId: string, name: string) {
        return await prisma.role.create({
            data: {
                name,
                tenantId
            }
        })
    }

    /**
     * Delete a custom position.
     * Prevents deletion of core roles (Owner, Manager, Staff, Chef) to maintain system stability.
     */
    async deleteRole(tenantId: string, roleId: string, roleName: string) {
        const protectedRoles = ['Owner', 'Manager', 'Staff', 'Chef']

        if (protectedRoles.includes(roleName)) {
            throw new Error(`Cannot delete protected system role: ${roleName}`)
        }

        return await prisma.role.delete({
            where: {
                id: roleId,
                tenantId: tenantId // Context guard
            }
        })
    }
}
