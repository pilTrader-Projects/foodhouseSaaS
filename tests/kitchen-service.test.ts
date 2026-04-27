import { describe, it, expect, vi, beforeEach } from 'vitest'
import { KitchenService } from '@/services/kitchen-service'
import prisma from '@/lib/prisma'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        order: {
            findMany: vi.fn(),
            update: vi.fn(),
        }
    },
}))

describe('KitchenService (K-1)', () => {
    let service: KitchenService
    const tenantId = 'tenant-1'
    const branchId = 'branch-1'

    beforeEach(() => {
        vi.clearAllMocks()
        service = new KitchenService(tenantId, branchId)
    })

    it('should fetch active orders (PENDING or PREPARING)', async () => {
        const mockOrders = [
            { id: 'o1', status: 'PENDING', items: [] },
            { id: 'o2', status: 'PREPARING', items: [] },
        ]

            ; (prisma.order.findMany as any).mockResolvedValue(mockOrders)

        const orders = await service.getActiveOrders()

        expect(prisma.order.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({
                branchId,
                tenantId,
                status: { in: ['PENDING', 'PREPARING', 'READY'] }
            })
        }))
        expect(orders).toHaveLength(2)
    })

    it('should update order status', async () => {
        const orderId = 'o1'
        const newStatus = 'READY'

            ; (prisma.order.update as any).mockResolvedValue({ id: orderId, status: newStatus })

        const updated = await service.updateStatus(orderId, newStatus)

        expect(prisma.order.update).toHaveBeenCalledWith({
            where: { id: orderId },
            data: { status: newStatus }
        })
        expect(updated.status).toBe('READY')
    })
})
