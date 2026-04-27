import { NextRequest, NextResponse } from 'next/server';
import { ProcurementService } from '@/services/procurement-service';
import { getApiContext, missingContextResponse } from '@/lib/api-context';

export async function POST(req: NextRequest) {
    try {
        const { tenantId, branchId } = await getApiContext(req);

        if (!tenantId || !branchId) return missingContextResponse();

        const body = await req.json();
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

export async function GET(req: NextRequest) {
    try {
        const { tenantId, branchId } = await getApiContext(req);

        if (!tenantId || !branchId) {
            return missingContextResponse();
        }

        const procurementService = new ProcurementService(tenantId, branchId);
        const deliveries = await procurementService.getRecentDeliveries();

        return NextResponse.json(deliveries);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
