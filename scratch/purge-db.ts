import prisma from '../src/lib/prisma'

async function cleanup() {
    console.log('Starting comprehensive database cleanup...')
    
    // Delete in order to satisfy FK constraints
    await prisma.orderItem.deleteMany({})
    await prisma.order.deleteMany({})
    await prisma.productionRecord.deleteMany({})
    await prisma.preparedStock.deleteMany({})
    await prisma.purchaseRecord.deleteMany({})
    await prisma.stock.deleteMany({})
    await prisma.recipeItem.deleteMany({})
    await prisma.branchProduct.deleteMany({})
    await prisma.product.deleteMany({})
    await prisma.ingredient.deleteMany({})
    await prisma.supplier.deleteMany({})
    
    // We want to keep the system admin and demo tenants if possible,
    // but for tests, it's safer to just wipe and re-seed if needed.
    // However, let's keep tenants where isSystem is true.
    
    await prisma.user.deleteMany({ where: { tenant: { isSystem: false } } })
    await prisma.branch.deleteMany({ where: { tenant: { isSystem: false } } })
    await prisma.role.deleteMany({ where: { tenant: { isSystem: false } } })
    await prisma.tenant.deleteMany({ where: { isSystem: false } })
    
    console.log('Cleanup complete.')
}

cleanup()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
