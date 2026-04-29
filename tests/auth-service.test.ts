import { describe, it, expect, vi } from 'vitest'
import { AuthService } from '@/services/auth-service'
import prisma from '@/lib/prisma'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        user: {
            findUnique: vi.fn().mockResolvedValue({
                id: 'user-1',
                role: {
                    permissions: [],
                },
            }),
        },
    },
}))

describe('AuthService (RBAC)', () => {
    const authService = new AuthService()

    it('should grant access if user has the specific permission', async () => {
        const mockUser = {
            id: 'user-1',
            role: {
                permissions: [{ name: 'pos:transactions' }],
            },
        }
            ; (prisma.user.findUnique as any).mockResolvedValue(mockUser)

        const hasAccess = await authService.hasPermission('user-1', 'pos:transactions')
        expect(hasAccess).toBe(true)
    })

    it('should grant access to tenant-level permissions if user has tenant:admin', async () => {
        const mockUser = {
            id: 'user-2',
            role: {
                permissions: [{ name: 'tenant:admin' }],
            },
        }
            ; (prisma.user.findUnique as any).mockResolvedValue(mockUser)

        const hasAccess = await authService.hasPermission('user-2', 'manage:inventory')
        expect(hasAccess).toBe(true)
    })

    it('should DENY global system permissions if user only has tenant:admin', async () => {
        const mockUser = {
            id: 'user-2',
            role: {
                permissions: [{ name: 'tenant:admin' }],
            },
        }
            ; (prisma.user.findUnique as any).mockResolvedValue(mockUser)

        const hasAccess = await authService.hasPermission('user-2', 'system:admin')
        expect(hasAccess).toBe(false)
    })

    it('should grant access to anything if user has system:admin', async () => {
        const mockUser = {
            id: 'admin-1',
            role: {
                permissions: [{ name: 'system:admin' }],
            },
        }
            ; (prisma.user.findUnique as any).mockResolvedValue(mockUser)

        const hasAccess = await authService.hasPermission('admin-1', 'system:admin')
        const hasAccess2 = await authService.hasPermission('admin-1', 'any:other:permission')
        expect(hasAccess).toBe(true)
        expect(hasAccess2).toBe(true)
    })

    it('should deny access if user lacks the permission', async () => {
        const mockUser = {
            id: 'user-3',
            role: {
                permissions: [{ name: 'pos:transactions' }],
            },
        }
            ; (prisma.user.findUnique as any).mockResolvedValue(mockUser)

        const hasAccess = await authService.hasPermission('user-3', 'accounting:view')
        expect(hasAccess).toBe(false)
    })
})
