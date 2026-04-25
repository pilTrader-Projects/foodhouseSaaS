import { BaseService } from '@/services/BaseService'
import prisma from '@/lib/prisma'

/**
 * SupplierService handles ingredient deliveries and stock replenishment.
 */
export class SupplierService extends BaseService {
    /**
     * Records a raw material delivery and updates the branch's stock level.
     */
    async recordDelivery(ingredientId: string, quantity: number) {
        return prisma.stock.upsert({
            where: {
                branchId_ingredientId: {
                    branchId: this.branchId!,
                    ingredientId,
                }
            },
            update: {
                quantity: { increment: quantity }
            },
            create: {
                tenantId: this.tenantId,
                branchId: this.branchId!,
                ingredientId,
                quantity,
            }
        })
    }
}
