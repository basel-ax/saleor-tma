import dotenv from 'dotenv';
import type { Config } from '../types';

dotenv.config();

export const config: Config = {
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    adminChatId: process.env.ADMIN_CHAT_ID || '',
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    webhookUrl: process.env.WEBHOOK_URL || '',
  },
  saleor: {
    apiUrl: process.env.SALEOR_API_URL || '',
    channelToken: process.env.SALEOR_CHANNEL_TOKEN || '',
  },
};

export default config;
