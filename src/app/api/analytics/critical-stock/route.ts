import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsService } from '@/services/analytics-service'

export async function GET(req: NextRequest) {
    const tenantId = req.headers.get('x-tenant-id')
    const threshold = req.nextUrl.searchParams.get('threshold')

    if (!tenantId) {
        return NextResponse.json({ error: 'Tenant ID is required in headers' }, { status: 400 })
    }

    try {
        const service = new AnalyticsService(tenantId)
        const criticalStock = await service.getGlobalCriticalStock(
            threshold ? parseFloat(threshold) : undefined
        )

        return NextResponse.json({ criticalStock })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
