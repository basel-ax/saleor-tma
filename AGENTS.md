# AGENTS.md

> Build and maintain this Telegram Mini App using this guide.
> Feed this file to Claude Code, Cursor, or ChatGPT to understand the project.

## Project Overview

This is a **Telegram Mini App** for ordering goods from restaurants. The app follows a multi-page flow:
1. **Restaurant Selection** - Browse and select a restaurant
2. **Menu Categories** - View menu categories for the selected restaurant
3. **Product Menu Category** - Browse products within a category
4. **Order Result** - Complete and view order confirmation

**Target Platform**: Telegram Mini App (Cloudflare deployment)

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 18 + TypeScript | UI components and state management |
| Build Tool | Vite | Fast development and production builds |
| TMA SDK | @tma.js/sdk-react | Telegram Mini App integration |
| Backend | Node.js + Express | API server and webhook handling |
| E-commerce | Saleor API | Product and order management |
| Deployment | Cloudflare | Hosting and CDN |
| Database | PostgreSQL (via Saleor) | Persistent data storage |

## Key Files Structure

```
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Main application component
│   │   ├── index.tsx            # Entry point
│   │   ├── components/
│   │   │   ├── CafePage.tsx     # Restaurant selection page
│   │   │   ├── OrderOverview.tsx # Order confirmation page
│   │   │   └── StatusMessage.tsx # Status display component
│   │   ├── hooks/
│   │   │   └── useTMA.ts        # Telegram Mini App hooks
│   │   └── styles/
│   │       └── index.css        # Global styles
│   └── index.html               # HTML template
├── src/
│   ├── server.ts                # Express server entry point
│   ├── config/
│   │   └── index.ts             # Configuration management
│   ├── routes/
│   │   ├── api.ts               # API routes
│   │   └── telegram.ts          # Telegram webhook routes
│   ├── handlers/
│   │   ├── commands.ts          # Bot command handlers
│   │   ├── webapp.ts            # Web app interaction handlers
│   │   └── webhook.ts           # Webhook processing
│   ├── services/
│   │   ├── saleor.ts            # Saleor API client
│   │   └── telegram.ts          # Telegram service utilities
│   └── types/
│       └── index.ts             # TypeScript type definitions
├── public/
│   └── js/
│       └── telegram-webview.js  # Telegram WebView script
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Telegram Bot (via BotFather)
- Saleor instance (cloud or self-hosted)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your environment variables in .env
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Telegram Bot API token | Yes |
| `TELEGRAM_WEBAPP_URL` | Public URL for the web app | Yes |
| `SALEOR_API_URL` | Saleor GraphQL endpoint | Yes |
| `SALEOR_API_TOKEN` | Saleor authentication token | Yes |
| `BOT_DOMAIN` | Domain for webhook endpoint | Yes |

### Running Development Server

```bash
# Start development server with hot reload
npm run dev

# The app will be available at http://localhost:5173 (default Vite port)
```

For local Telegram testing, use ngrok for HTTPS tunneling:
```bash
ngrok http 5173 --domain=your-free-subdomain.ngrok-free.app
```

### Production Build

```bash
# Build for production
npm run build

# Output is in dist/ directory
```

## Telegram Integration

### SDK Usage

Use `@tma.js/sdk-react` for React components:

```typescript
import { useSDK } from '@tma.js/sdk-react';

function MyComponent() {
  const sdk = useSDK();
  
  // Initialize when ready
  useEffect(() => {
    if (sdk) {
      sdk.ready();
    }
  }, [sdk]);
  
  return <div>Your component</div>;
}
```

### Theming

Telegram Mini Apps support automatic theming via CSS variables:

```css
:root {
  --tg-theme-bg-color: #ffffff;
  --tg-theme-text-color: #000000;
  --tg-theme-button-color: #2481cc;
  --tg-theme-button-text-color: #ffffff;
  --tg-theme-secondary-bg-color: #f5f5f5;
  --tg-theme-hint-color: #999999;
  --tg-theme-link-color: #2481cc;
  --tg-theme-destructive-color: #ff3b30;
}
```

### Navigation

Use Telegram's built-in navigation methods:

```typescript
import { useBackButton } from '@tma.js/sdk-react';

// Handle back button press
const bb = useBackButton();
bb.on('click', () => {
  // Navigate back or close app
  window.history.back();
});
```

### MainButton

```typescript
import { useMainButton } from '@tma.js/sdk-react';

const mb = useMainButton();
mb.setText('Submit Order');
mb.on('click', handleSubmit);
mb.show();
```

## Authentication

### Init Data Validation

Always validate Telegram init data on the server:

```typescript
import { validateInitData } from '@telegram-apps/init-data-node';

async function authenticateUser(initData: string) {
  const result = await validateInitData(initData, process.env.BOT_TOKEN!);
  
  if (!result) {
    throw new Error('Invalid init data');
  }
  
  return result.user;
}
```

### Secure Storage

Use CloudStorage for persistent data:

```typescript
import { cloudStorage } from '@tma.js/sdk';

await cloudStorage.setItem('cart', JSON.stringify(cart));
const cartData = await cloudStorage.getItem('cart');
```

## API Endpoints

### Telegram Webhook

```
POST /webhook
- Receives Telegram updates
- Validates auth using HMAC-SHA256
- Routes to appropriate handlers
```

### API Routes

```
GET  /api/restaurants     - List available restaurants
GET  /api/menu/:id        - Get menu for restaurant
GET  /api/products/:catId - Get products in category
POST /api/orders          - Create new order
GET  /api/orders/:id       - Get order status
```

## Saleor Integration

### GraphQL Client Setup

```typescript
import { GraphQLClient } from 'graphql-request';

const saleorClient = new GraphQLClient(process.env.SALEOR_API_URL!, {
  headers: {
    Authorization: `Bearer ${process.env.SALEOR_API_TOKEN}`,
  },
});
```

### Example Query

```typescript
const GET_RESTAURANTS = `
  query GetRestaurants {
    shops(first: 10) {
      id
      name
      description
      products(first: 1) {
        id
      }
    }
  }
`;

const restaurants = await saleorClient.request(GET_RESTAURANTS);
```

## Best Practices

### 1. Lazy SDK Loading

```typescript
// Load SDK only when needed
import { init } from '@tma.js/sdk';

async function loadSDK() {
  const sdk = await init();
  return sdk;
}
```

### 2. Handle Haptic Feedback

```typescript
const sdk = useSDK();
sdk.HapticFeedback.impactOccurred('medium');
```

### 3. Share Functionality

Provide fallback for sharing:

```typescript
const shareUrl = `https://t.me/${botName}?startapp=${param}`;

// Use Telegram share or clipboard fallback
if (sdk.share) {
  sdk.share('Share this app', shareUrl);
} else {
  navigator.clipboard.writeText(shareUrl);
}
```

### 4. Error Boundaries

Wrap components with error boundaries:

```typescript
<ErrorBoundary fallback={<ErrorDisplay />}>
  <YourComponent />
</ErrorBoundary>
```

### 5. Loading States

Always show loading indicators during async operations:

```typescript
const [loading, setLoading] = useState(true);

if (loading) {
  return <Spinner />;
}
```

## Testing

### Local Testing Without Telegram

Use the mock environment pattern:

```typescript
import { mockTelegramEnv, retrieveLaunchParams } from '@tma.js/sdk';

mockTelegramEnv({
  launchParams: retrieveLaunchParams('mock-data-here'),
  themeParams: {
    bg_color: '#ffffff',
    text_color: '#000000',
  },
});
```

### Test User

For automated testing, use `id=0` as the test user ID.

### Debugging

Enable Eruda for mobile debugging:

```bash
# Add eruda to your index.html
<script src="//cdn.jsdelivr.net/npm/eruda/eruda.js"></script>
<script>eruda.init();</script>
```

## Deployment (Cloudflare)

### Build for Production

```bash
npm run build
```

### Cloudflare Pages

1. Connect your repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables in Cloudflare dashboard

### Webhook Setup

```bash
# Set webhook URL
curl -F "url=https://your-app.pages.dev/webhook" \
  https://api.telegram.org/bot<TOKEN>/setWebhook
```

## Common Mistakes to Avoid

1. **Don't validate init data on the client** - Always validate on the server
2. **Don't hardcode secrets** - Use environment variables
3. **Don't ignore theme params** - Support both light and dark modes
4. **Don't block the main thread** - Use async operations for heavy tasks
5. **Don't forget back button handling** - Always handle the back button
6. **Don't use localStorage** - Use CloudStorage for persistence
7. **Don't skip error boundaries** - Components can fail unexpectedly
8. **Don't assume portrait mode** - Support both orientations
9. **Don't forget loading states** - Show feedback during async operations
10. **Don't ignore haptic feedback** - Use it for better UX

## Resources

- [TMA Platform Documentation](https://docs.telegram-mini-apps.com/)
- [@tma.js/sdk Documentation](https://docs.telegram-mini-apps.com/packages/tma-js-sdk)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Saleor Documentation](https://docs.saleor.io/)
- [TON Connect (for future payments)](https://docs.ton.orgton-connect//ecosystem/overview)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
