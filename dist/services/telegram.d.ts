import TelegramBot from 'node-telegram-bot-api';
declare class TelegramService {
    private bot;
    constructor();
    sendMessage(chatId: number, text: string, options?: Record<string, unknown>): Promise<Record<string, unknown>>;
    getBot(): TelegramBot;
}
export declare const telegramService: TelegramService;
export default telegramService;
//# sourceMappingURL=telegram.d.ts.map