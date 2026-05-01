import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import { GlobalAdminService } from '../src/services/global-admin-service'
import prisma from '../src/lib/prisma'

describe('GlobalAdminService', () => {
    let adminService: GlobalAdminService

    const testTenantIdA = 'admin-test-t1'
    const testTenantIdB = 'admin-test-t2'

    const testTenantIds = [testTenantIdA, testTenantIdB, 'admin-test-upgrade', 'admin-test-status', 'admin-test-stats']

    beforeEach(async () => {
        adminService = new GlobalAdminService()
        
        // Targeted cleanup of ONLY our test tenants
        await prisma.branch.deleteMany({ where: { tenantId: { in: testTenantIds } } })
        await prisma.user.deleteMany({ where: { tenantId: { in: testTenantIds } } })
        await prisma.tenant.deleteMany({ where: { id: { in: testTenantIds } } })
    })

    afterAll(async () => {
        // Final sweep cleanup
        await prisma.branch.deleteMany({ where: { tenantId: { in: testTenantIds } } })
        await prisma.user.deleteMany({ where: { tenantId: { in: testTenantIds } } })
        await prisma.tenant.deleteMany({ where: { id: { in: testTenantIds } } })
    })

    it('should list all tenants', async () => {
        await prisma.tenant.create({
            data: { id: testTenantIdA, name: 'Admin Test A', plan: 'basic' }
        })
        await prisma.tenant.create({
            data: { id: testTenantIdB, name: 'Admin Test B', plan: 'pro' }
        })

        const tenants = await adminService.getTenants()
        
        expect(tenants.length).toBeGreaterThanOrEqual(2)
        expect(tenants.some(t => t.id === testTenantIdA)).toBe(true)
        expect(tenants.some(t => t.id === testTenantIdB)).toBe(true)
    })

    it('should update tenant plan', async () => {
        const tenant = await prisma.tenant.create({
            data: { id: 'admin-test-upgrade', name: 'Upgrade Test', plan: 'basic' }
        })

        const updated = await adminService.updateTenantPlan(tenant.id, 'enterprise')
        expect(updated.plan).toBe('enterprise')

        const fetched = await prisma.tenant.findUnique({ where: { id: tenant.id } })
        expect(fetched?.plan).toBe('enterprise')
    })

    it('should update tenant status', async () => {
        const tenant = await prisma.tenant.create({
            data: { id: 'admin-test-status', name: 'Status Test', status: 'ACTIVE' }
        })

        const updated = await adminService.updateTenantStatus(tenant.id, 'SUSPENDED')
        expect(updated.status).toBe('SUSPENDED')
    })

    it('should fetch platform stats', async () => {
        await prisma.tenant.create({
            data: { id: 'admin-test-stats', name: 'Stat Tenant', plan: 'basic' }
        })

        const stats = await adminService.getPlatformStats()
        expect(stats.totalTenants).toBeGreaterThanOrEqual(1)
        expect(stats.activeTenants).toBeGreaterThanOrEqual(1)
    })
})
