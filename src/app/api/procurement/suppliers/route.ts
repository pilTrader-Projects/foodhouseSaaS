import { NextResponse } from 'next/server';
import { SupplierService } from '@/services/supplier-service';

export async function GET(request: Request) {
    try {
        const tenantId = request.headers.get('x-tenant-id');
        if (!tenantId) return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });

        const supplierService = new SupplierService(tenantId);
        const suppliers = await supplierService.getSuppliers();

        return NextResponse.json(suppliers);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const tenantId = request.headers.get('x-tenant-id');
        if (!tenantId) return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });

        const body = await request.json();
        const supplierService = new SupplierService(tenantId);
        const supplier = await supplierService.createSupplier(body);

        return NextResponse.json(supplier);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
