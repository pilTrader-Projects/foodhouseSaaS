import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProcurementService } from '@/services/procurement-service'
import prisma from '@/lib/prisma'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        $transaction: vi.fn((callback) => callback(prisma)),
        purchaseRecord: {
            createMany: vi.fn(),
        },
        stock: {
            upsert: vi.fn(),
        },
        tenant: {
            findUnique: vi.fn().mockResolvedValue({
                plan: 'basic',
                features: ['inventory', 'pos']
            }),
        },
    },
}))

describe('ProcurementService', () => {
    const tenantId = 'tenant-123'
    const branchId = 'branch-456'
    let service: ProcurementService

    beforeEach(() => {
        vi.clearAllMocks()
        service = new ProcurementService(tenantId, branchId)
    })

    it('should record delivery items and update stock levels', async () => {
        const supplierId = 'supp-789'
        const items = [
            { ingredientId: 'ing-1', quantity: 10, unitCost: 5 },
            { ingredientId: 'ing-2', quantity: 20, unitCost: 10 }
        ]

        await service.recordDelivery(supplierId, items)

        // Verify purchase records creation
        expect(prisma.purchaseRecord.createMany).toHaveBeenCalledWith({
            data: items.map(item => ({
                ...item,
                supplierId,
                tenantId,
                branchId,
                totalCost: item.quantity * item.unitCost
            }))
        })

        // Verify stock upserts
        expect(prisma.stock.upsert).toHaveBeenCalledTimes(2)
        expect(prisma.stock.upsert).toHaveBeenCalledWith(expect.objectContaining({
            where: { branchId_ingredientId: { branchId, ingredientId: 'ing-1' } },
            update: { quantity: { increment: 10 } },
            create: { branchId, ingredientId: 'ing-1', tenantId, quantity: 10 }
        }))
    })

    it('should fail if the inventory feature is missing', async () => {
        // Mock feature missing
        vi.mocked(prisma.tenant.findUnique).mockResolvedValueOnce({
            plan: 'legacy',
            features: []
        })

        const items = [{ ingredientId: 'ing-1', quantity: 10, unitCost: 5 }]

        await expect(service.recordDelivery('supp-1', items))
            .rejects.toThrow(/is not enabled for this tenant/)
    })

    it('should handle empty delivery lists gracefully', async () => {
        await service.recordDelivery('supp-1', [])
        expect(prisma.purchaseRecord.createMany).not.toHaveBeenCalled()
        expect(prisma.stock.upsert).not.toHaveBeenCalled()
    })
})
