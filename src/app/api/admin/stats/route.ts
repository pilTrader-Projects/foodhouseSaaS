import { NextRequest, NextResponse } from 'next/server'
import { GlobalAdminService } from '@/services/global-admin-service'
import { rbacGuard } from '@/services/guard'
import { PERMISSIONS } from '@/lib/constants'

export async function GET(req: NextRequest) {
    try {
        const userId = req.headers.get('x-user-id')
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // Ensure user is system admin
        await rbacGuard(userId, PERMISSIONS.SYSTEM_ADMIN)

        const adminService = new GlobalAdminService()
        const stats = await adminService.getPlatformStats()
        
        return NextResponse.json(stats)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes('Forbidden') ? 403 : 500 })
    }
}
