import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { InviteForm } from '@/app/(dashboard)/settings/team/sections/InviteForm'
import React from 'react'

describe('InviteForm (TDD)', () => {
    const mockProps = {
        roles: [{ id: 'r1', name: 'Chef' }],
        branches: [{ id: 'b1', name: 'Main' }],
        tenantId: 't1',
        onSuccess: vi.fn(),
    }

    beforeEach(() => {
        vi.clearAllMocks()
        global.fetch = vi.fn()
        window.alert = vi.fn()
    })

    it('should submit successfully with valid data (Happy Path)', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ user: { email: 'test@example.com' } })
        })

        render(<InviteForm {...mockProps} />)

        fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Jane Doe' } })
        fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'jane@example.com' } })
        
        fireEvent.click(screen.getByText('Send Invitation'))

        await waitFor(() => {
            expect(mockProps.onSuccess).toHaveBeenCalled()
        })
    })

    it('should show error if API fails (Sad Path)', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'Limit reached' })
        })

        render(<InviteForm {...mockProps} />)
        fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Jane Doe' } })
        fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'jane@example.com' } })
        fireEvent.click(screen.getByText('Send Invitation'))

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Limit reached')
        })
    })
})
