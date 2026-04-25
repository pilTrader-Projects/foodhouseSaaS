import { NextResponse } from 'next/server';
import { TenantService } from '@/services/TenantService';
import { FeatureService } from '@/services/FeatureService';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, plan } = body;

        // In a real app, we'd get a user ID from session or create one here
        const adminUserId = 'user-admin'; // Placeholder

        const tenantService = new TenantService(null as any); // Static context for creation
        const tenant = await tenantService.createTenant(name, plan);

        // Auto-enable features based on plan
        const featureService = new FeatureService(tenant.id);
        await featureService.enableFeature('pos');
        await featureService.enableFeature('inventory');

        if (plan === 'pro') {
            await featureService.enableFeature('dashboard');
        }

        return NextResponse.json({
            message: 'Tenant created successfully',
            tenantId: tenant.id,
            plan: tenant.plan
        });
    } catch (error: any) {
        console.error('Onboarding failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
