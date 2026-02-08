import TelegramBot from 'node-telegram-bot-api';
import config from '../config/index.js';
class TelegramService {
    constructor() {
        this.bot = new TelegramBot(config.telegram.botToken, { polling: false });
    }
    async sendMessage(chatId, text, options = {}) {
        try {
            return await this.bot.sendMessage(chatId, text, options);
        }
        catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
    getBot() {
        return this.bot;
    }
}
export const telegramService = new TelegramService();
export default telegramService;
