import { NextRequest, NextResponse } from 'next/server'
import { ProductionService } from '@/services/production-service'
import { getApiContext, missingContextResponse } from '@/lib/api-context'

export async function POST(req: NextRequest) {
    const { tenantId, branchId } = await getApiContext(req)
    if (!tenantId || !branchId) return missingContextResponse()

    try {
        const body = await req.json()
        const { productId, quantity } = body

        const service = new ProductionService(tenantId, branchId)
        const record = await service.recordProduction(productId, quantity)
        return NextResponse.json({ message: 'Production recorded successfully', record })
    } catch (error: any) {
        console.error("Production Record Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    const { tenantId, branchId } = await getApiContext(req)
    if (!tenantId || !branchId) return missingContextResponse()

    try {
        const service = new ProductionService(tenantId, branchId)
        const stock = await service.getPreparedStock()
        return NextResponse.json({ stock })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
