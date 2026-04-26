import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsService } from '@/services/analytics-service'

export async function GET(req: NextRequest) {
    const tenantId = req.headers.get('x-tenant-id')

    if (!tenantId) {
        return NextResponse.json({ error: 'Tenant ID is required in headers' }, { status: 400 })
    }

    try {
        const service = new AnalyticsService(tenantId)
        const performance = await service.getBranchPerformance()

        return NextResponse.json({ performance })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
