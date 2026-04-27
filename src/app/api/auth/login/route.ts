import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                role: true,
                branch: true
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found. Please sign up first.' }, { status: 404 })
        }

        // In a real app, we would verify the password here

        return NextResponse.json({
            userId: user.id,
            tenantId: user.tenantId,
            role: user.role.name
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
