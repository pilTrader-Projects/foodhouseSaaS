import { NextRequest, NextResponse } from 'next/server';
import { SupplierService } from '@/services/supplier-service';
import { getApiContext, missingContextResponse } from '@/lib/api-context';

export async function GET(req: NextRequest) {
    try {
        const { tenantId } = await getApiContext(req);
        if (!tenantId) return missingContextResponse('Tenant context required');

        const supplierService = new SupplierService(tenantId);
        const suppliers = await supplierService.getSuppliers();

        return NextResponse.json(suppliers);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { tenantId } = await getApiContext(req);
        if (!tenantId) return missingContextResponse('Tenant context required');

        const body = await req.json();
        const supplierService = new SupplierService(tenantId);
        const supplier = await supplierService.createSupplier(body);

        return NextResponse.json(supplier);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
