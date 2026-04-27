import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApi } from '@/hooks/use-api'

describe('useApi (TDD)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        global.fetch = vi.fn()
    })

    it('should return data on success (Happy Path)', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true, data: 'test' })
        })

        const { result } = renderHook(() => useApi())

        let data;
        await act(async () => {
            data = await result.current.request('/test')
        })

        expect(data.success).toBe(true)
        expect(result.current.loading).toBe(false)
        expect(result.current.error).toBe(null)
    })

    it('should extract error message on 400+ (Sad Path)', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'Invalid input' })
        })

        const { result } = renderHook(() => useApi())

        await act(async () => {
            try {
                await result.current.request('/test')
            } catch (e) {}
        })

        expect(result.current.error).toBe('Invalid input')
    })
})
