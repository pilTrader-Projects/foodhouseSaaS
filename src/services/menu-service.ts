import { BaseService } from './base-service'
import prisma from '@/lib/prisma'

/**
 * MenuService handles localized product offerings for branches.
 * It merges the global product catalog with branch-specific overrides.
 */
export class MenuService extends BaseService {
    /**
     * Resolves the full menu for the branch.
     * Logic:
     * 1. Get all products for the tenant.
     * 2. Get all overrides for the specific branch.
     * 3. Merge them, prioritizing branch overrides.
     */
    async getBranchMenu() {
        const [products, overrides] = await Promise.all([
            prisma.product.findMany({
                where: { tenantId: this.tenantId }
            }),
            prisma.branchProduct.findMany({
                where: { branchId: this.branchId! }
            })
        ])

        return products.map(product => {
            const override = overrides.find(o => o.productId === product.id)

            return {
                ...product,
                price: override?.priceOverride ?? product.price,
                isAvailable: override?.isAvailable ?? true
            }
        })
    }

    /**
     * Sets a price override for a specific branch.
     */
    async setPriceOverride(productId: string, price: number) {
        return prisma.branchProduct.upsert({
            where: {
                branchId_productId: {
                    branchId: this.branchId!,
                    productId
                }
            },
            update: { priceOverride: price },
            create: {
                branchId: this.branchId!,
                productId,
                priceOverride: price
            }
        })
    }

    /**
     * Toggles product availability for a specific branch.
     */
    async setAvailability(productId: string, isAvailable: boolean) {
        return prisma.branchProduct.upsert({
            where: {
                branchId_productId: {
                    branchId: this.branchId!,
                    productId
                }
            },
            update: { isAvailable },
            create: {
                branchId: this.branchId!,
                productId,
                isAvailable
            }
        })
    }
}
