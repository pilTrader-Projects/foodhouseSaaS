import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const tenantId = 'tenant-demo'
    const roles = [
        { id: 'role-admin', name: 'Owner' },
        { id: 'role-manager', name: 'Manager' },
        { id: 'role-cashier', name: 'Cashier' },
        { id: 'role-chef', name: 'Chef' }
    ]

    for (const r of roles) {
        await prisma.role.upsert({
            where: { id: r.id },
            update: { name: r.name },
            create: {
                id: r.id,
                name: r.name,
                tenantId: tenantId
            }
        })
    }
    console.log('Roles seeded successfully')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
