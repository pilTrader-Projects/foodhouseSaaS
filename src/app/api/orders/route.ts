import { NextResponse, NextRequest } from 'next/server';
import { PosService } from '@/modules/pos/services/pos-service';
import { getApiContext, missingContextResponse } from '@/lib/api-context';

export async function POST(request: NextRequest) {
    try {
        const { tenantId, branchId, userId } = await getApiContext(request);

        if (!tenantId || !branchId) {
            return NextResponse.json({ error: 'Missing tenant or branch ID' }, { status: 400 });
        }

        if (!userId) {
            return NextResponse.json({ error: 'Missing user context' }, { status: 400 });
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
