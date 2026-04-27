import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/orders/route'
import { PosService } from '@/modules/pos/services/pos-service'
import { NextRequest } from 'next/server'

vi.mock('@/modules/pos/services/pos-service')

describe('API: POST /api/orders (Transactional Hardening)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const createReq = (body: any, context: { tenantId?: string, branchId?: string, userId?: string } = {}) => {
        const headers = new Headers()
        if (context.tenantId !== null) headers.set('x-tenant-id', context.tenantId || 'tenant-1')
        if (context.branchId !== null) headers.set('x-branch-id', context.branchId || 'branch-1')
        if (context.userId !== null) headers.set('x-user-id', context.userId || 'user-1')

        return new Request('http://localhost', {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        })
    }

    it('should create an order with valid context (Happy Path)', async () => {
        const body = { items: [{ productId: 'p1', quantity: 2, price: 100 }] }
        const mockOrder = { id: 'o1', totalAmount: 200 }

            ; (PosService.prototype.createOrder as any).mockResolvedValue(mockOrder)

        const res = await POST(createReq(body) as any)
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.id).toBe('o1')
        expect(PosService.prototype.createOrder).toHaveBeenCalledWith('user-1', body.items)
    })

    it('should block order if user context is missing (Sad Path)', async () => {
        const headers = new Headers()
        headers.set('x-tenant-id', 't1')
        headers.set('x-branch-id', 'b1')
        // Missing x-user-id

        const req = new Request('http://localhost', { method: 'POST', headers, body: JSON.stringify({ items: [] }) })
        const res = await POST(req as any)
        const data = await res.json()

        expect(res.status).toBe(400)
        expect(data.error).toContain('user context')
    })

    it('should fail if service layer transaction fails (Sad Path)', async () => {
        ; (PosService.prototype.createOrder as any).mockRejectedValue(new Error('Insufficient Stock'))

        const res = await POST(createReq({ items: [] }) as any)
        const data = await res.json()

        expect(res.status).toBe(500)
        expect(data.error).toBe('Insufficient Stock')
    })
})
