import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthService } from '@/services/auth-service'
import prisma from '@/lib/prisma'

vi.mock('@/lib/prisma', () => ({
    default: {
        user: {
            findUnique: vi.fn(),
        },
    },
}))

describe('RBAC Authorization (Integration)', () => {
    let authService: AuthService

    beforeEach(() => {
        vi.clearAllMocks()
        authService = new AuthService()
    })

    it('should return all permissions for a user with Owner role', async () => {
        const mockUser = {
            id: 'owner-1',
            email: 'owner@foodhouse.com',
            tenantId: 'tenant-1',
            role: {
                name: 'Owner',
                permissions: [
                    { name: 'access:dashboard' },
                    { name: 'access:pos' },
                    { name: 'tenant:admin' }
                ]
            }
        };

        (prisma.user.findUnique as any).mockResolvedValue(mockUser);

        const session = await authService.login('owner@foodhouse.com');

        expect(session?.permissions).toContain('tenant:admin');
        expect(session?.permissions).toContain('access:pos');

        expect(await authService.hasPermission('owner-1', 'any:permission')).toBe(true);
    })

    it('should return restricted permissions for a Chef', async () => {
        const mockUser = {
            id: 'chef-1',
            email: 'chef@foodhouse.com',
            tenantId: 'tenant-1',
            role: {
                name: 'Chef',
                permissions: [
                    { name: 'access:kitchen' },
                    { name: 'access:inventory' }
                ]
            }
        };

        (prisma.user.findUnique as any).mockResolvedValue(mockUser);

        const session = await authService.login('chef@foodhouse.com');

        expect(session?.permissions).toContain('access:kitchen');
        expect(session?.permissions).not.toContain('access:pos');

        expect(await authService.hasPermission('chef-1', 'access:kitchen')).toBe(true);
        expect(await authService.hasPermission('chef-1', 'access:pos')).toBe(false);
    })
})
