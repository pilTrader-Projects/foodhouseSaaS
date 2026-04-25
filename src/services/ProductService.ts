import { BaseService } from './BaseService'
import prisma from '@/lib/prisma'

export class ProductService extends BaseService {
    /**
     * Fetches all products scoped to the current tenant and branch.
     */
    async getProducts() {
        return prisma.product.findMany({
            where: this.getScope(),
        })
    }

    /**
     * Creates a product with enforced tenant and branch IDs.
     */
    async createProduct(data: { name: string; price: number }) {
        return prisma.product.create({
            data: {
                ...data,
                ...this.getScope(),
            },
        })
    }
}
