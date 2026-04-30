import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/analytics/global-sales/route'
import { AnalyticsService } from '@/services/analytics-service'
import { AuthService } from '@/services/auth-service'
import { NextRequest } from 'next/server'

// Mock AnalyticsService and AuthService
vi.mock('@/services/analytics-service')
vi.mock('@/services/auth-service')

describe('API: Global Sales Route (Task 5.1 TDD)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should return 400 if x-user-id is missing', async () => {
        const req = new NextRequest('http://localhost/api/analytics/global-sales')
        const response = await GET(req)
        
        expect(response.status).toBe(400)
        const body = await response.json()
        expect(body.error).toContain('User ID is required')
    })

    it('should return global sales data for a valid tenant and user', async () => {
        // 1. Mock the user scope resolution
        vi.spyOn(AuthService.prototype, 'getUserScope').mockResolvedValue({
            tenantId: 'tenant-1',
            branchId: undefined,
            role: 'Owner'
        })

        // 2. Mock the service call
        vi.spyOn(AnalyticsService.prototype, 'getGlobalSales').mockResolvedValue(1234.56)

        const req = new NextRequest('http://localhost/api/analytics/global-sales', {
            headers: { 
                'x-tenant-id': 'tenant-1',
                'x-user-id': 'user-1'
            }
        })

        const response = await GET(req)
        const body = await response.json()

        expect(response.status).toBe(200)
        expect(body.totalSales).toBe(1234.56)
    })

    it('should return 500 if the service fails', async () => {
        vi.spyOn(AuthService.prototype, 'getUserScope').mockResolvedValue({
            tenantId: 'tenant-1',
            branchId: undefined,
            role: 'Owner'
        })
        vi.spyOn(AnalyticsService.prototype, 'getGlobalSales').mockRejectedValue(new Error('DB Error'))

        const req = new NextRequest('http://localhost/api/analytics/global-sales', {
            headers: { 
                'x-tenant-id': 'tenant-1',
                'x-user-id': 'user-1'
            }
        })

        const response = await GET(req)
        expect(response.status).toBe(500)
        const body = await response.json()
        expect(body.error).toBe('DB Error')
    })
})
