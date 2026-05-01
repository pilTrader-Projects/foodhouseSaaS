import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { TenantService } from '@/services/tenant-service'
import { PERMISSIONS } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { cleanupTenant } from './utils/cleanup'

describe('Onboarding Permission Isolation (Regression Prevention)', () => {
    const tenantService = new TenantService()
    const email = 'isolation-test@example.com'
    let createdTenantId: string | null = null

    beforeEach(async () => {
        // Initial safety cleanup
        await prisma.user.deleteMany({ where: { email } })
    })

    it('should NOT grant system:admin or access:admin to a newly onboarded Tenant Owner', async () => {
        // 1. Perform Onboarding
        const result = await tenantService.setupNewBusiness({
            user: {
                name: 'Test Owner',
                email: email,
                password: 'Password123!'
            },
            business: {
                name: 'Isolation Test Corp',
                plan: 'standard'
            },
            branch: {
                name: 'Main Branch'
            }
        })

        createdTenantId = result.tenant.id

        // 2. Fetch the created role with its permissions
        const ownerRole = await prisma.role.findUnique({
            where: { id: result.user.roleId },
            include: { permissions: true }
        })

        const permissionNames = ownerRole?.permissions.map(p => p.name) || []

        // 3. STRICT ASSERTIONS:
        expect(permissionNames).toContain(PERMISSIONS.ACCESS_DASHBOARD)
        expect(permissionNames).not.toContain('system:admin')
<<<<<<< Updated upstream
=======
        expect(permissionNames).not.toContain('access:admin')
>>>>>>> Stashed changes
        
        console.log('✅ Onboarding Isolation Verified: No permission leakage detected.')
    }, 30000)

    afterAll(async () => {
<<<<<<< Updated upstream
        // CLEANUP PROCESS: Remove all data created during this integration test
        if (createdTenantId) {
            console.log(`🧹 Cleaning up test data for Tenant: ${createdTenantId}...`)
            // Delete in reverse order of dependencies
            await prisma.user.deleteMany({ where: { tenantId: createdTenantId } })
            await prisma.branch.deleteMany({ where: { tenantId: createdTenantId } })
            await prisma.role.deleteMany({ where: { tenantId: createdTenantId } })
            await prisma.tenant.delete({ where: { id: createdTenantId } })
            console.log('✨ Test database is clean.')
        }
=======
        await cleanupTenant(createdTenantId)
>>>>>>> Stashed changes
    })
})
