import { describe, it, expect } from 'vitest'
import { PERMISSIONS, ROLES } from '@/lib/constants'

describe('Constants integrity', () => {
    it('should have unique permission strings', () => {
        const values = Object.values(PERMISSIONS)
        const uniqueValues = new Set(values)
        expect(values.length).toBe(uniqueValues.size)
    })

    it('should have standard roles defined', () => {
        expect(ROLES.OWNER).toBe('Owner')
        expect(ROLES.CHEF).toBe('Chef')
        expect(ROLES.MANAGER).toBe('Manager')
        expect(ROLES.STAFF).toBe('Staff')
    })
})
