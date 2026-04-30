import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsService } from '@/services/analytics-service'
import { AuthService } from '@/services/auth-service'
import { getApiContext, missingContextResponse, serviceErrorResponse } from '@/lib/api-context'

export async function GET(req: NextRequest) {
    const { userId } = await getApiContext(req)
    const threshold = req.nextUrl.searchParams.get('threshold')

    if (!userId) return missingContextResponse('User ID is required for secure analytics')

    try {
        const authService = new AuthService()
        const { tenantId, branchId } = await authService.getUserScope(userId)

        const service = new AnalyticsService(tenantId, branchId)
        const criticalStock = await service.getGlobalCriticalStock(
            threshold ? parseFloat(threshold) : undefined
        )

        return NextResponse.json({ criticalStock })
    } catch (error: any) {
        return serviceErrorResponse(error)
    }
}
