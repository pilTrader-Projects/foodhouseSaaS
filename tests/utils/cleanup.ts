import prisma from '@/lib/prisma'

/**
 * Cleanly removes a tenant and all associated data from the test database.
 * Use this in afterEach/afterAll blocks of integration tests.
 */
export async function cleanupTenant(tenantId: string | null | undefined) {
    if (!tenantId) return;

    try {
        console.log(`🧹 Cleaning up test data for Tenant: ${tenantId}...`)
        
        // 1. Delete transactional data (Deepest in FK chain)
        await prisma.orderItem.deleteMany({ where: { order: { tenantId } } })
        await prisma.order.deleteMany({ where: { tenantId } })
        await prisma.productionRecord.deleteMany({ where: { branch: { tenantId } } })
        await prisma.preparedStock.deleteMany({ where: { branch: { tenantId } } })
        await prisma.purchaseRecord.deleteMany({ where: { tenantId } })
        await prisma.stock.deleteMany({ where: { tenantId } })
        
        // 2. Delete structural data
        await prisma.recipeItem.deleteMany({ where: { product: { tenantId } } })
        await prisma.branchProduct.deleteMany({ where: { branch: { tenantId } } })
        await prisma.product.deleteMany({ where: { tenantId } })
        await prisma.ingredient.deleteMany({ where: { tenantId } })
        await prisma.supplier.deleteMany({ where: { tenantId } })
        
        // 3. Delete organization data
        await prisma.user.deleteMany({ where: { tenantId } })
        await prisma.branch.deleteMany({ where: { tenantId } })
        await prisma.role.deleteMany({ where: { tenantId } })
        
        // 4. Finally delete the tenant
        await prisma.tenant.delete({ where: { id: tenantId } })
        
        console.log(`✨ Cleanup successful for ${tenantId}`)
    } catch (error) {
        console.warn(`⚠️ Cleanup failed for tenant ${tenantId}:`, error)
    }
}
