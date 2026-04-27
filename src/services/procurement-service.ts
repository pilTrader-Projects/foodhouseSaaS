import { BaseService } from '@/services/base-service'
import prisma from '@/lib/prisma'

export interface DeliveryItem {
    ingredientId: string;
    quantity: number;
    unitCost: number;
}

/**
 * ProcurementService handles receiving of raw materials and ingredients.
 */
export class ProcurementService extends BaseService {
    /**
     * Records an incoming delivery from a supplier and updates branch stock levels.
     */
    async recordDelivery(supplierId: string, items: DeliveryItem[]) {
        if (items.length === 0) return;

        await this.ensureFeature('inventory');
        const { tenantId, branchId } = this.getScope();

        if (!branchId) throw new Error('Branch context required for recording deliveries');

        return await prisma.$transaction(async (tx) => {
            // 1. Create Purchase Records
            await tx.purchaseRecord.createMany({
                data: items.map(item => ({
                    ...item,
                    supplierId,
                    tenantId,
                    branchId,
                    totalCost: item.quantity * item.unitCost
                }))
            });

            // 2. Update Stock Levels (Sequential to ensure correctness in transaction)
            for (const item of items) {
                await tx.stock.upsert({
                    where: {
                        branchId_ingredientId: {
                            branchId,
                            ingredientId: item.ingredientId
                        }
                    },
                    update: {
                        quantity: {
                            increment: item.quantity
                        }
                    },
                    create: {
                        tenantId,
                        branchId,
                        ingredientId: item.ingredientId,
                        quantity: item.quantity
                    }
                });
            }
        });
    }

    /**
     * Fetches recent purchase records for the branch.
     */
    async getRecentDeliveries() {
        await this.ensureFeature('inventory');
        return prisma.purchaseRecord.findMany({
            where: this.getScope(),
            include: {
                ingredient: true,
                supplier: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50
        });
    }
}
