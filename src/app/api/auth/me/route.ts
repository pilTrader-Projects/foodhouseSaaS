import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
    const userId = req.headers.get('x-user-id') || 'user-admin' // Default to admin for demo

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                role: {
                    include: {
                        permissions: true
                    }
                },
                branch: true
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ user })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
