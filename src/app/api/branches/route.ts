import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
    const tenantId = req.headers.get('x-tenant-id')

    try {
        const branches = await prisma.branch.findMany({
            where: { tenantId }
        })
        return NextResponse.json({ branches })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
