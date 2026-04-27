import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/services/user-service'

export async function GET(req: NextRequest) {
    const tenantId = req.headers.get('x-tenant-id')
    const branchId = req.headers.get('x-branch-id') || req.nextUrl.searchParams.get('branchId')

    if (!tenantId) {
        return NextResponse.json({ error: 'Tenant context required' }, { status: 400 })
    }

    try {
        const service = new UserService(tenantId)
        const team = await service.getTeam(branchId)
        return NextResponse.json({ team })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const tenantId = req.headers.get('x-tenant-id')
    const body = await req.json()

    try {
        const service = new UserService(tenantId)
        const user = await service.inviteUser(body)
        return NextResponse.json({ user })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
