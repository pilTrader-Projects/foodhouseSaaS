import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/onboarding/route'
import { TenantService } from '@/services/tenant-service'
import { NextRequest } from 'next/server'

// Mock services
vi.mock('@/services/tenant-service')
vi.mock('@/services/feature-service')

describe('API: Onboarding Route', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should successfully complete full onboarding and return tenant info', async () => {
        const mockResult = {
            tenant: { id: 'tenant-123', plan: 'pro' },
            user: { id: 'user-456' },
            branch: { id: 'branch-789' }
        }
        vi.spyOn(TenantService.prototype, 'setupNewBusiness').mockResolvedValue(mockResult as any)

        const payload = {
            user: { name: 'John', email: 'john@test.com', password: 'pass' },
            business: { name: 'John Store', plan: 'pro' },
            branch: { name: 'Main' }
        }

        const req = new NextRequest('http://localhost/api/onboarding', {
            method: 'POST',
            body: JSON.stringify(payload)
        })

        const response = await POST(req)
        const body = await response.json()

        expect(response.status).toBe(200)
        expect(TenantService.prototype.setupNewBusiness).toHaveBeenCalledWith(payload)
        expect(body.tenantId).toBe('tenant-123')
        expect(body.userId).toBe('user-456')
    })

    it('should return 500 if setupNewBusiness fails', async () => {
        vi.spyOn(TenantService.prototype, 'setupNewBusiness').mockRejectedValue(new Error('Transaction Failed'))

        const req = new NextRequest('http://localhost/api/onboarding', {
            method: 'POST',
            body: JSON.stringify({ business: { name: 'Fail' } }) // Partial/Invalid but enough to trigger call in mock
        })

        const response = await POST(req)
        const body = await response.json()

        expect(response.status).toBe(500)
        expect(body.error).toBe('Transaction Failed')
    })
})
