import { BaseService } from './base-service'
import prisma from '@/lib/prisma'

/**
 * SupplierService manages suppliers and procurement records.
 * Extension of BaseService ensures all operations are tenant-scoped.
 */
export class SupplierService extends BaseService {
    /**
     * Creates a new supplier for the current tenant.
     */
    async createSupplier(data: { name: string; contact?: string }) {
        return prisma.supplier.create({
            data: {
                ...data,
                tenantId: this.tenantId,
            },
        })
    }

    /**
     * Links an ingredient to a supplier.
     */
    async linkIngredient(ingredientId: string, supplierId: string) {
        return prisma.ingredient.update({
            where: { id: ingredientId },
            data: { supplierId },
        })
    }

    /**
     * Records a purchase and updates the stock level for the branch.
     * This logic is wrapped in a transaction to ensure stock integrity.
     */
    async recordPurchase(data: {
        supplierId: string;
        ingredientId: string;
        quantity: number;
        unitCost: number;
    }) {
        const totalCost = data.quantity * data.unitCost

        return prisma.$transaction(async (tx) => {
            // 1. Create the purchase record
            const purchase = await tx.purchaseRecord.create({
                data: {
                    ...data,
                    totalCost,
                    tenantId: this.tenantId,
                    branchId: this.branchId!,
                },
            })

            // 2. Increment the stock level
            await tx.stock.updateMany({
                where: {
                    tenantId: this.tenantId,
                    branchId: this.branchId!,
                    ingredientId: data.ingredientId,
                },
                data: {
                    quantity: {
                        increment: data.quantity,
                    },
                } as any,
            })

            return purchase
        })
    }
    /**
     * Fetches all suppliers for the current tenant.
     */
    async getSuppliers() {
        return prisma.supplier.findMany({
            where: { tenantId: this.tenantId },
            orderBy: { name: 'asc' },
        })
    }
}
