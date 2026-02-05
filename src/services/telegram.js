const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');

class TelegramService {
  constructor() {
    this.bot = new TelegramBot(config.telegram.botToken, { polling: false });
  }

  async sendMessage(chatId, text, options = {}) {
    try {
      return await this.bot.sendMessage(chatId, text, options);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  getBot() {
    return this.bot;
  }
}

module.exports = new TelegramService();