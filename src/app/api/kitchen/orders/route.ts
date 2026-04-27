import { NextRequest, NextResponse } from 'next/server'
import { KitchenService } from '@/services/kitchen-service'
import { getApiContext, missingContextResponse } from '@/lib/api-context'

export async function GET(req: NextRequest) {
    const { tenantId, branchId } = await getApiContext(req)

    if (!tenantId || !branchId) {
        return missingContextResponse('Missing tenant or branch ID')
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
    const { tenantId, branchId } = await getApiContext(req)
    const body = await req.json()
    const { orderId, status } = body

    if (!tenantId || !branchId) {
        return missingContextResponse('Missing tenant or branch ID')
    }

    try {
        const service = new KitchenService(tenantId, branchId)
        const order = await service.updateStatus(orderId, status)
        return NextResponse.json({ order })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
