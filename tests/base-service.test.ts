import { describe, it, expect, vi } from 'vitest'
import { BaseService } from '@/services/base-service'

// Mock FeatureService since it's used in constructor
vi.mock('@/services/feature-service')

describe('BaseService', () => {
    it('should return tenantId only when branchId is missing', () => {
        const service = new BaseService('tenant-1')
        const scope = (service as any).getScope()
        expect(scope).toEqual({ tenantId: 'tenant-1' })
    })

    it('should return tenantId and branchId when branchId is provided', () => {
        const service = new BaseService('tenant-1', 'branch-1')
        const scope = (service as any).getScope()
        expect(scope).toEqual({ tenantId: 'tenant-1', branchId: 'branch-1' })
    })

    it('should return branch scope with id when branchId is provided', () => {
        const service = new BaseService('tenant-1', 'branch-1')
        const scope = (service as any).getBranchScope()
        expect(scope).toEqual({ tenantId: 'tenant-1', id: 'branch-1' })
    })

    it('should return tenantId only for branch scope when branchId is missing', () => {
        const service = new BaseService('tenant-1')
        const scope = (service as any).getBranchScope()
        expect(scope).toEqual({ tenantId: 'tenant-1' })
    })

    it('should throw error if tenantId is missing', () => {
        expect(() => new BaseService('')).toThrow(/Tenant ID is required/)
    })
})
