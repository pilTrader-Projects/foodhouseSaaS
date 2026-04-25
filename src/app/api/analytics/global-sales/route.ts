import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsService } from '@/services/AnalyticsService'

export async function GET(req: NextRequest) {
    const tenantId = req.headers.get('x-tenant-id')

    if (!tenantId) {
        return NextResponse.json({ error: 'Tenant ID is required in headers' }, { status: 400 })
    }

    try {
        const service = new AnalyticsService(tenantId)
        const totalSales = await service.getGlobalSales()
        
        return NextResponse.json({ totalSales })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
