import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RoleService } from '@/services/role-service'
import prisma from '@/lib/prisma'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        role: {
            findMany: vi.fn(),
            create: vi.fn(),
            delete: vi.fn(),
            findUnique: vi.fn(),
        },
    },
}))

describe('RoleService (TDD)', () => {
    let service: RoleService

    beforeEach(() => {
        vi.clearAllMocks()
        service = new RoleService()
    })

    it('should fetch all roles for a tenant', async () => {
        const mockRoles = [
            { id: '1', name: 'Owner', tenantId: 'tenant-1' },
            { id: '2', name: 'Manager', tenantId: 'tenant-1' }
        ]
            ; (prisma.role.findMany as any).mockResolvedValue(mockRoles)

        const result = await service.getRoles('tenant-1')
        expect(result).toHaveLength(2)
        expect(prisma.role.findMany).toHaveBeenCalledWith({
            where: { tenantId: 'tenant-1' },
            orderBy: { name: 'asc' }
        })
    })

    it('should create a custom role for a tenant', async () => {
        const mockRole = { id: '3', name: 'Head Chef', tenantId: 'tenant-1' }
            ; (prisma.role.create as any).mockResolvedValue(mockRole)

        const result = await service.createRole('tenant-1', 'Head Chef')
        expect(result.name).toBe('Head Chef')
        expect(prisma.role.create).toHaveBeenCalledWith({
            data: {
                name: 'Head Chef',
                tenantId: 'tenant-1'
            }
        })
    })

    it('should prevent deleting system-critical roles (Owner/Manager)', async () => {
        await expect(service.deleteRole('tenant-1', 'role-id', 'Owner')).rejects.toThrow(/cannot delete/i)
    })

    it('should successfully delete a custom role', async () => {
        ; (prisma.role.delete as any).mockResolvedValue({ id: 'role-id' })

        await service.deleteRole('tenant-1', 'role-id', 'Dishwasher')
        expect(prisma.role.delete).toHaveBeenCalled()
    })
})
