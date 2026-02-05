# Saleor TMA - PHP to JavaScript Migration Plan

## Overview

This document outlines the plan to migrate the current PHP-based Telegram Mini App (TMA) to JavaScript, integrating with the Saleor GraphQL API for product and order management.

## Current Status

- **Language**: PHP 8.0+
- **Framework**: Custom routing with utilities-php/routing
- **Telegram Bot Library**: telegram-bot-php/core
- **Frontend**: jQuery-based with Telegram Web App API
- **Data Source**: Hardcoded product catalog in PHP

## Migration Goals

1. Replace all PHP code with JavaScript (Node.js backend)
2. Integrate Saleor GraphQL API for product and order management
3. Maintain existing frontend functionality with jQuery
4. Implement proper configuration management
5. Ensure security and authentication
6. Maintain compatibility with Telegram Mini App features

## Architecture

### New Stack

- **Backend**: Node.js + Express
- **Telegram Bot**: node-telegram-bot-api
- **API Client**: graphql-request
- **Configuration**: dotenv
- **Frontend**: Existing jQuery-based (with minor updates)

### Project Structure

```
saleor-tma/
├── src/
│   ├── config/
│   │   └── index.js          # Configuration file
│   ├── services/
│   │   ├── telegram.js       # Telegram bot service
│   │   └── saleor.js         # Saleor GraphQL API client
│   ├── handlers/
│   │   ├── commands.js       # Bot command handlers
│   │   ├── webapp.js         # Web app data handlers
│   │   └── webhook.js        # Webhook handler
│   ├── routes/
│   │   ├── telegram.js       # Telegram webhook route
│   │   └── api.js            # API routes
│   ├── server.js             # Server entry point
│   └── scripts/
│       └── setwebhook.js     # Webhook setup script
├── public/                    # Static files (unchanged)
├── .env                      # Environment variables
├── package.json              # Dependencies
└── README.md                 # Documentation
```

## Migration Steps

### Step 1: Initialize Node.js Project

```bash
# Create package.json
npm init -y

# Install dependencies
npm install express body-parser dotenv node-telegram-bot-api graphql-request

# Install dev dependencies
npm install nodemon --save-dev
```

### Step 2: Create Configuration

```javascript
// src/config/index.js
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
```

```env
# .env
TELEGRAM_BOT_TOKEN=123456798:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
ADMIN_CHAT_ID=123456789

PORT=3000
NODE_ENV=production

BASE_URL=https://somewhere.example.com
WEBHOOK_URL=https://somewhere.example.com/telegram

SALEOR_API_URL=https://your-saleor-instance.com/graphql/
SALEOR_CHANNEL_TOKEN=your-channel-token
```

### Step 3: Create Services

#### Telegram Service

```javascript
// src/services/telegram.js
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
```

#### Saleor GraphQL Client

```javascript
// src/services/saleor.js
const { GraphQLClient } = require('graphql-request');
const config = require('../config');

class SaleorService {
  constructor() {
    this.client = new GraphQLClient(config.saleor.apiUrl, {
      headers: {
        Authorization: `Bearer ${config.saleor.channelToken}`,
      },
    });
  }

  async getProducts(first = 20) {
    const query = `
      query GetProducts($first: Int!) {
        products(first: $first) {
          edges {
            node {
              id
              name
              description
              slug
              pricing {
                priceRange {
                  start {
                    gross {
                      amount
                      currency
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    return await this.client.request(query, { first });
  }

  async getProductById(id) {
    const query = `
      query GetProduct($id: ID!) {
        product(id: $id) {
          id
          name
          description
          pricing {
            priceRange {
              start {
                gross {
                  amount
                  currency
                }
              }
            }
          }
        }
      }
    `;

    return await this.client.request(query, { id });
  }

  async createCheckout(email, lines) {
    const mutation = `
      mutation CreateCheckout($email: String!, $lines: [CheckoutLineInput!]!) {
        checkoutCreate(input: { email: $email, lines: $lines }) {
          checkout {
            id
            token
          }
          errors {
            field
            message
          }
        }
      }
    `;

    return await this.client.request(mutation, { email, lines });
  }

  async completeOrder(checkoutId) {
    const mutation = `
      mutation CreateOrder($checkoutId: ID!) {
        checkoutComplete(checkoutId: $checkoutId) {
          order {
            id
            token
            total {
              gross {
                amount
                currency
              }
            }
          }
          errors {
            field
            message
          }
        }
      }
    `;

    return await this.client.request(mutation, { checkoutId });
  }
}

module.exports = new SaleorService();
```

### Step 4: Create Handlers

#### Command Handlers

```javascript
// src/handlers/commands.js
const telegramService = require('../services/telegram');
const config = require('../config');

class CommandHandlers {
  static async handleStart(message) {
    const chatId = message.chat.id;
    await telegramService.sendMessage(chatId, 
      "*Let's get started* 🍟\n\nPlease tap the button below to order your perfect lunch!", 
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { 
                text: 'Order Food', 
                web_app: { url: `${config.server.baseUrl}/public` }
              }
            ]
          ]
        }
      }
    );
  }

  static async handleTest(message) {
    const chatId = message.chat.id;
    await telegramService.sendMessage(chatId, 
      "Please tap the button below to open the web app!", 
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { 
                text: 'Test', 
                web_app: { url: `${config.server.baseUrl}/public/demo.php` }
              }
            ]
          ]
        }
      }
    );
  }

  static async handleHelp(message) {
    const chatId = message.chat.id;
    await telegramService.sendMessage(chatId, 
      "This is the help page. You can use the following commands:\n\n" +
      "/start - Start the bot\n" +
      "/order - Order a burger\n" +
      "/test - Test the web app\n" +
      "/help - Show this help page"
    );
  }

  static async handlePing(message) {
    const chatId = message.chat.id;
    await telegramService.sendMessage(chatId, "`Pong!`", { parse_mode: 'Markdown' });
  }
}

module.exports = CommandHandlers;
```

#### Web App Handlers

```javascript
// src/handlers/webapp.js
const telegramService = require('../services/telegram');
const saleorService = require('../services/saleor');

class WebAppHandlers {
  static async handleMakeOrder(webAppData) {
    const userId = webAppData.user.id;
    const orderData = webAppData.data.order_data;
    const comment = webAppData.data.comment;

    // Parse order data
    const order = JSON.parse(orderData);
    
    // Build order text
    let orderText = '';
    for (const item of order) {
      const product = await this.getProductById(item.id);
      if (product) {
        orderText += `${item.count}x ${product.name} $${(product.pricing.priceRange.start.gross.amount / 100).toFixed(2)}\n`;
      }
    }

    if (orderText === '') {
      orderText = 'Nothing';
    }

    await telegramService.sendMessage(userId,
      "Your order has been placed successfully! 🍟\n\n" +
      "Your order is:\n`" + orderText + "`\n" +
      "Your order will be delivered to you in 30 minutes. 🚚", 
      { parse_mode: 'Markdown' }
    );

    // TODO: Create order in Saleor
    // await saleorService.createOrder(order, comment);

    return { ok: true };
  }

  static async handleCheckInitData(webAppData) {
    // Validate init data
    return { ok: true };
  }

  static async handleSendMessage(webAppData) {
    const userId = webAppData.user.id;
    const withWebview = webAppData.data.with_webview;

    const options = {
      parse_mode: 'Markdown',
      text: "Hello World!"
    };

    if (withWebview) {
      options.reply_markup = {
        inline_keyboard: [
          [
            { 
              text: 'Open WebApp', 
              web_app: { url: process.env.RESOURCE_BASE_URL }
            }
          ]
        ]
      };
    }

    await telegramService.sendMessage(userId, options.text, options);
    return { ok: true };
  }

  static async getProductById(id) {
    // TODO: Fetch from Saleor
    const products = {
      1: { 
        name: 'Burger', 
        emoji: '🍔', 
        pricing: { priceRange: { start: { gross: { amount: 499 } } } }
      },
      2: { 
        name: 'Fries', 
        emoji: '🍟', 
        pricing: { priceRange: { start: { gross: { amount: 149 } } } }
      },
      3: { 
        name: 'Hotdog', 
        emoji: '🌭', 
        pricing: { priceRange: { start: { gross: { amount: 349 } } } }
      },
      4: { 
        name: 'Tako', 
        emoji: '🐙', 
        pricing: { priceRange: { start: { gross: { amount: 399 } } } }
      },
      5: { 
        name: 'Pizza', 
        emoji: '🍕', 
        pricing: { priceRange: { start: { gross: { amount: 799 } } } }
      },
      6: { 
        name: 'Donut', 
        emoji: '🍩', 
        pricing: { priceRange: { start: { gross: { amount: 149 } } } }
      },
      7: { 
        name: 'Popcorn', 
        emoji: '🍿', 
        pricing: { priceRange: { start: { gross: { amount: 199 } } } }
      },
      8: { 
        name: 'Coke', 
        emoji: '🥤', 
        pricing: { priceRange: { start: { gross: { amount: 149 } } } }
      },
      9: { 
        name: 'Cake', 
        emoji: '🍰', 
        pricing: { priceRange: { start: { gross: { amount: 1099 } } } }
      },
      10: { 
        name: 'Icecream', 
        emoji: '🍦', 
        pricing: { priceRange: { start: { gross: { amount: 599 } } } }
      },
      11: { 
        name: 'Cookie', 
        emoji: '🍪', 
        pricing: { priceRange: { start: { gross: { amount: 399 } } } }
      },
      12: { 
        name: 'Flan', 
        emoji: '🍮', 
        pricing: { priceRange: { start: { gross: { amount: 799 } } } }
      }
    };

    return products[id];
  }
}

module.exports = WebAppHandlers;
```

#### Webhook Handler

```javascript
// src/handlers/webhook.js
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
```

### Step 5: Create Routes

#### Telegram Webhook Route

```javascript
// src/routes/telegram.js
const express = require('express');
const WebhookHandler = require('../handlers/webhook');
const telegramService = require('../services/telegram');
const config = require('../config');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const update = req.body;
    await WebhookHandler.handleUpdate(update);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error handling update:', error);
    res.status(500).send('Error processing request');
  }
});

module.exports = router;
```

#### API Routes

```javascript
// src/routes/api.js
const express = require('express');
const bodyParser = require('body-parser');
const WebAppHandlers = require('../handlers/webapp');
const saleorService = require('../services/saleor');

const router = express.Router();

// Get products from Saleor
router.get('/products', async (req, res) => {
  try {
    const products = await saleorService.getProducts();
    res.json({ ok: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Web app data handler
router.post('/webapp', bodyParser.json(), async (req, res) => {
  try {
    const { method, ...data } = req.body;
    
    // TODO: Implement proper validation
    const webAppData = {
      user: { id: req.body.user_id },
      data: data
    };

    let result;
    switch (method) {
      case 'makeOrder':
        result = await WebAppHandlers.handleMakeOrder(webAppData);
        break;
      case 'checkInitData':
        result = await WebAppHandlers.handleCheckInitData(webAppData);
        break;
      case 'sendMessage':
        result = await WebAppHandlers.handleSendMessage(webAppData);
        break;
      default:
        result = { ok: false, error: 'Unknown method' };
    }

    res.json(result);
  } catch (error) {
    console.error('Error handling web app request:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

module.exports = router;
```

### Step 6: Create Server

```javascript
// src/server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const telegramService = require('./services/telegram');
const config = require('./config');
const telegramRoutes = require('./routes/telegram');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// API routes
app.use('/api', apiRoutes);
app.use('/telegram', telegramRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Ready to serve...');
});

// Start server
app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
});
```

### Step 7: Create Webhook Setup Script

```javascript
// src/scripts/setwebhook.js
require('dotenv').config();
const telegramService = require('../services/telegram');
const config = require('../config');

(async () => {
  try {
    console.log('Setting webhook to:', config.server.webhookUrl);
    const result = await telegramService.getBot().setWebHook(config.server.webhookUrl);
    console.log('Webhook set successfully:', result);
  } catch (error) {
    console.error('Failed to set webhook:', error);
  }
})();
```

### Step 8: Update Frontend

```javascript
// public/js/cafe.js (update)
// Update the apiRequest function to point to new backend endpoint
apiRequest: function (method, data, onCallback) {
  var authData = Telegram.WebApp.initData || "";
  $.ajax('/api/webapp', {
    type: "POST",
    data: $.extend(data, { _auth: authData, method: method }),
    dataType: "json",
    xhrFields: {
      withCredentials: true,
    },
    success: function (result) {
      onCallback && onCallback(result);
    },
    error: function (xhr) {
      onCallback && onCallback({ error: "Server error" });
    },
  });
},

// Update config initialization
Cafe.init({
  "apiUrl": "/api/webapp",
  "userId": 0,
  "userHash": null
});
```

## Key GraphQL Queries

### Get Products

```graphql
query GetProducts($first: Int!) {
  products(first: $first) {
    edges {
      node {
        id
        name
        description
        slug
        pricing {
          priceRange {
            start {
              gross {
                amount
                currency
              }
            }
          }
        }
      }
    }
  }
}
```

### Create Checkout

```graphql
mutation CreateCheckout($email: String!, $lines: [CheckoutLineInput!]!) {
  checkoutCreate(input: { email: $email, lines: $lines }) {
    checkout {
      id
      token
    }
    errors {
      field
      message
    }
  }
}
```

### Complete Order

```graphql
mutation CreateOrder($checkoutId: ID!) {
  checkoutComplete(checkoutId: $checkoutId) {
    order {
      id
      token
      total {
        gross {
          amount
          currency
        }
      }
    }
    errors {
      field
      message
    }
  }
}
```

## Rollout Plan

### Development Environment

1. Set up local Node.js environment
2. Test with Saleor sandbox instance
3. Verify all functionality

### Staging Environment

1. Deploy to staging server
2. Test with production-like data
3. Perform end-to-end testing

### Production Deployment

1. Update webhook to new endpoint
2. Monitor for errors
3. Have rollback plan ready

## Post-Migration Tasks

1. Remove PHP files and dependencies
2. Update documentation
3. Clean up unused assets
4. Update deployment scripts
5. Monitor performance and logs

## Success Criteria

- [ ] All bot commands work correctly
- [ ] Web app ordering flow functions properly
- [ ] Products are fetched from Saleor API
- [ ] Orders are created in Saleor
- [ ] No PHP dependencies remain
- [ ] Application is performant and stable