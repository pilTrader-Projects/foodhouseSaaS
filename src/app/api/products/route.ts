import { NextResponse } from 'next/server';
import { ProductService } from '@/services/product-service';
import { MenuService } from '@/services/menu-service';

export async function GET(request: Request) {
    try {
        const tenantId = request.headers.get('x-tenant-id');
        const branchId = request.headers.get('x-branch-id');

        if (!tenantId) return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });

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

export async function POST(request: Request) {
    try {
        const tenantId = request.headers.get('x-tenant-id');
        if (!tenantId) return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });

        const body = await request.json();
        const productService = new ProductService(tenantId);
        const product = await productService.createProduct(body);

        return NextResponse.json(product);
    } catch (error: any) {
        console.error('Failed to create product:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const tenantId = request.headers.get('x-tenant-id');
        if (!tenantId) return NextResponse.json({ error: 'Missing tenant ID' }, { status: 400 });

        const body = await request.json();
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
