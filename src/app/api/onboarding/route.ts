import { NextResponse } from 'next/server';
import { TenantService } from '@/services/tenant-service';
import { FeatureService } from '@/services/feature-service';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { user, business, branch } = body;

        const tenantService = new TenantService();
        const result = await tenantService.setupNewBusiness({
            user,
            business,
            branch
        });

        return NextResponse.json({
            message: 'Business onboarded successfully',
            tenantId: result.tenant.id,
            userId: result.user.id,
            plan: result.tenant.plan
        });
    } catch (error: any) {
        console.error('Onboarding failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
