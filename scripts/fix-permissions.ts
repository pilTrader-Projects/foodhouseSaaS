import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔧 Fixing permissions for existing roles...')

    const permissions = await prisma.permission.findMany()
    const getPermIds = (...names: string[]) => permissions.filter(p => names.includes(p.name)).map(p => ({ id: p.id }))

    const roles = await prisma.role.findMany()

    for (const role of roles) {
        let permsToConnect = []

        if (role.name === 'Owner') {
            permsToConnect = permissions.map(p => ({ id: p.id }))
        } else if (role.name === 'Manager') {
            permsToConnect = getPermIds('access:dashboard', 'access:pos', 'access:inventory', 'access:kitchen')
        } else if (role.name === 'Chef') {
            permsToConnect = getPermIds('access:kitchen', 'access:inventory')
        } else if (role.name === 'Staff') {
            permsToConnect = getPermIds('access:pos')
        }

        if (permsToConnect.length > 0) {
            await prisma.role.update({
                where: { id: role.id },
                data: { permissions: { connect: permsToConnect } }
            })
            console.log(`✅ Linked permissions to role: ${role.name} (${role.id})`)
        }
    }

    console.log('✨ All roles synchronized.')
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect())
