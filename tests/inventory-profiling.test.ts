import { describe, it, expect, vi, beforeEach } from 'vitest'
import { InventoryService } from '@/modules/inventory/services/inventory-service'
import prisma from '@/lib/prisma'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        ingredient: {
            findMany: vi.fn(),
        },
        tenant: {
            findUnique: vi.fn().mockResolvedValue({
                plan: 'basic',
                features: ['inventory', 'pos']
            }),
        },
    },
}))

describe('Inventory Profiling Service', () => {
    const tenantId = 'tenant-123'
    const branchId = 'branch-456'

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should aggregate ingredients with branch stock levels', async () => {
        const service = new InventoryService(tenantId, branchId)

        // Mock DB response
        const mockData = [
            { id: '1', name: 'Flour', unit: 'KG', stocks: [{ quantity: 50 }] },
            { id: '2', name: 'Sugar', unit: 'KG', stocks: [] }
        ]
        vi.mocked(prisma.ingredient.findMany).mockResolvedValue(mockData as any)

        const result = await service.getBranchStock()

        expect(prisma.ingredient.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: { tenantId },
            include: {
                stocks: {
                    where: { branchId }
                }
            }
        }))
        expect(result).toHaveLength(2)
        expect(result[0].name).toBe('Flour')
    })

    it('should fail if branch context is missing', async () => {
        const service = new InventoryService(tenantId) // No branchId

        await expect(service.getBranchStock())
            .rejects.toThrow(/Branch context required/)
    })
})
