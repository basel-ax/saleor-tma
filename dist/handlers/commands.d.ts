import type { TelegramMessage } from '../types/index.js';
declare class CommandHandlers {
    static handleStart(message: TelegramMessage): Promise<void>;
    static handleTest(message: TelegramMessage): Promise<void>;
    static handleHelp(message: TelegramMessage): Promise<void>;
    static handlePing(message: TelegramMessage): Promise<void>;
}
export default CommandHandlers;
//# sourceMappingURL=commands.d.ts.map