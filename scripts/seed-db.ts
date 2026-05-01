import { loadEnvFile } from 'node:process';
import { DEMO_BRANCH, DEMO_INGREDIENTS, DEMO_PRODUCTS, INITIAL_STOCK } from '../src/lib/demo-data.js';
import { PERMISSIONS, ROLES } from '../src/lib/constants.js';

// Load environment variables from .env file (Native in Node 20.6+)
try {
    loadEnvFile();
} catch (e) {
    // .env might not exist if using system env vars
}

// Dynamically import prisma after env is loaded
const { default: prisma } = await import('../src/lib/prisma.js');

async function seed() {
    try {
        console.log('🚀 Starting Comprehensive System Seed...');

        // 1. Seed Permissions (Global)
        console.log('🌱 Seeding Global Permissions...');
        const permissionData = Object.values(PERMISSIONS).map(name => ({
            name,
            description: `Allows user to ${name.replace(':', ' ').replace('manage', 'manage the')}`
        }));

        for (const data of permissionData) {
            await prisma.permission.upsert({
                where: { name: data.name },
                update: {},
                create: data
            });
        }

        const allPermissions = await prisma.permission.findMany();
        const permissionConnect = allPermissions.map(p => ({ id: p.id }));

        // 2. Create Demo Tenant
        console.log('🏢 Creating Demo Tenant...');
        const tenant = await prisma.tenant.upsert({
            where: { id: 'tenant-demo' },
            update: {},
            create: {
                id: 'tenant-demo',
                name: 'FoodHouse Demo Corp',
                plan: 'pro',
                status: 'ACTIVE',
                features: ['dashboard', 'inventory', 'pos', 'analytics']
            }
        });

        // 3. Create Default Role (Owner) with all permissions
        console.log('🔑 Creating Admin Roles...');
        const role = await prisma.role.upsert({
            where: { id: 'role-admin' },
            update: {
                permissions: { set: [], connect: permissionConnect }
            },
            create: {
                id: 'role-admin',
                name: ROLES.OWNER,
                tenantId: tenant.id,
                permissions: { connect: permissionConnect }
            }
        });

        // 4. Create Demo Branch
        console.log('📍 Creating Demo Branch...');
        const branch = await prisma.branch.upsert({
            where: { id: DEMO_BRANCH.id },
            update: {},
            create: {
                id: DEMO_BRANCH.id,
                name: DEMO_BRANCH.name,
                tenantId: tenant.id
            }
        });

        // 5. Create Default Admin User
        console.log('👤 Creating Demo Admin User...');
        const user = await prisma.user.upsert({
            where: { email: 'admin@demo.com' },
            update: {
                branchId: branch.id,
                roleId: role.id
            },
            create: {
                id: 'user-admin',
                email: 'admin@demo.com',
                name: 'Demo Admin',
                password: 'password123',
                tenantId: tenant.id,
                roleId: role.id,
                branchId: branch.id
            }
        });

        // 6. Create Ingredients & Initialize Stock
        console.log('📦 Initializing Ingredients & Stock...');
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

        // 7. Create Products & Recipes
        console.log('🍔 Seeding Products & Recipes...');
        for (const prod of DEMO_PRODUCTS) {
            const product = await prisma.product.upsert({
                where: { id: prod.id },
                update: { price: prod.price },
                create: {
                    id: prod.id,
                    name: prod.name,
                    price: prod.price,
                    tenantId: tenant.id,
                    branchId: branch.id,
                    deductionModel: 'ON_ORDER',
                    batchSize: 1
                }
            });

            // Refresh recipes
            await prisma.recipeItem.deleteMany({ where: { productId: product.id } });
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

        console.log('✨ Seed completed successfully!');
    } catch (e) {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
