import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getApiContext, missingContextResponse } from '@/lib/api-context'

export async function GET(req: NextRequest) {
    const { tenantId } = await getApiContext(req)
    if (!tenantId) return missingContextResponse()

    try {
        const branches = await prisma.branch.findMany({
            where: { tenantId }
        })
        return NextResponse.json({ branches })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
