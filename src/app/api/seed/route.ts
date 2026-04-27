import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DEMO_BRANCH, DEMO_INGREDIENTS, DEMO_PRODUCTS, INITIAL_STOCK } from '@/lib/demo-data';

export async function POST() {
    try {
        // 1. Create Demo Tenant
        const tenant = await prisma.tenant.upsert({
            where: { id: 'tenant-demo' },
            update: {},
            create: {
                id: 'tenant-demo',
                name: 'FoodHouse Demo Corp',
                plan: 'pro',
                features: ['dashboard', 'inventory', 'pos']
            }
        });

        // 2. Create Default Roles
        const devRoles = [
            { id: 'role-admin', name: 'Owner' },
            { id: 'role-manager', name: 'Manager' },
            { id: 'role-cashier', name: 'Cashier' },
            { id: 'role-chef', name: 'Chef' }
        ];

        for (const r of devRoles) {
            await prisma.role.upsert({
                where: { id: r.id },
                update: { name: r.name },
                create: {
                    id: r.id,
                    name: r.name,
                    tenantId: tenant.id
                }
            });
        }

        const adminRole = await prisma.role.findUnique({ where: { id: 'role-admin' } });

        const user = await prisma.user.upsert({
            where: { email: 'admin@demo.com' },
            update: {
                roleId: adminRole!.id
            },
            create: {
                id: 'user-admin',
                email: 'admin@demo.com',
                name: 'Demo Admin',
                password: 'password123',
                tenantId: tenant.id,
                roleId: adminRole!.id
            }
        });

        // 3. Create Demo Branch
        const branch = await prisma.branch.upsert({
            where: { id: DEMO_BRANCH.id },
            update: {},
            create: {
                id: DEMO_BRANCH.id,
                name: DEMO_BRANCH.name,
                tenantId: tenant.id
            }
        });

        // 4. Create Ingredients
        for (const ing of DEMO_INGREDIENTS) {
            await prisma.ingredient.upsert({
                where: { id: ing.id },
                update: {},
                create: {
                    id: ing.id,
                    name: ing.name,
                    unit: ing.unit,
                    tenantId: tenant.id
                }
            });

            // Initialize Stock
            await prisma.stock.upsert({
                where: {
                    branchId_ingredientId: {
                        branchId: branch.id,
                        ingredientId: ing.id
                    }
                },
                update: { quantity: INITIAL_STOCK[ing.id as keyof typeof INITIAL_STOCK] },
                create: {
                    branchId: branch.id,
                    ingredientId: ing.id,
                    tenantId: tenant.id,
                    quantity: INITIAL_STOCK[ing.id as keyof typeof INITIAL_STOCK]
                }
            });
        }

        // 5. Create Products & Recipes
        for (const prod of DEMO_PRODUCTS) {
            const product = await prisma.product.upsert({
                where: { id: prod.id },
                update: {
                    price: prod.price,
                    deductionModel: prod.id === 'p1' ? 'ON_PRODUCTION' : 'ON_ORDER' // p1 is Fried Chicken
                },
                create: {
                    id: prod.id,
                    name: prod.name,
                    price: prod.price,
                    tenantId: tenant.id,
                    branchId: branch.id,
                    deductionModel: prod.id === 'p1' ? 'ON_PRODUCTION' : 'ON_ORDER'
                }
            });

            // Clear existing recipes for this product to avoid duplicates during re-seeding
            await prisma.recipeItem.deleteMany({
                where: { productId: product.id }
            });

            // Create Recipe Items
            for (const item of prod.recipe) {
                await prisma.recipeItem.create({
                    data: {
                        productId: product.id,
                        ingredientId: item.ingredientId,
                        amount: item.amount
                    }
                });
            }
        }

        return NextResponse.json({ message: 'Seeding successful', tenantId: tenant.id });
    } catch (error: any) {
        console.error('Seeding failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
