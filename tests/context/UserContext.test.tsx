import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserProvider, useUser } from '@/context/user-context'
import React from 'react'

// Mock Component to consume context
const TestConsumer = () => {
    const { user, loading, authFailed } = useUser()
    if (loading) return <div>Loading...</div>
    if (authFailed) return <div>Auth Failed</div>
    return <div data-testid="user-name">{user?.name}</div>
}

describe('UserContext (TDD)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
        global.fetch = vi.fn()
    })

    it('should fetch and provide user data on mount (Happy Path)', async () => {
        localStorage.setItem('userId', 'user-123');
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ user: { id: 'user-123', name: 'John Doe', role: { permissions: [] } } })
        })

        render(
            <UserProvider>
                <TestConsumer />
            </UserProvider>
        )

        expect(screen.getByText('Loading...')).toBeDefined()
        
        await waitFor(() => {
            expect(screen.getByTestId('user-name').textContent).toBe('John Doe')
        })
    })

    it('should handle 401 Unauthorized (Sad Path)', async () => {
        localStorage.setItem('userId', 'invalid');
        (global.fetch as any).mockResolvedValue({ ok: false, status: 401 })

        render(
            <UserProvider>
                <TestConsumer />
            </UserProvider>
        )

        await waitFor(() => {
            expect(screen.getByText('Auth Failed')).toBeDefined()
        })
    })

    it('should handle network errors (Edge Case)', async () => {
        localStorage.setItem('userId', 'user-123');
        (global.fetch as any).mockRejectedValue(new Error('Network Down'))

        render(
            <UserProvider>
                <TestConsumer />
            </UserProvider>
        )

        await waitFor(() => {
            expect(screen.getByText('Auth Failed')).toBeDefined()
        })
    })
})
