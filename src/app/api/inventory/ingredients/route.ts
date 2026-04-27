import { NextResponse } from 'next/server';
import { InventoryService } from '@/modules/inventory/services/inventory-service';

export async function GET(request: Request) {
    try {
        const tenantId = request.headers.get('x-tenant-id');
        if (!tenantId) return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });

        const inventoryService = new InventoryService(tenantId);
        const ingredients = await inventoryService.getIngredients();

        return NextResponse.json(ingredients);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const tenantId = request.headers.get('x-tenant-id');
        if (!tenantId) return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });

        const body = await request.json();
        const inventoryService = new InventoryService(tenantId);
        const ingredient = await inventoryService.createIngredient(body);

        return NextResponse.json(ingredient);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
