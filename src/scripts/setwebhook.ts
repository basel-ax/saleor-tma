import dotenv from 'dotenv';
import telegramService from '../services/telegram.js';
import config from '../config/index.js';

dotenv.config();

(async () => {
  try {
    console.log('Setting webhook to:', config.server.webhookUrl);
    const result = await telegramService.getBot().setWebHook(config.server.webhookUrl);
    console.log('Webhook set successfully:', result);
  } catch (error) {
    console.error('Failed to set webhook:', error);
  }
})();
