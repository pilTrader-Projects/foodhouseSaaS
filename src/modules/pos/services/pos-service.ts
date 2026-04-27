import { BaseService } from '@/services/base-service'
import prisma from '@/lib/prisma'
import { InventoryService } from '../../inventory/services/inventory-service'
import { ProductionService } from '@/services/production-service'

/**
 * PosService handles order creation and coordinates with the 
 * Inventory module to ensure stock is deducted in a single transaction.
 */
export class PosService extends BaseService {
    private inventoryService: InventoryService
    private productionService: ProductionService

    constructor(tenantId: string, branchId: string) {
        super(tenantId, branchId)
        this.inventoryService = new InventoryService(tenantId, branchId)
        this.productionService = new ProductionService(tenantId, branchId)
    }

    /**
     * Creates a new order. 
     */
    async createOrder(items: { productId: string; quantity: number; price: number }[]) {
        // 1. Feature Gate
        await this.ensureFeature('pos')

        return await prisma.$transaction(async (tx) => {
            // 1. Calculate total and create the order
            const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

            const order = await tx.order.create({
                data: {
                    tenantId: this.tenantId,
                    branchId: this.branchId!,
                    userId: 'user-admin',
                    totalAmount,
                    items: {
                        create: items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            pricePaid: item.price,
                        })),
                    },
                },
            })

            // 2. Process recursives deductions for each item
            for (const item of items) {
                await this.handleDeduction(item.productId, item.quantity, tx)
            }

            return order
        })
    }

    /**
     * Recursive deduction strategy resolver.
     * Deducts from Prepared Stock or Ingredients based on product model.
     * Then recursively deducts for any product components in the recipe.
     */
    private async handleDeduction(productId: string, quantity: number, tx: any) {
        // 1. Resolve Product Model
        const product = await tx.product.findUnique({
            where: { id: productId },
            include: {
                ingredients: true // Recipe items
            }
        })

        if (!product) return

        // 2. Immediate Deduction (Hybrid Strategy)
        if (product.deductionModel === 'ON_PRODUCTION') {
            // Batch-cooked: Deduct from PREPARED stock
            await this.productionService.consumePreparedStock(productId, quantity, tx)
        } else {
            // Made-to-order: Deduct raw materials directly
            await this.inventoryService.consumeIngredients(productId, quantity, tx)
        }

        // 3. Composite Deduction (Recursive components)
        // If this product has other products as components in its recipe, deduct them too
        for (const recipeItem of product.ingredients) {
            if (recipeItem.componentProductId) {
                await this.handleDeduction(
                    recipeItem.componentProductId,
                    recipeItem.amount * quantity,
                    tx
                )
            }
        }
    }
}
