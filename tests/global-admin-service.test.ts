import { describe, it, expect, beforeEach } from 'vitest'
import { GlobalAdminService } from '../src/services/global-admin-service'
import prisma from '../src/lib/prisma'

describe('GlobalAdminService', () => {
    let adminService: GlobalAdminService

    beforeEach(async () => {
        adminService = new GlobalAdminService()
        // Clear related data first to avoid FK constraints
        const tenantWhere = { isSystem: false }
        const branchWhere = { branch: { tenant: tenantWhere } }
        
        await prisma.orderItem.deleteMany({ where: { order: { tenant: tenantWhere } } })
        await prisma.order.deleteMany({ where: { tenant: tenantWhere } })
        await prisma.stock.deleteMany({ where: branchWhere })
        await prisma.branchProduct.deleteMany({ where: branchWhere })
        await prisma.productionRecord.deleteMany({ where: branchWhere })
        await prisma.purchaseRecord.deleteMany({ where: branchWhere })
        await prisma.preparedStock.deleteMany({ where: branchWhere })
        await prisma.user.deleteMany({ where: { tenant: tenantWhere } })
        await prisma.branch.deleteMany({ where: { tenant: tenantWhere } })
        await prisma.recipeItem.deleteMany({ where: { product: { tenant: tenantWhere } } })
        await prisma.product.deleteMany({ where: { tenant: tenantWhere } })
        await prisma.ingredient.deleteMany({ where: { tenant: tenantWhere } })
        await prisma.role.deleteMany({ where: { tenant: tenantWhere } })
        await prisma.supplier.deleteMany({ where: { tenant: tenantWhere } })
        await prisma.tenant.deleteMany({ where: tenantWhere })
    })

    it('should list all tenants', async () => {
        await prisma.tenant.create({
            data: { name: 'Tenant A', plan: 'basic' }
        })
        await prisma.tenant.create({
            data: { name: 'Tenant B', plan: 'pro' }
        })

        const tenants = await adminService.getTenants()
        // Should include system tenant + 2 new ones
        expect(tenants.length).toBeGreaterThanOrEqual(2)
        expect(tenants.some(t => t.name === 'Tenant A')).toBe(true)
        expect(tenants.some(t => t.name === 'Tenant B')).toBe(true)
    })

    it('should update tenant plan', async () => {
        const tenant = await prisma.tenant.create({
            data: { name: 'Upgrade Test', plan: 'basic' }
        })

        const updated = await adminService.updateTenantPlan(tenant.id, 'enterprise')
        expect(updated.plan).toBe('enterprise')

        const fetched = await prisma.tenant.findUnique({ where: { id: tenant.id } })
        expect(fetched?.plan).toBe('enterprise')
    })

    it('should update tenant status', async () => {
        const tenant = await prisma.tenant.create({
            data: { name: 'Status Test', status: 'ACTIVE' }
        })

        const updated = await adminService.updateTenantStatus(tenant.id, 'SUSPENDED')
        expect(updated.status).toBe('SUSPENDED')
    })

    it('should fetch platform stats', async () => {
        await prisma.tenant.create({
            data: { name: 'Stat Tenant', plan: 'basic' }
        })

        const stats = await adminService.getPlatformStats()
        expect(stats.totalTenants).toBeGreaterThanOrEqual(1)
        expect(stats.activeTenants).toBeGreaterThanOrEqual(1)
    })
})
