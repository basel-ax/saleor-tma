import telegramService from '../services/telegram.js';
// Fallback products matching the original PHP store_items
const products = {
    1: { name: 'Burger', emoji: '🍔', pricing: { priceRange: { start: { gross: { amount: 499 } } } } },
    2: { name: 'Fries', emoji: '🍟', pricing: { priceRange: { start: { gross: { amount: 149 } } } } },
    3: { name: 'Hotdog', emoji: '🌭', pricing: { priceRange: { start: { gross: { amount: 349 } } } } },
    4: { name: 'Tako', emoji: '🐙', pricing: { priceRange: { start: { gross: { amount: 399 } } } } },
    5: { name: 'Pizza', emoji: '🍕', pricing: { priceRange: { start: { gross: { amount: 799 } } } } },
    6: { name: 'Donut', emoji: '🍩', pricing: { priceRange: { start: { gross: { amount: 149 } } } } },
    7: { name: 'Popcorn', emoji: '🍿', pricing: { priceRange: { start: { gross: { amount: 199 } } } } },
    8: { name: 'Coke', emoji: '🥤', pricing: { priceRange: { start: { gross: { amount: 149 } } } } },
    9: { name: 'Cake', emoji: '🍰', pricing: { priceRange: { start: { gross: { amount: 1099 } } } } },
    10: { name: 'Icecream', emoji: '🍦', pricing: { priceRange: { start: { gross: { amount: 599 } } } } },
    11: { name: 'Cookie', emoji: '🍪', pricing: { priceRange: { start: { gross: { amount: 399 } } } } },
    12: { name: 'Flan', emoji: '🍮', pricing: { priceRange: { start: { gross: { amount: 799 } } } } }
};
// Fallback restaurants
const restaurants = {
    '1': { name: 'Main Cafe' },
    '2': { name: 'Burger Palace' },
    '3': { name: 'Pizza House' },
};
class WebAppHandlers {
    static async handleMakeOrder(webAppData) {
        const userId = webAppData.user.id;
        const orderData = webAppData.data.order_data;
        const comment = webAppData.data.comment;
        const restaurantId = webAppData.data.restaurant_id;
        // Parse order data
        const order = JSON.parse(orderData);
        // Get restaurant name
        const restaurantName = restaurantId && restaurants[restaurantId]
            ? restaurants[restaurantId].name
            : 'Cafe';
        // Build order text
        let orderText = '';
        for (const item of order) {
            const product = products[item.id];
            if (product) {
                orderText += `${item.count}x ${product.name} ${(product.pricing.priceRange.start.gross.amount / 100).toFixed(2)}\n`;
            }
        }
        if (orderText === '') {
            orderText = 'Nothing';
        }
        await telegramService.sendMessage(userId, `Your order from ${restaurantName} has been placed successfully! 🍟\n\n` +
            "Your order is:\n`" + orderText + "`\n" +
            "Your order will be delivered to you in 30 minutes. 🚚", { parse_mode: 'Markdown' });
        return { ok: true };
    }
    static async handleCheckInitData(_webAppData) {
        // Validate init data
        return { ok: true };
    }
    static async handleSendMessage(webAppData) {
        const userId = webAppData.user.id;
        const withWebview = webAppData.data.with_webview;
        const options = {
            parse_mode: 'Markdown',
            text: "Hello World!"
        };
        if (withWebview) {
            options.reply_markup = {
                inline_keyboard: [
                    [
                        {
                            text: 'Open WebApp',
                            web_app: { url: process.env.RESOURCE_BASE_URL || 'https://example.com' }
                        }
                    ]
                ]
            };
        }
        await telegramService.sendMessage(userId, options.text, options);
        return { ok: true };
    }
    static getProductById(id) {
        return products[id];
    }
}
export default WebAppHandlers;
//# sourceMappingURL=webapp.js.map