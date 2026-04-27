import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PERMISSIONS = {
    ACCESS_DASHBOARD: 'access:dashboard',
    ACCESS_POS: 'access:pos',
    ACCESS_INVENTORY: 'access:inventory',
    ACCESS_KITCHEN: 'access:kitchen',
    ACCESS_TEAM: 'access:team',
    MANAGE_SETTINGS: 'manage:settings',
    ADMIN: 'tenant:admin'
};

async function main() {
    console.log('🌱 Seeding permissions...')

    const permissionData = Object.values(PERMISSIONS).map(name => ({
        name,
        description: `Allows user to ${name.replace(':', ' ').replace('manage', 'manage the')}`
    }))

    for (const data of permissionData) {
        await prisma.permission.upsert({
            where: { name: data.name },
            update: {},
            create: data
        })
    }

    console.log('✅ Permissions seeded.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
