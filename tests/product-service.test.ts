import { describe, it, expect, vi } from 'vitest'
import { ProductService } from '@/services/product-service'
import prisma from '@/lib/prisma'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        product: {
            findMany: vi.fn().mockResolvedValue([]),
            create: vi.fn().mockResolvedValue({}),
            update: vi.fn().mockResolvedValue({}),
        },
        tenant: {
            findUnique: vi.fn().mockResolvedValue({ plan: 'basic', features: [] }),
        },
    },
}))

describe('Multi-tenancy Isolation (ProductService)', () => {
    it('should scope findMany queries to the tenant and branch', async () => {
        const service = new ProductService('tenant-1', 'branch-1')
        await service.getProducts()

        expect(prisma.product.findMany).toHaveBeenCalledWith({
            where: {
                tenantId: 'tenant-1',
                branchId: 'branch-1',
            },
        })
    })

    it('should scope create operations to the tenant and branch', async () => {
        const service = new ProductService('tenant-2', 'branch-2')
        const productData = { name: 'Fried Chicken', price: 15.0 }

        await service.createProduct(productData)

        expect(prisma.product.create).toHaveBeenCalledWith({
            data: {
                ...productData,
                tenantId: 'tenant-2',
                branchId: 'branch-2',
            },
        })
    })
    it('should scope update operations to the tenant and branch', async () => {
        const service = new ProductService('tenant-3', 'branch-3')
        const productId = 'prod-123'
        const patchData = { price: 20.0 }

        await service.updateProduct(productId, patchData)

        expect(prisma.product.update).toHaveBeenCalledWith({
            where: {
                id: productId,
                tenantId: 'tenant-3',
                branchId: 'branch-3',
            },
            data: patchData,
        })
    })
})
