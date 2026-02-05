import TelegramBot from 'node-telegram-bot-api';
import config from '../config/index.js';

class TelegramService {
  private bot: TelegramBot;

  constructor() {
    this.bot = new TelegramBot(config.telegram.botToken, { polling: false });
  }

  async sendMessage(chatId: number, text: string, options: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    try {
      return await this.bot.sendMessage(chatId, text, options);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  getBot(): TelegramBot {
    return this.bot;
  }
}

export const telegramService = new TelegramService();
export default telegramService;
