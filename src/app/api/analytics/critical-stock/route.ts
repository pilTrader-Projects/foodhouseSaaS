import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsService } from '@/services/analytics-service'
import { getApiContext, missingContextResponse } from '@/lib/api-context'

export async function GET(req: NextRequest) {
    const { tenantId } = await getApiContext(req)
    const threshold = req.nextUrl.searchParams.get('threshold')

    if (!tenantId) return missingContextResponse()

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
