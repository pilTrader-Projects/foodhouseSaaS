import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProductionService } from '@/services/production-service'
import { DeductionService } from '@/services/deduction-service'
import prisma from '@/lib/prisma'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        $transaction: vi.fn((fn) => fn(prisma)),
        product: {
            findUnique: vi.fn(),
        },
        preparedStock: {
            upsert: vi.fn(),
        },
        productionRecord: {
            create: vi.fn(),
        }
    },
}))

// Mock DeductionService
vi.mock('@/services/deduction-service')

describe('ProductionService (K-2 Hybrid)', () => {
    let service: ProductionService
    const tenantId = 'tenant-1'
    const branchId = 'branch-1'

    beforeEach(() => {
        vi.clearAllMocks()
        service = new ProductionService(tenantId, branchId)
    })

    it('should record production and delegate ingredient deduction to DeductionService', async () => {
        const productId = 'p1'
        const numBatches = 2
        const batchSize = 10
        const totalYield = numBatches * batchSize

            // 1. Setup Mocks
            ; (prisma.product.findUnique as any).mockResolvedValue({ id: productId, batchSize })

        // 2. Execute
        await service.recordProduction(productId, numBatches)

        // 3. Verify DeductionService was called for ingredients
        expect(DeductionService.prototype.deductRecipeComponents).toHaveBeenCalledWith(expect.objectContaining({ id: productId }), numBatches, expect.anything())

        // 4. Verify PreparedStock update (transactional context)
        expect(prisma.preparedStock.upsert).toHaveBeenCalledWith(expect.objectContaining({
            where: { branchId_productId: { branchId, productId } },
            update: { quantity: { increment: totalYield } }
        }))

        // 5. Verify ProductionRecord creation
        expect(prisma.productionRecord.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({ productId, quantity: totalYield })
        }))
    })
})
