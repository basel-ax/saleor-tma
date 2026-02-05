import telegramService from '../services/telegram.js';
import config from '../config/index.js';
class CommandHandlers {
    static async handleStart(message) {
        const chatId = message.chat.id;
        await telegramService.sendMessage(chatId, "*Let's get started* 🍟\n\nPlease tap the button below to order your perfect lunch!", {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Order Food',
                            web_app: { url: `${config.server.baseUrl}` }
                        }
                    ]
                ]
            }
        });
    }
    static async handleTest(message) {
        const chatId = message.chat.id;
        await telegramService.sendMessage(chatId, "Please tap the button below to open the web app!", {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Test',
                            web_app: { url: `${config.server.baseUrl}/demo` }
                        }
                    ]
                ]
            }
        });
    }
    static async handleHelp(message) {
        const chatId = message.chat.id;
        await telegramService.sendMessage(chatId, "This is the help page. You can use the following commands:\n\n" +
            "/start - Start the bot\n" +
            "/order - Order a burger\n" +
            "/test - Test the web app\n" +
            "/help - Show this help page");
    }
    static async handlePing(message) {
        const chatId = message.chat.id;
        await telegramService.sendMessage(chatId, "`Pong!`", { parse_mode: 'Markdown' });
    }
}
export default CommandHandlers;
//# sourceMappingURL=commands.js.map