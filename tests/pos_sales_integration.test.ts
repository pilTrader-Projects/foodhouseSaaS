import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PosService } from '@/modules/pos/services/pos-service'
import { AnalyticsService } from '@/services/analytics-service'
import prisma from '@/lib/prisma'
import { FeatureService } from '@/services/feature-service'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        order: {
            create: vi.fn(),
            aggregate: vi.fn(),
        },
        stock: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
        ingredient: {
            findUnique: vi.fn(),
        },
        $transaction: vi.fn((cb) => cb({
            order: {
                create: vi.fn().mockResolvedValue({ id: 'order-1', totalAmount: 100 }),
            },
            product: {
                findUnique: vi.fn().mockResolvedValue({ id: 'p1', deductionModel: 'ON_ORDER', ingredients: [] }),
            },
            stock: {
                findUnique: vi.fn().mockResolvedValue({ quantity: 10 }),
                update: vi.fn(),
                upsert: vi.fn(),
            },
            ingredient: {
                findUnique: vi.fn().mockResolvedValue({ recipeItems: [] }),
            }
        })),
    },
}))

// Mock InventoryService
vi.mock('@/modules/inventory/services/inventory-service', () => {
    return {
        InventoryService: class {
            consumeIngredients = vi.fn().mockResolvedValue(true)
        }
    }
})

describe('POS to Analytics Integration (Cascading Sales)', () => {
    const tenantId = 'tenant-1'
    const branchId = 'branch-1'
    const userId = 'user-1'
    
    let posService: PosService
    let analyticsService: AnalyticsService

    beforeEach(() => {
        vi.clearAllMocks()
        posService = new PosService(tenantId, branchId)
        analyticsService = new AnalyticsService(tenantId)
        vi.spyOn(FeatureService.prototype, 'hasFeature').mockResolvedValue(true)
    })

    it('should create an order and be reflected in global sales', async () => {
        // 1. Create Order via POS Service
        const items = [{ productId: 'p1', quantity: 2, price: 50 }]
        
        // Mock the transaction result
        const mockTx = {
            order: { create: vi.fn().mockResolvedValue({ id: 'order-1', totalAmount: 100 }) },
            product: { findUnique: vi.fn().mockResolvedValue({ id: 'p1', deductionModel: 'ON_ORDER', ingredients: [] }) },
            stock: { findUnique: vi.fn().mockResolvedValue({ quantity: 10 }), update: vi.fn(), upsert: vi.fn() },
            ingredient: { findUnique: vi.fn().mockResolvedValue({ recipeItems: [] }) }
        }
        ;(prisma.$transaction as any).mockImplementation(async (cb: any) => cb(mockTx))

        await posService.createOrder(userId, items)

        // Verify order creation was called with correct data
        expect(mockTx.order.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                tenantId,
                branchId,
                totalAmount: 100
            })
        }))

        // 2. Verify Analytics Service sees the sale
        // Mock aggregate to return the sum including the new order
        ;(prisma.order.aggregate as any).mockResolvedValue({
            _sum: { totalAmount: 100 }
        })

        const totalSales = await analyticsService.getGlobalSales()
        expect(totalSales).toBe(100)
    })
})
