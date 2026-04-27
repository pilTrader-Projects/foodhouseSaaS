import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/product-service';
import { MenuService } from '@/services/menu-service';
import { getApiContext, missingContextResponse } from '@/lib/api-context';

export async function GET(req: NextRequest) {
    try {
        const { tenantId, branchId } = await getApiContext(req);

        if (!tenantId) return missingContextResponse();

        if (branchId) {
            const menuService = new MenuService(tenantId, branchId);
            const products = await menuService.getBranchMenu();
            return NextResponse.json(products);
        }

        const productService = new ProductService(tenantId);
        const products = await productService.getProducts();

        return NextResponse.json(products);
    } catch (error: any) {
        console.error('Failed to fetch products:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { tenantId } = await getApiContext(req);
        if (!tenantId) return missingContextResponse();

        const body = await req.json();
        const productService = new ProductService(tenantId);
        const product = await productService.createProduct(body);

        return NextResponse.json(product);
    } catch (error: any) {
        console.error('Failed to create product:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const { tenantId } = await getApiContext(req);
        if (!tenantId) return missingContextResponse();

        const body = await req.json();
        const { productId, ...data } = body;

        if (!productId) return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });

        const productService = new ProductService(tenantId);
        const product = await productService.updateProduct(productId, data);

        return NextResponse.json(product);
    } catch (error: any) {
        console.error('Failed to update product:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
