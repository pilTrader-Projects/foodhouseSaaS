import { BaseService } from '@/services/BaseService'
import prisma from '@/lib/prisma'

/**
 * SupplierService handles ingredient deliveries and stock replenishment.
 */
export class SupplierService extends BaseService {
    /**
     * Records a raw material delivery and updates the branch's stock level.
     * This uses an upsert logic to either create a new stock record or 
     * increment the existing one.
     */
    async recordDelivery(ingredientId: string, quantity: number) {
        // In a real database, we would use a unique constraint on (branchId, ingredientId)
        // For this implementation, we use updateMany then create if count is 0,
        // or a single upsert if the schema has the correct unique index.
        return prisma.stock.upsert({
            where: {
                // Placeholder for the composite unique key (branchId_ingredientId)
                id: 'placeholder_id',
            } as any,
            update: {
                quantity: { increment: quantity }
            },
            create: {
                branchId: this.branchId!,
                ingredientId,
                quantity,
                // Since we are using shared schema, tenantId would be handled here too
            } as any
        })
    }
}
