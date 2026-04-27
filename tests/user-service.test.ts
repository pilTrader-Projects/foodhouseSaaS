import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserService } from '@/services/user-service'
import prisma from '@/lib/prisma'
import { FeatureService } from '@/services/feature-service'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        user: {
            create: vi.fn(),
            count: vi.fn(),
        },
        tenant: {
            findUnique: vi.fn(),
        },
        role: {
            findFirst: vi.fn(),
        }
    },
}))

describe('UserService (S-7)', () => {
    let service: UserService
    const tenantId = 'tenant-1'

    beforeEach(() => {
        vi.clearAllMocks()
        service = new UserService(tenantId)
    })

    it('should invite a new user to a branch with a specific role', async () => {
        const userData = {
            name: 'John Doe',
            email: 'john@foodhouse.com',
            roleName: 'Cashier',
            branchId: 'branch-1',
            password: 'password123'
        }

            ; (prisma.tenant.findUnique as any).mockResolvedValue({ id: tenantId, plan: 'enterprise', features: [] })
            ; (prisma.role.findFirst as any).mockResolvedValue({ id: 'role-cashier', name: 'Cashier' })
            ; (prisma.user.count as any).mockResolvedValue(1) // Current count
            ; (prisma.user.create as any).mockResolvedValue({ id: 'user-2', ...userData })

        const user = await service.inviteUser(userData)

        expect(prisma.user.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                name: userData.name,
                email: userData.email,
                roleId: 'role-cashier',
                branchId: 'branch-1',
                tenantId
            })
        }))
        expect(user.id).toBe('user-2')
    })

    it('should fail if user limit is exceeded', async () => {
        const userData = {
            name: 'John Doe',
            email: 'john@foodhouse.com',
            roleName: 'Cashier',
            branchId: 'branch-1',
            password: 'password123'
        }

        // Mock feature service to block due to limits (max_users = 3 for basic)
        vi.spyOn(FeatureService.prototype, 'checkLimit').mockResolvedValue(false)
            ; (prisma.user.count as any).mockResolvedValue(3)

        await expect(service.inviteUser(userData)).rejects.toThrow(/Subscription limit reached/)
    })
})
