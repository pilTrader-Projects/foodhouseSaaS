import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsService } from '@/services/analytics-service'
import { getApiContext, missingContextResponse, serviceErrorResponse } from '@/lib/api-context'

export async function GET(req: NextRequest) {
    const { tenantId } = await getApiContext(req)

    if (!tenantId) return missingContextResponse('Tenant ID is required')

    try {
        const service = new AnalyticsService(tenantId)
        const totalSales = await service.getGlobalSales()

        return NextResponse.json({ totalSales })
    } catch (error: any) {
        return serviceErrorResponse(error)
    }
}
