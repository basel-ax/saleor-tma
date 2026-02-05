import type { ProductResponse, RestaurantResponse } from '../types/index.js';
declare class SaleorService {
    private client;
    constructor();
    getShops(): Promise<RestaurantResponse>;
    getProducts(first?: number, shopId?: string): Promise<ProductResponse>;
    getProductById(id: string): Promise<unknown>;
    createCheckout(email: string, lines: Array<{
        variantId: string;
        quantity: number;
    }>): Promise<unknown>;
    completeOrder(checkoutId: string): Promise<unknown>;
}
export declare const saleorService: SaleorService;
export default saleorService;
//# sourceMappingURL=saleor.d.ts.map