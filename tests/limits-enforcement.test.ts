import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TenantService } from '@/services/tenant-service'
import prisma from '@/lib/prisma'
import { FeatureService } from '@/services/feature-service'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        tenant: {
            findUnique: vi.fn(),
        },
        branch: {
            count: vi.fn(),
            create: vi.fn(),
        },
        user: {
            count: vi.fn(),
            create: vi.fn(),
        }
    },
}))

describe('Subscription Limits Enforcement (S-5)', () => {
    let tenantService: TenantService
    let featureService: FeatureService

    beforeEach(() => {
        vi.clearAllMocks()
        // In a real app with DI, we would inject this
        featureService = new FeatureService()
        tenantService = new TenantService(featureService)
    })

    it('should allow creating a branch if within limits', async () => {
        const tenantId = 'tenant-basic'

            // Mock tenant to be on basic plan (limit 1)
            ; (prisma.tenant.findUnique as any).mockResolvedValue({ id: tenantId, plan: 'basic', features: [] })
            // Current count is 0
            ; (prisma.branch.count as any).mockResolvedValue(0)
            ; (prisma.branch.create as any).mockResolvedValue({ id: 'branch-1' })

        const branch = await tenantService.createBranch({ name: 'Branch 1', tenantId })

        expect(branch).toBeDefined()
        expect(prisma.branch.create).toHaveBeenCalled()
    })

    it('should block creating a branch if limit exceeded', async () => {
        const tenantId = 'tenant-basic'

            // Mock tenant to be on basic plan (limit 1)
            ; (prisma.tenant.findUnique as any).mockResolvedValue({ id: tenantId, plan: 'basic', features: [] })
            // Current count is 1 (limit reached)
            ; (prisma.branch.count as any).mockResolvedValue(1)

        await expect(tenantService.createBranch({ name: 'Branch 2', tenantId }))
            .rejects.toThrow(/Subscription limit reached/)

        expect(prisma.branch.create).not.toHaveBeenCalled()
    })

    it('should allow unlimited branches if "unlimited_branches" feature is enabled', async () => {
        const tenantId = 'tenant-custom'

            // Mock tenant to be on basic plan BUT with unlimited_branches feature
            ; (prisma.tenant.findUnique as any).mockResolvedValue({
                id: tenantId,
                plan: 'basic',
                features: ['unlimited_branches']
            })
            // Current count is 10
            ; (prisma.branch.count as any).mockResolvedValue(10)
            ; (prisma.branch.create as any).mockResolvedValue({ id: 'branch-11' })

        const branch = await tenantService.createBranch({ name: 'Branch 11', tenantId })

        expect(branch).toBeDefined()
        expect(prisma.branch.create).toHaveBeenCalled()
    })
})
