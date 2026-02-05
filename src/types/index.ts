// Telegram Types
export interface TelegramConfig {
  botToken: string;
  adminChatId: string;
}

export interface ServerConfig {
  port: number;
  baseUrl: string;
  webhookUrl: string;
}

export interface SaleorConfig {
  apiUrl: string;
  channelToken: string;
}

export interface Config {
  telegram: TelegramConfig;
  server: ServerConfig;
  saleor: SaleorConfig;
}

// Product Types
export interface ProductPricing {
  priceRange: {
    start: {
      gross: {
        amount: number;
        currency: string;
      };
    };
  };
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  slug: string;
  pricing: ProductPricing;
}

export interface ProductResponse {
  products: {
    edges: Array<{
      node: Product;
    }>;
  };
}

// Order Types
export interface OrderItem {
  id: number;
  count: number;
}

export interface OrderData {
  order_data: string; // JSON stringified array of OrderItem
  comment?: string;
}

// WebApp Data Types
export interface WebAppUser {
  id: number;
}

export interface WebAppData {
  user: WebAppUser;
  data: Record<string, unknown>;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}

// Telegram Message Types
export interface TelegramMessage {
  chat: {
    id: number;
  };
  text?: string;
}

export interface TelegramUpdate {
  message?: TelegramMessage;
  web_app_data?: {
    data: {
      method: string;
      [key: string]: unknown;
    };
  };
}
