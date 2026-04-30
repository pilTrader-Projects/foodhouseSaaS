import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getApiContext, missingContextResponse, serviceErrorResponse } from '@/lib/api-context'
import { TenantService } from '@/services/tenant-service'
import { PLAN_LIMITS } from '@/services/feature-service'

const tenantService = new TenantService()

export async function GET(req: NextRequest) {
    const { tenantId } = await getApiContext(req)
    if (!tenantId) return missingContextResponse()

    try {
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { plan: true }
        })

        const branches = await prisma.branch.findMany({
            where: { tenantId }
        })

        const limits = PLAN_LIMITS[tenant?.plan || 'basic']

        return NextResponse.json({ 
            branches,
            limits: {
                max_branches: limits.max_branches
            }
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const { tenantId } = await getApiContext(req)
    if (!tenantId) return missingContextResponse()

    try {
        const body = await req.json()
        const { name } = body

        if (!name) {
            return NextResponse.json({ error: 'Branch name is required' }, { status: 400 })
        }

        const branch = await tenantService.createBranch({
            name,
            tenantId
        })

        return NextResponse.json(branch)
    } catch (error: any) {
        return serviceErrorResponse(error)
    }
}
