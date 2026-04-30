import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsService } from '@/services/analytics-service'
import { AuthService } from '@/services/auth-service'
import { getApiContext, missingContextResponse, serviceErrorResponse } from '@/lib/api-context'

export async function GET(req: NextRequest) {
    const { userId } = await getApiContext(req)

    if (!userId) return missingContextResponse('User ID is required for secure analytics')

    try {
        const authService = new AuthService()
        const { tenantId, branchId } = await authService.getUserScope(userId)

        const service = new AnalyticsService(tenantId, branchId)
        const totalSales = await service.getGlobalSales()

        return NextResponse.json({ totalSales })
    } catch (error: any) {
        return serviceErrorResponse(error)
    }
}
