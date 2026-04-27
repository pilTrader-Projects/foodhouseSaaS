import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/products/[id]/recipe/route'
import { RecipeService } from '@/services/recipe-service'

vi.mock('@/services/recipe-service')

describe('API: /api/products/[id]/recipe (Recipe Management)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const createReq = (method: string, body?: any, tenantId: string | null = 'tenant-123') => {
        const headers = new Headers()
        if (tenantId) headers.set('x-tenant-id', tenantId)
        return new Request('http://localhost', {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        })
    }

    describe('GET (Happy & Sad Paths)', () => {
        it('should fetch a recipe successfully (Happy Path)', async () => {
            const mockRecipe = [{ id: 'r1', amount: 1 }]
                ; (RecipeService.prototype.getRecipe as any).mockResolvedValue(mockRecipe)

            const res = await GET(createReq('GET') as any, { params: { id: 'p1' } })
            const data = await res.json()

            expect(res.status).toBe(200)
            expect(data).toEqual(mockRecipe)
            expect(RecipeService.prototype.getRecipe).toHaveBeenCalledWith('p1')
        })

        it('should fail if tenant ID is missing', async () => {
            const res = await GET(createReq('GET', null, null) as any, { params: { id: 'p1' } })
            const data = await res.json()

            expect(res.status).toBe(400)
            expect(data.error).toContain('Missing tenant ID')
        })

        it('should handle service layer failures', async () => {
            ; (RecipeService.prototype.getRecipe as any).mockRejectedValue(new Error('Internal Database Error'))

            const res = await GET(createReq('GET') as any, { params: { id: 'p1' } })
            const data = await res.json()

            expect(res.status).toBe(500)
            expect(data.error).toBe('Internal Database Error')
        })
    })

    describe('POST (Update & Edge Cases)', () => {
        it('should update a recipe with multiple items (Happy Path)', async () => {
            const items = [
                { ingredientId: 'i1', amount: 2 },
                { componentProductId: 'cp1', amount: 0.5 }
            ]
                ; (RecipeService.prototype.updateRecipe as any).mockResolvedValue(items)

            const res = await POST(createReq('POST', { items }) as any, { params: { id: 'p1' } })
            const data = await res.json()

            expect(res.status).toBe(200)
            expect(data.message).toContain('successfully')
            expect(RecipeService.prototype.updateRecipe).toHaveBeenCalledWith('p1', items)
        })

        it('should handle emptying a recipe (Edge Case)', async () => {
            const items: any[] = []
                ; (RecipeService.prototype.updateRecipe as any).mockResolvedValue([])

            const res = await POST(createReq('POST', { items }) as any, { params: { id: 'p1' } })
            const data = await res.json()

            expect(res.status).toBe(200)
            expect(RecipeService.prototype.updateRecipe).toHaveBeenCalledWith('p1', [])
        })

        it('should fail update if tenant ID is missing', async () => {
            const res = await POST(createReq('POST', { items: [] }, null) as any, { params: { id: 'p1' } })
            const data = await res.json()

            expect(res.status).toBe(400)
            expect(data.error).toContain('Missing tenant ID')
        })

        it('should respond with 500 if the service fails during update', async () => {
            ; (RecipeService.prototype.updateRecipe as any).mockRejectedValue(new Error('Atomic Transaction Failure'))

            const res = await POST(createReq('POST', { items: [] }) as any, { params: { id: 'p1' } })
            const data = await res.json()

            expect(res.status).toBe(500)
            expect(data.error).toBe('Atomic Transaction Failure')
        })
    })
})
