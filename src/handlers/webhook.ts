import CommandHandlers from './commands.js';
import WebAppHandlers from './webapp.js';
import type { TelegramUpdate } from '../types/index.js';

class WebhookHandler {
  static async handleUpdate(update: TelegramUpdate): Promise<void> {
    // Handle message
    if (update.message) {
      const text = update.message.text;
      
      switch (text) {
        case '/start':
        case '/order':
          await CommandHandlers.handleStart(update.message);
          break;
        case '/test':
          await CommandHandlers.handleTest(update.message);
          break;
        case '/help':
          await CommandHandlers.handleHelp(update.message);
          break;
        case '/ping':
          await CommandHandlers.handlePing(update.message);
          break;
      }
    }

    // Handle web app data
    if (update.web_app_data) {
      const method = update.web_app_data.data.method;
      
      switch (method) {
        case 'makeOrder':
          await WebAppHandlers.handleMakeOrder(update.web_app_data.data as unknown as import('../types/index.js').WebAppData);
          break;
        case 'checkInitData':
          await WebAppHandlers.handleCheckInitData(update.web_app_data.data as unknown as import('../types/index.js').WebAppData);
          break;
        case 'sendMessage':
          await WebAppHandlers.handleSendMessage(update.web_app_data.data as unknown as import('../types/index.js').WebAppData);
          break;
      }
    }
  }
}

export default WebhookHandler;
