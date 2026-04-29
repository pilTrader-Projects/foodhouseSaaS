import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET as GET_STATS } from '@/app/api/admin/stats/route'
import { GET as GET_TENANTS } from '@/app/api/admin/tenants/route'
import { PATCH as PATCH_TENANT } from '@/app/api/admin/tenants/[id]/route'
import { GlobalAdminService } from '@/services/global-admin-service'
import { AuthService } from '@/services/auth-service'
import { NextRequest } from 'next/server'

vi.mock('@/services/global-admin-service')
vi.mock('@/services/auth-service')

describe('API: Admin Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Default mock for hasPermission to allow access by default in happy path
        vi.spyOn(AuthService.prototype, 'hasPermission').mockResolvedValue(true)
    })

    it('should return 403 if user lacks system:admin permission', async () => {
        vi.spyOn(AuthService.prototype, 'hasPermission').mockResolvedValue(false)

        const req = new NextRequest('http://localhost/api/admin/stats', {
            headers: { 'x-user-id': 'user-123' }
        })
        const response = await GET_STATS(req)

        expect(response.status).toBe(403)
        const body = await response.json()
        expect(body.error).toContain('Forbidden')
    })

    it('should return platform stats', async () => {
        const mockStats = { totalTenants: 5, activeTenants: 4, totalOrders: 100, totalRevenue: 5000 }
        vi.spyOn(GlobalAdminService.prototype, 'getPlatformStats').mockResolvedValue(mockStats)

        const req = new NextRequest('http://localhost/api/admin/stats', {
            headers: { 'x-user-id': 'admin-123' }
        })

        const response = await GET_STATS(req)
        const body = await response.json()

        expect(response.status).toBe(200)
        expect(body.totalTenants).toBe(5)
    })

    it('should list all tenants', async () => {
        const mockTenants = [{ id: 't1', name: 'Tenant 1' }]
        vi.spyOn(GlobalAdminService.prototype, 'getTenants').mockResolvedValue(mockTenants as any)

        const req = new NextRequest('http://localhost/api/admin/tenants', {
            headers: { 'x-user-id': 'admin-123' }
        })

        const response = await GET_TENANTS(req)
        const body = await response.json()

        expect(response.status).toBe(200)
        expect(body).toHaveLength(1)
    })

    it('should update tenant plan', async () => {
        vi.spyOn(GlobalAdminService.prototype, 'updateTenantPlan').mockResolvedValue({ id: 't1', plan: 'pro' } as any)

        const req = new NextRequest('http://localhost/api/admin/tenants/t1', {
            method: 'PATCH',
            headers: { 'x-user-id': 'admin-123' },
            body: JSON.stringify({ plan: 'pro' })
        })

        const response = await PATCH_TENANT(req, { params: { id: 't1' } } as any)
        const body = await response.json()

        expect(response.status).toBe(200)
        expect(body.plan).toBe('pro')
    })
})
