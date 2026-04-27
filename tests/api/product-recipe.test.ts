import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/products/[id]/recipe/route'
import { RecipeService } from '@/services/recipe-service'

vi.mock('@/services/recipe-service')

describe('API: /api/products/[id]/recipe', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const createReq = (method: string, body?: any) => {
        const headers = new Headers()
        headers.set('x-tenant-id', 'tenant-123')
        return new Request('http://localhost', {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        })
    }

    it('should fetch a recipe successfully (Happy Path)', async () => {
        const mockRecipe = [{ id: 'r1', amount: 1 }]
            ; (RecipeService.prototype.getRecipe as any).mockResolvedValue(mockRecipe)

        const res = await GET(createReq('GET') as any, { params: { id: 'p1' } })
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data).toEqual(mockRecipe)
        expect(RecipeService.prototype.getRecipe).toHaveBeenCalledWith('p1')
    })

    it('should update a recipe successfully (Happy Path)', async () => {
        const items = [{ ingredientId: 'i1', amount: 2 }]
            ; (RecipeService.prototype.updateRecipe as any).mockResolvedValue(items)

        const res = await POST(createReq('POST', { items }) as any, { params: { id: 'p1' } })
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.message).toContain('successfully')
        expect(RecipeService.prototype.updateRecipe).toHaveBeenCalledWith('p1', items)
    })

    it('should handle service errors (Sad Path)', async () => {
        ; (RecipeService.prototype.getRecipe as any).mockRejectedValue(new Error('DB Error'))

        const res = await GET(createReq('GET') as any, { params: { id: 'p1' } })
        const data = await res.json()

        expect(res.status).toBe(500)
        expect(data.error).toBe('DB Error')
    })
})
