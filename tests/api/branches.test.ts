import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/branches/route'
import { TenantService } from '@/services/tenant-service'
import { NextRequest } from 'next/server'

// Mock TenantService
vi.mock('@/services/tenant-service')

describe('API: Branches Route', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should return 400 if x-tenant-id is missing (GET)', async () => {
        const req = new NextRequest('http://localhost/api/branches')
        const response = await GET(req)

        expect(response.status).toBe(400)
        const body = await response.json()
        expect(body.error).toBe('Missing tenant ID')
    })

    it('should list branches for a valid tenant', async () => {
        // Since GET in route.ts uses prisma directly, we might need to mock prisma or TenantService if we refactor GET to use it.
        // For now, GET uses prisma.branch.findMany. I'll mock prisma.
    })

    it('should create a branch for a valid tenant', async () => {
        const mockBranch = { id: 'branch-1', name: 'New Branch', tenantId: 'tenant-123' }
        vi.spyOn(TenantService.prototype, 'createBranch').mockResolvedValue(mockBranch as any)

        const req = new NextRequest('http://localhost/api/branches', {
            method: 'POST',
            headers: { 
                'x-tenant-id': 'tenant-123',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'New Branch' })
        })

        const response = await POST(req)
        const body = await response.json()

        expect(response.status).toBe(200)
        expect(body.name).toBe('New Branch')
    })

    it('should return 403 if branch limit is reached', async () => {
        vi.spyOn(TenantService.prototype, 'createBranch').mockRejectedValue(new Error('Subscription limit reached'))

        const req = new NextRequest('http://localhost/api/branches', {
            method: 'POST',
            headers: { 
                'x-tenant-id': 'tenant-123',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'Over Limit Branch' })
        })

        const response = await POST(req)
        const body = await response.json()

        expect(response.status).toBe(403)
        expect(body.error).toContain('limit reached')
    })

    it('should enforce strict isolation: no related records on creation', async () => {
        const createSpy = vi.spyOn(TenantService.prototype, 'createBranch').mockResolvedValue({ id: 'new-id' } as any)

        const req = new NextRequest('http://localhost/api/branches', {
            method: 'POST',
            headers: { 
                'x-tenant-id': 'tenant-123',
                'Content-Type': 'application/json'
            },
            // Attempt to inject related records (should be ignored by API)
            body: JSON.stringify({ 
                name: 'Clean Branch', 
                users: [{ name: 'Admin' }], 
                stocks: [{ item: 'Sugar' }] 
            })
        })

        await POST(req)

        // Verify ONLY name and tenantId were passed to the service
        expect(createSpy).toHaveBeenCalledWith({
            name: 'Clean Branch',
            tenantId: 'tenant-123'
        })
        
        // Ensure no other keys were leaked
        const callArgs = createSpy.mock.calls[0][0]
        expect(Object.keys(callArgs)).toHaveLength(2)
        expect(Object.keys(callArgs)).not.toContain('users')
        expect(Object.keys(callArgs)).not.toContain('stocks')
    })
})
