import { NextRequest, NextResponse } from 'next/server';
import { RecipeService } from '@/services/recipe-service';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const tenantId = req.headers.get('x-tenant-id');
        if (!tenantId) return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });

        const service = new RecipeService(tenantId);
        const recipe = await service.getRecipe(id);
        return NextResponse.json(recipe);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const tenantId = req.headers.get('x-tenant-id');
        if (!tenantId) return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });

        const body = await req.json();
        const { items } = body; // Array of { ingredientId, amount }

        const service = new RecipeService(tenantId);
        const recipe = await service.updateRecipe(id, items);
        return NextResponse.json({ message: 'Recipe updated successfully', recipe });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
