import { describe, it, expect } from 'vitest'
import { MenuService } from '@/services/menu-service'
import { ProductionService } from '@/services/production-service'
import prisma from '@/lib/prisma'

describe('Menu & Production Integration (Dynamic)', () => {
    it('should successfully verify a branch and its products', async () => {
        // 1. Discover a real branch and tenant
        const branch = await prisma.branch.findFirst({
            include: { tenant: true }
        })

        if (!branch) {
            console.warn("Skipping integration test: No branch found. Run seed first.")
            return
        }

        const tenantId = branch.tenantId
        const branchId = branch.id

        // 2. Test MenuService
        const menuService = new MenuService(tenantId, branchId)
        const menu = await menuService.getBranchMenu()
        expect(Array.isArray(menu)).toBe(true)

        // 3. Test ProductionService
        const product = await prisma.product.findFirst({
            where: { tenantId }
        })

        if (product) {
            const productionService = new ProductionService(tenantId, branchId)
            const record = await productionService.recordProduction(product.id, 1)

            expect(record.productId).toBe(product.id)
            expect(record.branchId).toBe(branchId)

            const stock = await prisma.preparedStock.findUnique({
                where: { branchId_productId: { branchId, productId: product.id } }
            })
            expect(stock?.quantity).toBeGreaterThanOrEqual(1)
        }
    }, 30000) // 30s timeout for real DB
})
