import { NextRequest, NextResponse } from 'next/server';

/**
 * Hardened Context Resolution for Multi-Tenant SaaS.
 * Prioritizes Headers (auto-injected by useApi) then Query Params.
 */
export async function getApiContext(req: NextRequest) {
    const tenantId = req.headers.get('x-tenant-id');
    const branchId = req.headers.get('x-branch-id') || req.nextUrl.searchParams.get('branchId');
    const userId = req.headers.get('x-user-id');

    return {
        tenantId,
        branchId,
        userId,
        // Helper to check if any context is missing
        isComplete: !!(tenantId && (branchId || !req.nextUrl.pathname.includes('/kitchen')))
    };
}

/**
 * Standard error response for missing context.
 */
export function missingContextResponse(message = 'Missing tenant ID') {
    return NextResponse.json({ error: message }, { status: 400 });
}

/**
 * Standard error handler for services.
 * Detects feature-gating errors (403) vs Database/System errors (503/500).
 */
export function serviceErrorResponse(error: any) {
    const message = error.message || 'An unexpected error occurred';
    
    // 1. Feature Gating Errors (RBAC / Subscription)
    if (message.includes('not enabled') || message.includes('upgrade your plan') || message.includes('Feature restricted') || message.includes('limit reached')) {
        return NextResponse.json({ 
            error: message,
            type: 'RESTRICTION'
        }, { status: 403 });
    }

    // 2. Database Connection Errors (Prisma/Neon)
    if (message.includes('Can\'t reach database server') || message.includes('PrismaClientInitializationError') || message.includes('P2024')) {
        return NextResponse.json({ 
            error: 'The system is temporarily unable to connect to the data core. Please verify your database status.',
            type: 'DATABASE_CONNECTION',
            rawError: process.env.NODE_ENV === 'development' ? message : undefined
        }, { status: 503 });
    }

    // 3. Generic System Errors
    return NextResponse.json({ 
        error: message,
        type: 'SYSTEM_ERROR'
    }, { status: 500 });
}
