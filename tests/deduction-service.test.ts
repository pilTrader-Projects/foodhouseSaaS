import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DeductionService } from '@/services/deduction-service'
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
        }
    },
}))

// Mock InventoryService
vi.mock('@/modules/inventory/services/inventory-service')

describe('DeductionService', () => {
    let service: DeductionService
    const tenantId = 'tenant-1'
    const branchId = 'branch-1'

    beforeEach(() => {
        vi.clearAllMocks()
        service = new DeductionService(tenantId, branchId)
    })

    it('should deduct from raw ingredients if model is ON_ORDER', async () => {
        const productId = 'p1'
        const quantity = 5
        const tx = prisma // Simplified for test

            ; (prisma.product.findUnique as any).mockResolvedValue({
                id: productId,
                deductionModel: 'ON_ORDER',
                ingredients: []
            })

        await service.deductStock(productId, quantity, tx)

        expect(InventoryService.prototype.consumeIngredients).toHaveBeenCalledWith(productId, quantity, tx)
    })

    it('should deduct from prepared stock if model is ON_PRODUCTION', async () => {
        const productId = 'p1'
        const quantity = 5
        const tx = prisma

            ; (prisma.product.findUnique as any).mockResolvedValue({
                id: productId,
                deductionModel: 'ON_PRODUCTION',
                ingredients: []
            })

        await service.deductStock(productId, quantity, tx)

        expect(prisma.preparedStock.upsert).toHaveBeenCalledWith(expect.objectContaining({
            where: { branchId_productId: { branchId, productId } },
            update: { quantity: { decrement: quantity } }
        }))
    })

    it('should recursively deduct for component products', async () => {
        const productId = 'combo1'
        const componentId = 'item1'
        const quantity = 2
        const tx = prisma

            // Mock parent product (ON_ORDER) with one component product
            ; (prisma.product.findUnique as any)
                .mockResolvedValueOnce({
                    id: productId,
                    deductionModel: 'ON_ORDER',
                    ingredients: [{ componentProductId: componentId, amount: 1 }]
                })
                // Mock child product (ON_PRODUCTION)
                .mockResolvedValueOnce({
                    id: componentId,
                    deductionModel: 'ON_PRODUCTION',
                    ingredients: []
                })

        await service.deductStock(productId, quantity, tx)

        // Verifications
        // 1. Parent deduction (ingredients)
        expect(InventoryService.prototype.consumeIngredients).toHaveBeenCalledWith(productId, quantity, tx)
        // 2. Child deduction (prepared stock)
        expect(prisma.preparedStock.upsert).toHaveBeenCalledWith(expect.objectContaining({
            where: { branchId_productId: { branchId, productId: componentId } }
        }))
    })
})
