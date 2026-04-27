import { NextResponse, NextRequest } from 'next/server';
import { InventoryService } from '@/modules/inventory/services/inventory-service';

export async function GET(req: NextRequest) {
    try {
        const tenantId = req.headers.get('x-tenant-id');
        const branchId = req.headers.get('x-branch-id') || req.nextUrl.searchParams.get('branchId');

        if (!tenantId || !branchId) {
            return NextResponse.json({ error: 'Tenant and Branch context required' }, { status: 400 });
        }

        const inventoryService = new InventoryService(tenantId, branchId);
        const stockProfile = await inventoryService.getBranchStock();

        // Standardize output for UI
        const profile = stockProfile.map(item => ({
            id: item.id,
            name: item.name,
            unit: item.unit,
            currentStock: item.stocks[0]?.quantity || 0,
            lastUpdated: item.stocks[0]?.updatedAt || null
        }));

        return NextResponse.json(profile);
    } catch (error: any) {
        console.error('Inventory Profile Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
