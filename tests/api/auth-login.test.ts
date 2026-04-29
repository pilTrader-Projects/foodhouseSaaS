import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/auth/login/route'
import prisma from '@/lib/prisma'
import { NextRequest } from 'next/server'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        user: {
            findUnique: vi.fn(),
        },
    },
}))

describe('API: Auth Login Route', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should successfully login an existing user', async () => {
        const mockUser = {
            id: 'user-123',
            email: 'juan@test.com',
            tenantId: 'tenant-456',
            role: { 
                name: 'Owner',
                permissions: [{ name: 'pos:access' }]
            }
        }
            ; (prisma.user.findUnique as any).mockResolvedValue(mockUser)

        const req = new NextRequest('http://localhost/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'juan@test.com' })
        })

        const response = await POST(req)
        const body = await response.json()

        expect(response.status).toBe(200)
        expect(body.userId).toBe('user-123')
        expect(body.role).toBe('Owner')
        expect(body.permissions).toContain('pos:access')
    })

    it('should return 404 if user is not found', async () => {
        ; (prisma.user.findUnique as any).mockResolvedValue(null)

        const req = new NextRequest('http://localhost/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'missing@test.com' })
        })

        const response = await POST(req)
        const body = await response.json()

        expect(response.status).toBe(404)
        expect(body.error).toContain('not found')
    })

    it('should return 500 if database fails', async () => {
        ; (prisma.user.findUnique as any).mockRejectedValue(new Error('Internal Crash'))

        const req = new NextRequest('http://localhost/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'crash@test.com' })
        })

        const response = await POST(req)
        const body = await response.json()

        expect(response.status).toBe(500)
        expect(body.error).toBe('Internal Crash')
    })
})
