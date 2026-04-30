import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AnalyticsService } from '@/services/analytics-service'
import prisma from '@/lib/prisma'
import { FeatureService } from '@/services/feature-service'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        order: {
            aggregate: vi.fn(),
            groupBy: vi.fn(),
        },
        stock: {
            findMany: vi.fn(),
        },
        branch: {
            findMany: vi.fn(),
        }
    },
}))

// Mock FeatureService
vi.mock('@/services/feature-service')

describe('AnalyticsService (Consolidation - Phase 4 TDD)', () => {
    const tenantId = 'tenant-1'
    let service: AnalyticsService

    beforeEach(() => {
        vi.clearAllMocks()
        service = new AnalyticsService(tenantId)
        vi.spyOn(FeatureService.prototype, 'hasFeature').mockResolvedValue(true)
    })

    it('should aggregate total sales across all branches of a tenant', async () => {
        ;(prisma.order.aggregate as any).mockResolvedValue({
            _sum: { totalAmount: 5000.50 }
        })

        const total = await service.getGlobalSales()

        expect(total).toBe(5000.50)
        expect(prisma.order.aggregate).toHaveBeenCalledWith(expect.objectContaining({
            where: { tenantId },
            _sum: { totalAmount: true }
        }))
    })

    it('should fail if dashboard feature is not enabled', async () => {
        vi.spyOn(FeatureService.prototype, 'hasFeature').mockResolvedValue(false)
        await expect(service.getGlobalSales()).rejects.toThrow(/Feature 'dashboard' is not enabled/)
    })

    it('should return branch performance ranked by sales including zero sales branches', async () => {
        const mockBranches = [
            { id: 'branch-A', name: 'Branch A' },
            { id: 'branch-B', name: 'Branch B' },
            { id: 'branch-C', name: 'Branch C' },
        ]
        const mockSales = [
            { branchId: 'branch-A', _sum: { totalAmount: 1000 } },
            { branchId: 'branch-B', _sum: { totalAmount: 500 } },
        ]
        
        ;(prisma.branch.findMany as any).mockResolvedValue(mockBranches)
        ;(prisma.order.groupBy as any).mockResolvedValue(mockSales)

        const performance = await service.getBranchPerformance()

        expect(performance).toHaveLength(3)
        expect(performance[0].branchId).toBe('branch-A')
        expect(performance[0]._sum.totalAmount).toBe(1000)
        expect(performance[2].branchId).toBe('branch-C')
        expect(performance[2]._sum.totalAmount).toBe(0)
    })

    it('should fetch critical stock across all branches', async () => {
        ;(prisma.stock.findMany as any).mockResolvedValue([])

        await service.getGlobalCriticalStock(5)

        expect(prisma.stock.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: {
                tenantId,
                quantity: { lte: 5 }
            }
        }))
    })
})
