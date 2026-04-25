import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AnalyticsService } from '@/services/AnalyticsService'
import prisma from '@/lib/prisma'
import { FeatureService } from '@/services/FeatureService'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        order: {
            aggregate: vi.fn(),
            groupBy: vi.fn(),
        },
        stock: {
            findMany: vi.fn(),
        }
    },
}))

// Mock FeatureService
vi.mock('@/services/FeatureService')

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

    it('should return branch performance ranked by sales', async () => {
        const mockPerformance = [
            { branchId: 'branch-A', _sum: { totalAmount: 1000 } },
            { branchId: 'branch-B', _sum: { totalAmount: 500 } },
        ]
        ;(prisma.order.groupBy as any).mockResolvedValue(mockPerformance)

        const performance = await service.getBranchPerformance()

        expect(performance).toHaveLength(2)
        expect(prisma.order.groupBy).toHaveBeenCalledWith(expect.objectContaining({
            by: ['branchId'],
            where: { tenantId }
        }))
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
