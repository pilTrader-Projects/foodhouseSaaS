import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/services/user-service'
import { getApiContext, missingContextResponse } from '@/lib/api-context'

export async function GET(req: NextRequest) {
    const { tenantId, branchId } = await getApiContext(req)

    if (!tenantId) return missingContextResponse('Tenant context required')

    try {
        const service = new UserService(tenantId)
        const team = await service.getTeam(branchId)
        return NextResponse.json({ team })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const { tenantId, branchId: headerBranchId } = await getApiContext(req)
    if (!tenantId) return missingContextResponse('Tenant context required')

    try {
        const body = await req.json()

        // Resolve branchId: priority Body > Header
        const finalBranchId = body.branchId || headerBranchId
        if (!finalBranchId) return missingContextResponse('Branch context required for invitation')

        const service = new UserService(tenantId)
        const user = await service.inviteUser({ ...body, branchId: finalBranchId })
        return NextResponse.json({ user })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
