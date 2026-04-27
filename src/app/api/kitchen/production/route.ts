import { NextRequest, NextResponse } from 'next/server'
import { ProductionService } from '@/services/production-service'

export async function POST(req: NextRequest) {
    const tenantId = req.headers.get('x-tenant-id') || 'tenant-demo'
    const branchId = req.headers.get('x-branch-id')
    const body = await req.json()
    const { productId, quantity } = body

    if (!branchId) {
        return NextResponse.json({ error: 'Missing branch ID' }, { status: 400 })
    }

    try {
        const service = new ProductionService(tenantId, branchId)
        const record = await service.recordProduction(productId, quantity)
        return NextResponse.json({ message: 'Production recorded successfully', record })
    } catch (error: any) {
        console.error("Production Record Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    const tenantId = req.headers.get('x-tenant-id') || 'tenant-demo'
    const branchId = req.headers.get('x-branch-id')

    if (!branchId) {
        return NextResponse.json({ error: 'Missing branch ID' }, { status: 400 })
    }

    try {
        const service = new ProductionService(tenantId, branchId)
        const stock = await service.getPreparedStock()
        return NextResponse.json({ stock })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
