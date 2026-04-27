import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MenuService } from '@/services/menu-service'
import prisma from '@/lib/prisma'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        product: {
            findMany: vi.fn(),
        },
        branchProduct: {
            upsert: vi.fn(),
            findMany: vi.fn(),
        },
        tenant: {
            findUnique: vi.fn(),
        }
    },
}))

describe('MenuService (P-3 Overrides)', () => {
    let service: MenuService
    const tenantId = 'tenant-1'
    const branchId = 'branch-1'

    beforeEach(() => {
        vi.clearAllMocks()
        service = new MenuService(tenantId, branchId)
            // Default tenant plan mock
            ; (prisma.tenant.findUnique as any).mockResolvedValue({ id: tenantId, plan: 'pro', features: [] })
    })

    it('should return global products with branch overrides', async () => {
        const globalProducts = [
            { id: 'p1', name: 'Burger', price: 100 },
            { id: 'p2', name: 'Fries', price: 50 },
        ]
        const overrides = [
            { productId: 'p1', priceOverride: 120, isAvailable: true },
            { productId: 'p2', priceOverride: null, isAvailable: false },
        ]

            ; (prisma.product.findMany as any).mockResolvedValue(globalProducts)
            ; (prisma.branchProduct.findMany as any).mockResolvedValue(overrides)

        const menu = await service.getBranchMenu()

        expect(menu).toHaveLength(2)
        // Burger should have overridden price
        const burger = menu.find(p => p.id === 'p1')
        expect(burger?.price).toBe(120)
        expect(burger?.isAvailable).toBe(true)

        // Fries should be unavailable
        const fries = menu.find(p => p.id === 'p2')
        expect(fries?.price).toBe(50) // Fallback to global
        expect(fries?.isAvailable).toBe(false)
    })

    it('should set a price override for a product', async () => {
        const productId = 'p1'
        const newPrice = 150

        await service.setPriceOverride(productId, newPrice)

        expect(prisma.branchProduct.upsert).toHaveBeenCalledWith({
            where: {
                branchId_productId: { branchId, productId }
            },
            update: { priceOverride: newPrice },
            create: { branchId, productId, priceOverride: newPrice }
        })
    })

    it('should toggle availability for a product', async () => {
        const productId = 'p1'

        await service.setAvailability(productId, false)

        expect(prisma.branchProduct.upsert).toHaveBeenCalledWith({
            where: {
                branchId_productId: { branchId, productId }
            },
            update: { isAvailable: false },
            create: { branchId, productId, isAvailable: false }
        })
    })
})
