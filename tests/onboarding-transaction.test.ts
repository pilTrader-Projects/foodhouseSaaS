import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TenantService } from '@/services/tenant-service'
import prisma from '@/lib/prisma'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        $transaction: vi.fn((callback) => callback(prisma)),
        tenant: {
            create: vi.fn(),
            findUnique: vi.fn(),
        },
        user: {
            create: vi.fn(),
            findUnique: vi.fn(),
        },
        branch: {
            create: vi.fn(),
            count: vi.fn(),
        },
        role: {
            create: vi.fn(),
            findFirst: vi.fn(),
            createMany: vi.fn(),
            update: vi.fn(),
        },
        permission: {
            findMany: vi.fn().mockResolvedValue([
                { id: 'p1', name: 'access:dashboard' },
                { id: 'p2', name: 'access:pos' },
                { id: 'p3', name: 'access:inventory' },
                { id: 'p4', name: 'access:kitchen' }
            ])
        }
    },
}))

describe('Onboarding Transaction (TDD)', () => {
    let service: TenantService

    beforeEach(() => {
        vi.clearAllMocks()
        service = new TenantService()
    })

    const mockOnboardingData = {
        user: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'securepassword123'
        },
        business: {
            name: 'Foodies Heaven',
            plan: 'pro'
        },
        branch: {
            name: 'Downtown Main'
        }
    }

    it('should successfully complete a full onboarding transaction (Happy Path)', async () => {
        // Setup Mocks
        const mockTenant = { id: 'tenant-123', name: 'Foodies Heaven', plan: 'pro' }
        const mockRole = { id: 'role-owner', name: 'Owner', tenantId: 'tenant-123' }
        const mockUser = { id: 'user-456', name: 'John Doe', email: 'john@example.com', tenantId: 'tenant-123', roleId: 'role-owner' }
        const mockBranch = { id: 'branch-789', name: 'Downtown Main', tenantId: 'tenant-123' }

            ; (prisma.tenant.create as any).mockResolvedValue(mockTenant)
            ; (prisma.role.create as any).mockResolvedValue(mockRole)
            ; (prisma.user.create as any).mockResolvedValue(mockUser)
            ; (prisma.branch.create as any).mockResolvedValue(mockBranch)
            ; (prisma.user.findUnique as any).mockResolvedValue(null) // Email check

        const result = await service.setupNewBusiness(mockOnboardingData)

        // Verifications
        expect(prisma.$transaction).toHaveBeenCalled()
        expect(prisma.tenant.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({ name: 'Foodies Heaven' })
        }))
        expect(prisma.role.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({ name: 'Owner', tenantId: 'tenant-123' })
        }))
        expect(prisma.user.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                email: 'john@example.com',
                tenantId: 'tenant-123',
                roleId: 'role-owner'
            })
        }))
        expect(prisma.branch.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                name: 'Downtown Main',
                tenantId: 'tenant-123'
            })
        }))

        expect(result.tenant.id).toBe('tenant-123')
        expect(result.user.id).toBe('user-456')
    })

    it('should fail if the email is already in use (Sad Path)', async () => {
        ; (prisma.user.findUnique as any).mockResolvedValue({ id: 'existing-user' })

        await expect(service.setupNewBusiness(mockOnboardingData)).rejects.toThrow('Email already in use')
    })

    it('should ensure atomicity: fail everything if branch creation fails (Edge Case)', async () => {
        const mockTenant = { id: 'tenant-123' }
        const mockRole = { id: 'role-owner' }
        const mockUser = { id: 'user-456' }

            ; (prisma.user.findUnique as any).mockResolvedValue(null)
            ; (prisma.tenant.create as any).mockResolvedValue(mockTenant)
            ; (prisma.role.create as any).mockResolvedValue(mockRole)
            ; (prisma.user.create as any).mockResolvedValue(mockUser)
            ; (prisma.branch.create as any).mockRejectedValue(new Error('Branch creation failed'))

        // We use the mocked transaction which just runs the callback
        await expect(service.setupNewBusiness(mockOnboardingData)).rejects.toThrow('Branch creation failed')

        // In a real prisma transaction, everything would be rolled back.
        // Here we just verify that the error propagates.
    })

    it('should initialize all 4 standard roles and EXCLUDE system permissions from Owner', async () => {
        const mockTenant = { id: 'tenant-123' }
        ; (prisma.user.findUnique as any).mockResolvedValue(null)
        ; (prisma.tenant.create as any).mockResolvedValue(mockTenant)
        ; (prisma.role.create as any).mockResolvedValue({ id: 'owner-id', name: 'Owner' })
        ; (prisma.user.create as any).mockResolvedValue({ id: 'user-id' })
        ; (prisma.branch.create as any).mockResolvedValue({ id: 'branch-id' })

        // Add system permission to the available set
        ; (prisma.permission.findMany as any).mockResolvedValue([
            { id: 'p1', name: 'access:dashboard' },
            { id: 'p_sys', name: 'system:admin' },
            { id: 'p_acc', name: 'access:admin' }
        ])

        await service.setupNewBusiness(mockOnboardingData)

        // Verify Owner role creation specifically
        expect(prisma.role.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                name: 'Owner',
                permissions: {
                    connect: [
                        { id: 'p1' }
                    ]
                }
            })
        }))

        // Verify system permissions were NOT connected (connect should not contain p_sys or p_acc)
        const ownerCall = (prisma.role.create as any).mock.calls.find((call: any) => call[0].data.name === 'Owner')
        const connectedPerms = ownerCall[0].data.permissions.connect
        expect(connectedPerms).not.toContainEqual({ id: 'p_sys' })
        expect(connectedPerms).not.toContainEqual({ id: 'p_acc' })

        expect(prisma.role.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ name: 'Manager' }) }))
        expect(prisma.role.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ name: 'Staff' }) }))
        expect(prisma.role.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ name: 'Chef' }) }))
    })
})
