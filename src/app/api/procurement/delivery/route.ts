import { NextResponse } from 'next/server';
import { ProcurementService } from '@/services/procurement-service';

export async function POST(request: Request) {
    try {
        const tenantId = request.headers.get('x-tenant-id');
        const branchId = request.headers.get('x-branch-id');

        if (!tenantId) return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });
        if (!branchId) return NextResponse.json({ error: 'Missing branch ID' }, { status: 400 });

        const body = await request.json();
        const { supplierId, items } = body;

        if (!supplierId || !Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid delivery data. Supplier and items list required.' }, { status: 400 });
        }

        const procurementService = new ProcurementService(tenantId, branchId);
        await procurementService.recordDelivery(supplierId, items);

        return NextResponse.json({ success: true, message: 'Delivery recorded successfully' });
    } catch (error: any) {
        console.error('Delivery Recording Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const tenantId = request.headers.get('x-tenant-id');
        const branchId = request.headers.get('x-branch-id');

        if (!tenantId || !branchId) {
            return NextResponse.json({ error: 'Tenant and Branch context required' }, { status: 400 });
        }

        const procurementService = new ProcurementService(tenantId, branchId);
        const deliveries = await procurementService.getRecentDeliveries();

        return NextResponse.json(deliveries);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
