import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getApiContext } from '@/lib/api-context'
import { NextRequest } from 'next/server'

describe('API Context Hardening (Utility Verification)', () => {
    const createReq = (headers: Record<string, string> = {}, searchParams: string = '') => {
        const headerObj = new Headers()
        Object.entries(headers).forEach(([k, v]) => headerObj.set(k, v))
        return new NextRequest(`http://localhost/api/test${searchParams}`, {
            headers: headerObj
        })
    }

    it('should prioritize headers over search params (Happy Path)', async () => {
        const req = createReq(
            { 'x-tenant-id': 'tenant-header', 'x-branch-id': 'branch-header' },
            '?branchId=branch-param'
        )
        const ctx = await getApiContext(req)

        expect(ctx.tenantId).toBe('tenant-header')
        expect(ctx.branchId).toBe('branch-header') // Header wins
    })

    it('should fallback to search params if header is missing (Happy Path)', async () => {
        const req = createReq(
            { 'x-tenant-id': 'tenant-header' },
            '?branchId=branch-param'
        )
        const ctx = await getApiContext(req)

        expect(ctx.tenantId).toBe('tenant-header')
        expect(ctx.branchId).toBe('branch-param')
    })

    it('should correctly extract user ID from headers', async () => {
        const req = createReq({ 'x-user-id': 'user-123' })
        const ctx = await getApiContext(req)
        expect(ctx.userId).toBe('user-123')
    })

    it('should flag incomplete context correctly', async () => {
        const req = createReq({ 'x-tenant-id': 't1' }) // Missing branchId
        const ctx = await getApiContext(req)
        // /kitchen routes require branchId, others might not
        expect(ctx.isComplete).toBe(true)

        const kitchenReq = new NextRequest('http://localhost/api/kitchen/orders', {
            headers: new Headers({ 'x-tenant-id': 't1' })
        })
        const kitchenCtx = await getApiContext(kitchenReq)
        expect(kitchenCtx.isComplete).toBe(false)
    })
})
