import type { WebAppData, ApiResponse } from '../types/index.js';
declare class WebAppHandlers {
    static handleMakeOrder(webAppData: WebAppData): Promise<ApiResponse>;
    static handleCheckInitData(_webAppData: WebAppData): Promise<ApiResponse>;
    static handleSendMessage(webAppData: WebAppData): Promise<ApiResponse>;
    static getProductById(id: number): {
        name: string;
        emoji: string;
        pricing: {
            priceRange: {
                start: {
                    gross: {
                        amount: number;
                    };
                };
            };
        };
    };
}
export default WebAppHandlers;
//# sourceMappingURL=webapp.d.ts.map