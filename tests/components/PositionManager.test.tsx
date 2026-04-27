import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PositionManager } from '@/app/(dashboard)/settings/team/sections/PositionManager'
import React from 'react'

describe('PositionManager (TDD)', () => {
    const mockProps = {
        roles: [
            { id: 'r1', name: 'Chef', tenantId: null },
            { id: 'r2', name: 'Custom Role', tenantId: 't1' }
        ],
        userId: 'u1',
        onRoleCreated: vi.fn(),
    }

    beforeEach(() => {
        vi.clearAllMocks()
        global.fetch = vi.fn()
    })

    it('should handle role creation (Happy Path)', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ role: { id: 'r3', name: 'New Role' } })
        })

        render(<PositionManager {...mockProps} />)
        
        fireEvent.change(screen.getByPlaceholderText(/New Position Title/i), { target: { value: 'Manager v2' } })
        fireEvent.click(screen.getByText('Create'))

        await waitFor(() => {
            expect(mockProps.onRoleCreated).toHaveBeenCalled()
        })
    })

    it('should prevent deletion of system roles (Edge Case)', async () => {
        render(<PositionManager {...mockProps} />)
        
        // System roles shouldn't have a delete button in our implementation
        // or it should be disabled.
        const deleteButtons = screen.queryAllByRole('button', { name: /trash/i })
        // role 'r1' is Chef (tenantId: null), so it should NOT have a delete button
        // role 'r2' is Custom (tenantId: 't1'), so it SHOULD.
        expect(deleteButtons.length).toBe(1)
    })
})
