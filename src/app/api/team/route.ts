import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/services/user-service'

export async function GET(req: NextRequest) {
    const tenantId = req.headers.get('x-tenant-id') || 'tenant-demo'

    try {
        const service = new UserService(tenantId)
        const team = await service.getTeam()
        return NextResponse.json({ team })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const tenantId = req.headers.get('x-tenant-id') || 'tenant-demo'
    const body = await req.json()

    try {
        const service = new UserService(tenantId)
        const user = await service.inviteUser(body)
        return NextResponse.json({ user })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
