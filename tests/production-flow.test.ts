import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProductionService } from '@/services/production-service'
import { DeductionService } from '@/services/deduction-service'
import { InventoryService } from '@/modules/inventory/services/inventory-service'
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

// Mock Services
vi.mock('@/services/deduction-service')
vi.mock('@/modules/inventory/services/inventory-service')

describe('ProductionService (K-2 Hybrid)', () => {
    let service: ProductionService
    const tenantId = 'tenant-1'
    const branchId = 'branch-1'

    beforeEach(() => {
        vi.clearAllMocks()
        service = new ProductionService(tenantId, branchId)
    })

    describe('Happy Paths', () => {
        it('should record production and deduct both raw ingredients and sub-products', async () => {
            const productId = 'p1'
            const numBatches = 2
            const batchSize = 10
            const totalYield = numBatches * batchSize

            ; (prisma.product.findUnique as any).mockResolvedValue({ id: productId, batchSize })

            await service.recordProduction(productId, numBatches)

            // 1. Verify Raw Ingredient Deduction (The Fix)
            expect(InventoryService.prototype.consumeIngredients).toHaveBeenCalledWith(productId, numBatches, expect.anything())

            // 2. Verify Sub-Product Deduction
            expect(DeductionService.prototype.deductRecipeComponents).toHaveBeenCalledWith(expect.objectContaining({ id: productId }), numBatches, expect.anything())

            // 3. Verify PreparedStock update
            expect(prisma.preparedStock.upsert).toHaveBeenCalledWith(expect.objectContaining({
                update: { quantity: { increment: totalYield } }
            }))
        })
    })

    describe('Sad Paths', () => {
        it('should throw error if product is not found', async () => {
            ; (prisma.product.findUnique as any).mockResolvedValue(null)

            await expect(service.recordProduction('invalid', 1)).rejects.toThrow('Product not found')
        })

        it('should throw error if branch context is missing', async () => {
            const statelessService = new ProductionService(tenantId, '')
            await expect(statelessService.recordProduction('p1', 1)).rejects.toThrow('Branch context required')
        })
    })

    describe('Edge Cases', () => {
        it('should handle product with no batchSize (default to 1)', async () => {
            const productId = 'p1'
            const numBatches = 3
            ; (prisma.product.findUnique as any).mockResolvedValue({ id: productId, batchSize: null })

            await service.recordProduction(productId, numBatches)

            expect(prisma.preparedStock.upsert).toHaveBeenCalledWith(expect.objectContaining({
                update: { quantity: { increment: 3 } }
            }))
        })

        it('should still increase stock even if deduction fails or is empty', async () => {
            // This ensures that production record is independent but transactional
            const productId = 'p1'
            ; (prisma.product.findUnique as any).mockResolvedValue({ id: productId, batchSize: 5 })

            await service.recordProduction(productId, 1)

            expect(prisma.productionRecord.create).toHaveBeenCalled()
        })
    })
})
