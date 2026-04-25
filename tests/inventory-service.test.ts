import { describe, it, expect, vi, beforeEach } from 'vitest'
import { InventoryService } from '@/modules/inventory/services/inventory-service'
import prisma from '@/lib/prisma'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        product: {
            findUnique: vi.fn(),
        },
        stock: {
            updateMany: vi.fn(),
        },
        tenant: {
            findUnique: vi.fn().mockResolvedValue({ plan: 'basic', features: [] }),
        },
    },
}))

describe('InventoryService (TDD)', () => {
    const tenantId = 'tenant-1'
    const branchId = 'branch-1'
    let service: InventoryService

    beforeEach(() => {
        vi.clearAllMocks()
        service = new InventoryService(tenantId, branchId)
    })

    it('should correctly deduct stock based on product ingredients', async () => {
        // Stage: Product has 2 ingredients
        const productId = 'prod-1'
        const mockProduct = {
            id: productId,
            ingredients: [
                { ingredientId: 'ing-1', amount: 0.5 }, // 0.5kg per unit
                { ingredientId: 'ing-2', amount: 1 },   // 1pc per unit
            ],
        }
            ; (prisma.product.findUnique as any).mockResolvedValue(mockProduct)

        // Execute: Consume 10 units of the product
        await service.consumeIngredients(productId, 10)

        // Verify: ing-1 should be reduced by 5, ing-2 by 10
        expect(prisma.stock.updateMany).toHaveBeenCalledTimes(2)

        expect(prisma.stock.updateMany).toHaveBeenCalledWith({
            where: { branchId, ingredientId: 'ing-1', tenantId },
            data: { quantity: { decrement: 5 } },
        })

        expect(prisma.stock.updateMany).toHaveBeenCalledWith({
            where: { branchId, ingredientId: 'ing-2', tenantId },
            data: { quantity: { decrement: 10 } },
        })
    })

    it('should throw error if product is not found', async () => {
        ; (prisma.product.findUnique as any).mockResolvedValue(null)
        await expect(service.consumeIngredients('invalid', 1)).rejects.toThrow('Product not found')
    })
})
