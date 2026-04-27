import { BaseService } from '@/services/base-service'
import prisma from '@/lib/prisma'

/**
 * ProductService manages the catalog of sellable items for a tenant.
 */
export class ProductService extends BaseService {
    /**
     * Creates a new product for the tenant.
     * Mandates 'pos' feature availability.
     */
    async createProduct(data: { name: string; price: number; deductionModel?: string }) {
        await this.ensureFeature('pos')

        return prisma.product.create({
            data: {
                ...data,
                ...this.getScope(),
            },
        })
    }

    /**
     * Fetches all products for the tenant.
     */
    async getProducts() {
        await this.ensureFeature('pos')
        return prisma.product.findMany({
            where: this.getScope(),
        })
    }
}
