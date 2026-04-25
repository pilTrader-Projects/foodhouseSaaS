import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProductService } from '@/services/ProductService'
import prisma from '@/lib/prisma'
import { FeatureService } from '@/services/FeatureService'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        product: {
            create: vi.fn(),
            findMany: vi.fn(),
            delete: vi.fn(),
        },
    },
}))

// Mock FeatureService
vi.mock('@/services/FeatureService')

describe('ProductService - Menu Management (TDD)', () => {
    const tenantId = 'tenant-1'
    const branchId = 'branch-1'
    let service: ProductService

    beforeEach(() => {
        vi.clearAllMocks()
        service = new ProductService(tenantId, branchId)
        vi.spyOn(FeatureService.prototype, 'hasFeature').mockResolvedValue(true)
    })

    it('should allow creating a custom menu item with PHP pricing', async () => {
        const productData = { name: 'Chicken Adobo', price: 150.0 }
        ;(prisma.product.create as any).mockResolvedValue({ id: 'p1', ...productData })

        const product = await service.createProduct(productData)

        expect(product.name).toBe('Chicken Adobo')
        expect(product.price).toBe(150.0)
        expect(prisma.product.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                name: 'Chicken Adobo',
                price: 150.0,
                tenantId,
                branchId
            })
        })
    })

    it('should fetch the full menu for a branch', async () => {
        ;(prisma.product.findMany as any).mockResolvedValue([
            { id: 'p1', name: 'Item 1', price: 100 }
        ])

        const menu = await service.getProducts()

        expect(menu).toHaveLength(1)
        expect(prisma.product.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: { tenantId, branchId }
        }))
    })
})
