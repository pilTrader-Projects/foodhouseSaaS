import { NextRequest, NextResponse } from 'next/server'
import { RoleService } from '@/services/role-service'
import prisma from '@/lib/prisma'

const roleService = new RoleService()

export async function GET(req: NextRequest) {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        const roles = await roleService.getRoles(user.tenantId)
        return NextResponse.json({ roles })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        const { name } = await req.json()
        if (!name) return NextResponse.json({ error: 'Role name is required' }, { status: 400 })

        const role = await roleService.createRole(user.tenantId, name)
        return NextResponse.json({ role })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
