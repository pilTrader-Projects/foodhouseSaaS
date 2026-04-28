import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsService } from '@/services/analytics-service'
import { getApiContext, missingContextResponse, serviceErrorResponse } from '@/lib/api-context'

export async function GET(req: NextRequest) {
    const { tenantId } = await getApiContext(req)
    if (!tenantId) return missingContextResponse()

    try {
        const service = new AnalyticsService(tenantId)
        const performance = await service.getBranchPerformance()

        return NextResponse.json({ performance })
    } catch (error: any) {
        return serviceErrorResponse(error)
    }
}
