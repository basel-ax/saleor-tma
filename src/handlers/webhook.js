const CommandHandlers = require('./commands');
const WebAppHandlers = require('./webapp');

class WebhookHandler {
  static async handleUpdate(update) {
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
          return await WebAppHandlers.handleMakeOrder(update.web_app_data);
        case 'checkInitData':
          return await WebAppHandlers.handleCheckInitData(update.web_app_data);
        case 'sendMessage':
          return await WebAppHandlers.handleSendMessage(update.web_app_data);
      }
    }
  }
}

module.exports = WebhookHandler;