require('dotenv').config();

module.exports = {
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    adminChatId: process.env.ADMIN_CHAT_ID,
  },
  server: {
    port: process.env.PORT || 3000,
    baseUrl: process.env.BASE_URL,
    webhookUrl: process.env.WEBHOOK_URL,
  },
  saleor: {
    apiUrl: process.env.SALEOR_API_URL,
    channelToken: process.env.SALEOR_CHANNEL_TOKEN,
  },
};