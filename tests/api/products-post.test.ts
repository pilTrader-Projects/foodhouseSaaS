import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/products/route'
import { ProductService } from '@/services/product-service'
import { NextRequest } from 'next/server'

vi.mock('@/services/product-service')

describe('API: POST /api/products (Product Creation)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const createReq = (body: any, tenantId: string | null = 'tenant-123') => {
        const headers = new Headers()
        if (tenantId) headers.set('x-tenant-id', tenantId)
        return new NextRequest('http://localhost/api/products', {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        })
    }

    it('should create a product with valid data (Happy Path)', async () => {
        const body = { name: 'Burger', price: 99.0 }
        const mockProduct = { id: 'p1', ...body, tenantId: 'tenant-123' }

            ; (ProductService.prototype.createProduct as any).mockResolvedValue(mockProduct)

        const res = await POST(createReq(body) as any)
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.id).toBe('p1')
        expect(ProductService.prototype.createProduct).toHaveBeenCalledWith(body)
    })

    it('should fail if tenant ID header is missing (Sad Path)', async () => {
        const res = await POST(createReq({ name: 'Burger' }, null) as any)
        const data = await res.json()

        expect(res.status).toBe(400)
        expect(data.error).toContain('Missing tenant ID')
    })

    it('should fail if service validation fails (Sad Path)', async () => {
        const body = { name: 'B', price: -10 }
            ; (ProductService.prototype.createProduct as any).mockRejectedValue(new Error('Product price must be greater than zero'))

        const res = await POST(createReq(body) as any)
        const data = await res.json()

        expect(res.status).toBe(500)
        expect(data.error).toBe('Product price must be greater than zero')
    })

    it('should integrate deductionModel and batchSize if provided (Edge Case)', async () => {
        const body = { name: 'Chicken', price: 150, deductionModel: 'ON_PRODUCTION', batchSize: 50 }
        const mockProduct = { id: 'p2', ...body }

            ; (ProductService.prototype.createProduct as any).mockResolvedValue(mockProduct)

        const res = await POST(createReq(body) as any)
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.deductionModel).toBe('ON_PRODUCTION')
        expect(data.batchSize).toBe(50)
    })
})
