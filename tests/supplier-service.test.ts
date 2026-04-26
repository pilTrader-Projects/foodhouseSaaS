import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SupplierService } from '@/services/supplier-service'
import prisma from '@/lib/prisma'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        supplier: {
            create: vi.fn(),
            findMany: vi.fn(),
            findUnique: vi.fn(),
        },
        ingredient: {
            update: vi.fn(),
            findUnique: vi.fn(),
        },
        purchaseRecord: {
            create: vi.fn(),
        },
        stock: {
            updateMany: vi.fn(),
        },
        $transaction: vi.fn((cb) => cb(prisma)),
    },
}))

describe('SupplierService (I-3)', () => {
    let service: SupplierService
    const tenantId = 'tenant-1'
    const branchId = 'branch-1'

    beforeEach(() => {
        vi.clearAllMocks()
        service = new SupplierService(tenantId, branchId)
    })

    it('should create a new supplier', async () => {
        const supplierData = { name: 'Manila Veggies', contact: 'manila@veggies.com' }
            ; (prisma.supplier.create as any).mockResolvedValue({ id: 'supp-1', ...supplierData })

        const supplier = await service.createSupplier(supplierData)

        expect(prisma.supplier.create).toHaveBeenCalledWith({
            data: {
                ...supplierData,
                tenantId,
            }
        })
        expect(supplier.id).toBe('supp-1')
    })

    it('should link an ingredient to a supplier', async () => {
        const ingredientId = 'ing-1'
        const supplierId = 'supp-1'

        await service.linkIngredient(ingredientId, supplierId)

        expect(prisma.ingredient.update).toHaveBeenCalledWith({
            where: { id: ingredientId },
            data: { supplierId },
        })
    })

    it('should record a purchase and update stock', async () => {
        const purchaseData = {
            supplierId: 'supp-1',
            ingredientId: 'ing-1',
            quantity: 10,
            unitCost: 50,
        }

            ; (prisma.purchaseRecord.create as any).mockResolvedValue({ id: 'pur-1', ...purchaseData, totalCost: 500 })

        const purchase = await service.recordPurchase(purchaseData)

        // 1. Check purchase record creation
        expect(prisma.purchaseRecord.create).toHaveBeenCalledWith({
            data: {
                ...purchaseData,
                totalCost: 500,
                tenantId,
                branchId,
            }
        })

        // 2. Check stock update
        expect(prisma.stock.updateMany).toHaveBeenCalledWith({
            where: {
                tenantId,
                branchId,
                ingredientId: 'ing-1',
            },
            data: {
                quantity: {
                    increment: 10,
                },
            } as any,
        })

        expect(purchase.totalCost).toBe(500)
    })
})
