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
