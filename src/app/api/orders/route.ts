import { NextResponse, NextRequest } from 'next/server';
import { PosService } from '@/modules/pos/services/pos-service';

export async function POST(request: NextRequest) {
    try {
        const tenantId = request.headers.get('x-tenant-id');
        const branchId = request.headers.get('x-branch-id') || request.nextUrl.searchParams.get('branchId');
        const userId = request.headers.get('x-user-id');

        if (!tenantId || !branchId || !userId) {
            return NextResponse.json({ error: 'Missing tenant, branch, or user context' }, { status: 400 });
        }

        const body = await request.json();
        const { items } = body;

        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid items format' }, { status: 400 });
        }

        const posService = new PosService(tenantId, branchId);
        const order = await posService.createOrder(userId, items);

        return NextResponse.json(order);
    } catch (error: any) {
        console.error('Failed to create order:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
