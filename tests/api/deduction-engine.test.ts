import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DeductionService } from '@/services/deduction-service'
import { InventoryService } from '@/modules/inventory/services/inventory-service'

vi.mock('@/modules/inventory/services/inventory-service')

describe('DeductionService (TDD Hardening)', () => {
    let service: DeductionService
    const mockTx = {
        product: {
            findUnique: vi.fn()
        },
        preparedStock: {
            upsert: vi.fn()
        }
    }

    beforeEach(() => {
        vi.clearAllMocks()
        service = new DeductionService('tenant-123', 'branch-123')
    })

    it('should deduct raw ingredients for ON_ORDER products (Happy Path)', async () => {
        const mockProduct = {
            id: 'p1',
            deductionModel: 'ON_ORDER',
            ingredients: []
        }
        mockTx.product.findUnique.mockResolvedValue(mockProduct)

        await service.deductStock('p1', 1, mockTx)

        expect(InventoryService.prototype.consumeIngredients).toHaveBeenCalledWith('p1', 1, mockTx)
    })

    it('should deduct prepared stock for ON_PRODUCTION products (Happy Path)', async () => {
        const mockProduct = {
            id: 'p1',
            deductionModel: 'ON_PRODUCTION',
            ingredients: []
        }
        mockTx.product.findUnique.mockResolvedValue(mockProduct)

        await service.deductStock('p1', 1, mockTx)

        expect(mockTx.preparedStock.upsert).toHaveBeenCalledWith(expect.objectContaining({
            where: {
                branchId_productId: {
                    branchId: 'branch-123',
                    productId: 'p1'
                }
            }
        }))
    })

    it('should recursively deduct sub-components (Edge Case)', async () => {
        const parent = {
            id: 'parent',
            deductionModel: 'ON_ORDER',
            ingredients: [
                { componentProductId: 'child', amount: 2 }
            ]
        }
        const child = {
            id: 'child',
            deductionModel: 'ON_PRODUCTION',
            ingredients: []
        }

        mockTx.product.findUnique
            .mockResolvedValueOnce(parent)
            .mockResolvedValueOnce(child)

        await service.deductStock('parent', 1, mockTx)

        expect(mockTx.preparedStock.upsert).toHaveBeenCalledWith(expect.objectContaining({
            where: {
                branchId_productId: {
                    branchId: 'branch-123',
                    productId: 'child'
                }
            }
        }))
    })

    it('should throw error if product is missing (Sad Path)', async () => {
        mockTx.product.findUnique.mockResolvedValue(null)

        await expect(service.deductStock('ghost', 1, mockTx)).rejects.toThrow('not found')
    })
})
