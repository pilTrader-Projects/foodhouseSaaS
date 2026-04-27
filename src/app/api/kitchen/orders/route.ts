import { NextRequest, NextResponse } from 'next/server'
import { KitchenService } from '@/services/kitchen-service'

export async function GET(req: NextRequest) {
    const tenantId = req.headers.get('x-tenant-id') || 'tenant-demo'
    const branchId = req.headers.get('x-branch-id')

    if (!branchId) {
        return NextResponse.json({ error: 'Missing branch ID' }, { status: 400 })
    }

    try {
        const service = new KitchenService(tenantId, branchId)
        const orders = await service.getActiveOrders()
        return NextResponse.json({ orders })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    const tenantId = req.headers.get('x-tenant-id') || 'tenant-demo'
    const branchId = req.headers.get('x-branch-id')
    const body = await req.json()
    const { orderId, status } = body

    if (!branchId) {
        return NextResponse.json({ error: 'Missing branch ID' }, { status: 400 })
    }

    try {
        const service = new KitchenService(tenantId, branchId)
        const order = await service.updateStatus(orderId, status)
        return NextResponse.json({ order })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
