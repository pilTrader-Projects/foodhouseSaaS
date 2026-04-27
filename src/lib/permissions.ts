/**
 * FoodHouse SaaS Permission Constants
 * 
 * Centralized source of truth for RBAC and access control.
 */
export const PERMISSIONS = {
    // Navigation & Page Access
    ACCESS_DASHBOARD: 'access:dashboard',
    ACCESS_POS: 'access:pos',
    ACCESS_INVENTORY: 'access:inventory',
    ACCESS_KITCHEN: 'access:kitchen',
    ACCESS_TEAM: 'access:team',

    // High-Level Management
    MANAGE_SETTINGS: 'manage:settings',
    MANAGE_ORGANIZATION: 'manage:organization',

    // Super Permission
    ADMIN: 'tenant:admin'
} as const;

export type PermissionName = typeof PERMISSIONS[keyof typeof PERMISSIONS];
