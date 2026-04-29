/**
 * FoodHouse SaaS System Constants
 */

export const ROLES = {
    OWNER: 'Owner',
    MANAGER: 'Manager',
    CHEF: 'Chef',
    STAFF: 'Staff',
} as const;

export const PERMISSIONS = {
    // Navigation & Page Access
    ACCESS_DASHBOARD: 'access:dashboard',
    ACCESS_POS: 'access:pos',
    ACCESS_INVENTORY: 'access:inventory',
    ACCESS_KITCHEN: 'access:kitchen',
    ACCESS_TEAM: 'access:team',
    ACCESS_MENU: 'access:menu',

    // Settings & Admin
    MANAGE_SETTINGS: 'manage:settings',
    MANAGE_ORGANIZATION: 'manage:organization',

    // Global Admin Permissions
    ACCESS_ADMIN: 'access:admin',
    SYSTEM_ADMIN: 'system:admin',

    // Super Permission
    ADMIN: 'tenant:admin'
} as const;

export type RoleName = typeof ROLES[keyof typeof ROLES];
export type PermissionName = typeof PERMISSIONS[keyof typeof PERMISSIONS];
