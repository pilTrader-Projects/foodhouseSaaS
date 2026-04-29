import prisma from '../src/lib/prisma'

async function testConn() {
    try {
        const count = await prisma.tenant.count()
        console.log('Database connected. Total tenants:', count)
    } catch (e) {
        console.error('Database connection failed:', e)
    } finally {
        await prisma.$disconnect()
    }
}

testConn()
