import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SupplierService } from '@/services/supplier-service'
import { InventoryService } from '@/modules/inventory/services/inventory-service'
import prisma from '@/lib/prisma'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        supplier: {
            create: vi.fn(),
        },
        ingredient: {
            create: vi.fn(),
        },
        tenant: {
            findUnique: vi.fn().mockResolvedValue({
                plan: 'basic',
                features: ['inventory', 'pos']
            }),
        },
    },
}))

describe('Entity Creation Flow', () => {
    const tenantId = 'tenant-123'

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should create a supplier scoped to the tenant', async () => {
        const service = new SupplierService(tenantId)
        const data = { name: 'Fresh Fruits Co', contact: '123-456' }

        await service.createSupplier(data)

        expect(prisma.supplier.create).toHaveBeenCalledWith({
            data: { ...data, tenantId }
        })
    })

    it('should create an ingredient scoped to the tenant', async () => {
        const service = new InventoryService(tenantId)
        const data = { name: 'Apples', unit: 'KG' }

        await service.createIngredient(data)

        expect(prisma.ingredient.create).toHaveBeenCalledWith({
            data: { ...data, tenantId }
        })
    })

    it('should block ingredient creation if the feature is missing', async () => {
        vi.mocked(prisma.tenant.findUnique).mockResolvedValueOnce({
            plan: 'none',
            features: []
        })
        const service = new InventoryService(tenantId)

        await expect(service.createIngredient({ name: 'X', unit: 'Y' }))
            .rejects.toThrow(/is not enabled for this tenant/)
    })
})
