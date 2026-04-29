import { NextRequest, NextResponse } from 'next/server'
import { GlobalAdminService } from '@/services/global-admin-service'
import { rbacGuard } from '@/services/guard'
import { PERMISSIONS } from '@/lib/constants'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const userId = req.headers.get('x-user-id')
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        await rbacGuard(userId, PERMISSIONS.SYSTEM_ADMIN)

        const adminService = new GlobalAdminService()
        const tenant = await adminService.getTenantDetails(id)
        
        return NextResponse.json(tenant)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes('Forbidden') ? 403 : 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const userId = req.headers.get('x-user-id')
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        await rbacGuard(userId, PERMISSIONS.SYSTEM_ADMIN)

        const body = await req.json()
        const adminService = new GlobalAdminService()
        
        let result
        if (body.plan) {
            result = await adminService.updateTenantPlan(id, body.plan)
        } else if (body.status) {
            result = await adminService.updateTenantStatus(id, body.status)
        } else {
            return NextResponse.json({ error: 'Invalid update payload' }, { status: 400 })
        }
        
        return NextResponse.json(result)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes('Forbidden') ? 403 : 500 })
    }
}
