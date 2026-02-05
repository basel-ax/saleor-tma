// Type declarations for modules without proper types

declare module 'node-telegram-bot-api' {
  export default class TelegramBot {
    constructor(token: string, options?: { polling?: boolean; webHook?: boolean });
    sendMessage(chatId: number, text: string, options?: Record<string, unknown>): Promise<Record<string, unknown>>;
    setWebHook(url: string): Promise<boolean>;
    close(): void;
  }
}

// Declare TMA SDK globally for TypeScript
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        initData: string;
        initDataUnsafe: Record<string, unknown>;
        themeParams: Record<string, string>;
        colorScheme: string;
        MainButton: {
          setParams: (params: Record<string, unknown>) => void;
          show: () => void;
          hide: () => void;
          showProgress: () => void;
          hideProgress: () => void;
          onClick: (callback: () => void) => void;
        };
        onEvent: (event: string, callback: () => void) => void;
      };
    };
  }
}
