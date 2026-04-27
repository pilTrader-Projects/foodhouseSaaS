import { NextRequest, NextResponse } from 'next/server';
import { InventoryService } from '@/modules/inventory/services/inventory-service';
import { getApiContext, missingContextResponse } from '@/lib/api-context';

export async function GET(req: NextRequest) {
    try {
        const { tenantId } = await getApiContext(req);
        if (!tenantId) return missingContextResponse('Tenant context required');

        const inventoryService = new InventoryService(tenantId);
        const ingredients = await inventoryService.getIngredients();

        return NextResponse.json(ingredients);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { tenantId } = await getApiContext(req);
        if (!tenantId) return missingContextResponse('Tenant context required');

        const body = await req.json();
        const inventoryService = new InventoryService(tenantId);
        const ingredient = await inventoryService.createIngredient(body);

        return NextResponse.json(ingredient);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
