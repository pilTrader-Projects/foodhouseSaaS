import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProductionService } from '@/services/production-service'
import { InventoryService } from '@/modules/inventory/services/inventory-service'
import prisma from '@/lib/prisma'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
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

// Mock InventoryService
vi.mock('@/modules/inventory/services/inventory-service')

describe('ProductionService (K-2 Hybrid)', () => {
    let service: ProductionService
    const tenantId = 'tenant-1'
    const branchId = 'branch-1'

    beforeEach(() => {
        vi.clearAllMocks()
        service = new ProductionService(tenantId, branchId)
    })

    it('should record production and deduct ingredients at the same time', async () => {
        const productId = 'p1'
        const quantity = 10

            ; (prisma.product.findUnique as any).mockResolvedValue({ id: productId, deductionModel: 'ON_PRODUCTION' })

        await service.recordProduction(productId, quantity)

        // 1. Should call InventoryService to deduct ingredients
        expect(InventoryService.prototype.consumeIngredients).toHaveBeenCalledWith(productId, quantity)

        // 2. Should update PreparedStock
        expect(prisma.preparedStock.upsert).toHaveBeenCalledWith(expect.objectContaining({
            where: { branchId_productId: { branchId, productId } },
            update: { quantity: { increment: quantity } }
        }))

        // 3. Should log ProductionRecord
        expect(prisma.productionRecord.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({ productId, quantity })
        }))
    })

    it('should deduct from prepared stock on sale if model is ON_PRODUCTION', async () => {
        const productId = 'p1'
        const quantity = 2

        await service.consumePreparedStock(productId, quantity)

        expect(prisma.preparedStock.upsert).toHaveBeenCalledWith(expect.objectContaining({
            where: { branchId_productId: { branchId, productId } },
            update: { quantity: { decrement: quantity } }
        }))
    })
})
