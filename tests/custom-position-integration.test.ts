import { describe, it, expect, beforeEach } from 'vitest'
import { RoleService } from '@/services/role-service'
import { UserService } from '@/services/user-service'
import prisma from '@/lib/prisma'

describe('Custom Position Integration', () => {
    let tenantId: string
    let roleService: RoleService
    let userService: UserService

    beforeEach(async () => {
        tenantId = `test-role-${Math.random().toString(36).substring(7)}`
        roleService = new RoleService()
        userService = new UserService(tenantId)
        // Cleanup
        await prisma.user.deleteMany({ where: { tenantId } })
        await prisma.role.deleteMany({ where: { tenantId } })
        await prisma.branch.deleteMany({ where: { tenantId } })
        await prisma.tenant.deleteMany({ where: { id: tenantId } })

        // Setup
        await prisma.tenant.create({ data: { id: tenantId, name: 'Test Food Corp' } })
    })

    it('should allow creating a custom role and assigning it to a new staff member', async () => {
        // 1. Create custom role
        const role = await roleService.createRole(tenantId, 'Senior Sommelier')
        expect(role.name).toBe('Senior Sommelier')

        // 2. Setup branch
        const branch = await prisma.branch.create({
            data: { name: 'Vineyard Branch', tenantId }
        })

        // 3. Invite user with custom role
        const userEmail = `juan-${Math.random().toString(36).substring(7)}@sommelier.com`
        const user = await userService.inviteUser({
            name: 'Juan Sommelier',
            email: userEmail,
            roleName: 'Senior Sommelier',
            branchId: branch.id
        })

        expect(user.role.name).toBe('Senior Sommelier')
        expect(user.name).toBe('Juan Sommelier')
    })
})
