import prisma from '@/lib/prisma'

/**
 * Subscription Plans and their default included features.
 */
export const PLAN_FEATURES: Record<string, string[]> = {
    basic: ['pos', 'inventory'],
    pro: ['pos', 'inventory', 'dashboard', 'landing_page'],
    enterprise: ['pos', 'inventory', 'dashboard', 'landing_page', 'unlimited_branches'],
}

/**
 * Subscription Limits per plan. 
 * 'unlimited_branches' feature flag overrides max_branches.
 */
export const PLAN_LIMITS: Record<string, { max_branches: number; max_users: number }> = {
    basic: { max_branches: 1, max_users: 3 },
    pro: { max_branches: 5, max_users: 15 },
    enterprise: { max_branches: 100, max_users: 500 },
}

/**
 * FeatureService provides the gating logic for modular SaaS functionality.
 */
export class FeatureService {
    /**
     * Checks if a tenant has access to a specific feature.
     * Access is granted if:
     * 1. The feature is part of the tenant's current plan.
     * 2. The feature is explicitly enabled in the tenant's custom features list.
     */
    async hasFeature(tenantId: string, featureName: string): Promise<boolean> {
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { plan: true, features: true },
        })

        if (!tenant) return false

        // 1. Check explicit features
        if (tenant.features.includes(featureName)) return true

        // 2. Check plan features
        const planFeatures = PLAN_FEATURES[tenant.plan] || []
        return planFeatures.includes(featureName)
    }

    /**
     * Verifies if creating a new resource (branch, user) will exceed plan limits.
     * @param tenantId The tenant ID
     * @param type 'branches' or 'users'
     * @param currentCount The current number of existing resources
     */
    async checkLimit(tenantId: string, type: 'max_branches' | 'max_users', currentCount: number): Promise<boolean> {
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { plan: true, features: true },
        })

        if (!tenant) return false

        // 1. Check for unlimited override
        if (type === 'max_branches' && tenant.features.includes('unlimited_branches')) return true

        // 2. Check plan limits
        const limits = PLAN_LIMITS[tenant.plan] || PLAN_LIMITS.basic
        return currentCount < limits[type]
    }
}
