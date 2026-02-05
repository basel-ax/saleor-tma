# Saleor Telegram Mini App

## Project Tech stack

### Backend (TypeScript)
- ✅ All backend code converted from JavaScript to TypeScript
- ✅ Full type safety for Telegram Bot API, Saleor GraphQL, and custom types
- ✅ Modern ES Modules with NodeNext module resolution

### Frontend (React + @tma.js/sdk-react)
- ✅ Complete rewrite from vanilla JavaScript to React
- ✅ Official Telegram SDK integration via `@tma.js/sdk-react`
- ✅ Type-safe components with proper TypeScript definitions

## Project Structure

```
├── src/
│   ├── config/           # Configuration (TypeScript)
│   ├── handlers/         # Command and webhook handlers (TypeScript)
│   ├── routes/            # Express routes (TypeScript)
│   ├── services/          # Telegram and Saleor services (TypeScript)
│   ├── types/             # TypeScript type definitions
│   └── frontend/          # React frontend
│       ├── components/    # React components
│       ├── hooks/         # Custom React hooks (useTMA)
│       └── styles/        # CSS styles
├── public/               # Static files and HTML entry point
├── dist/                 # Compiled output
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Installation

```bash
# Install dependencies
npm install

# Install TypeScript types for better IDE support
npm install --save-dev @types/node @types/express @types/react @types/react-dom
```

## Development

```bash
# Run both backend and frontend in development mode
npm run dev

# Run only backend server
npm run dev:server

# Run only frontend (Vite dev server)
npm run dev:frontend
```

## Production Build

```bash
# Build both frontend and compile TypeScript
npm run build

# Start production server
npm start
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token
ADMIN_CHAT_ID=your_admin_chat_id

# Server
PORT=3000
BASE_URL=http://localhost:3000
WEBHOOK_URL=https://your-domain.com/telegram

# Saleor
SALEOR_API_URL=https://your-store.saleor.cloud/graphql/
SALEOR_CHANNEL_TOKEN=your_channel_token
```

## API Endpoints

- `GET /api/products` - Fetch products from Saleor
- `POST /api/webapp` - Web app data handler
- `POST /telegram` - Telegram webhook endpoint
- `GET /` - Health check

## Key Features

### @tma.js/sdk-react Integration

The new frontend uses `@tma.js/sdk-react` for Telegram Mini App integration:

```typescript
import { useSDK } from '@tma.js/sdk-react';

// Initialize TMA SDK
const sdk = useSDK();
sdk.ready();

// Use main button
sdk.mainButton.setParams({
  text: 'PAY',
  color: '#31b545',
}).show();
```

### Type-Safe Cart Management

```typescript
interface CartItem {
  productId: string;
  count: number;
}

const [cart, setCart] = useState<Map<string, number>>(new Map());
```

### Component Structure

- `CafePage` - Product grid with counter buttons
- `OrderOverview` - Cart review and checkout
- `StatusMessage` - Toast notifications
- `useTMA` - Custom hook for Telegram SDK

## Migration Benefits

1. **Type Safety**: Compile-time error detection
2. **Better IDE Support**: Autocomplete, refactoring, navigation
3. **Maintainability**: Self-documenting code with types
4. **Modern Developer Experience**: Hot reload, fast builds
5. **Official SDK**: Better Telegram integration with `@tma.js/sdk-react`

## Compatibility

- ✅ Telegram WebApp API
- ✅ Saleor GraphQL API
- ✅ Node.js 18+
- ✅ Vite 5+

## License

MIT

---

## Cloudflare Deployment

This project can be deployed to Cloudflare using **Cloudflare Workers** for the backend API and **Cloudflare Pages** for the frontend.

### Prerequisites

1. [Cloudflare account](https://cloudflare.com/)
2. [Wrangler CLI installed](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
3. [Node.js 18+](https://nodejs.org/)

### Quick Deploy

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Cloudflare Workers
npm run deploy:cloudflare
```

### Manual Deployment Steps

#### 1. Backend (Cloudflare Workers)

The backend API runs on Cloudflare Workers using the Edge runtime.

```bash
# Build the worker
npm run build:worker

# Deploy worker
npx wrangler deploy --env production
```

**wrangler.toml Configuration:**

Create `wrangler.toml` in the project root:

```toml
name = "saleor-tma-api"
main = "dist/worker.js"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[vars]
NODE_ENV = "production"

# Environment-specific settings
[env.production]
name = "saleor-tma-api-prod"

[env.staging]
name = "saleor-tma-api-staging"
route = "api.staging.yourdomain.com/*"
```

#### 2. Frontend (Cloudflare Pages)

The React frontend is built and deployed to Cloudflare Pages.

```bash
# Build frontend
npm run build:frontend

# Deploy to Pages
npx wrangler pages deploy dist/client --project-name=saleor-tma
```

**pages.toml Configuration:**

Create `pages.toml` in `frontend/`:

```toml
name = "saleor-tma"
compatibility_date = "2024-01-01"
build_command = "npm run build"
build_dir = "dist/client"
```

### Environment Variables

Set environment variables in Cloudflare Dashboard or via Wrangler:

```bash
# Set secrets for production
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put SALEOR_API_URL
npx wrangler secret put SALEOR_CHANNEL_TOKEN
npx wrangler secret put ADMIN_CHAT_ID
npx wrangler secret put BASE_URL
npx wrangler secret put WEBHOOK_URL
```

**Required Secrets:**

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Telegram Bot API token | Yes |
| `SALEOR_API_URL` | Saleor GraphQL API endpoint | Yes |
| `SALEOR_CHANNEL_TOKEN` | Saleor channel token | Yes |
| `ADMIN_CHAT_ID` | Telegram admin chat ID for notifications | Yes |
| `BASE_URL` | Base URL of the deployed application | Yes |
| `WEBHOOK_URL` | Full webhook URL for Telegram | Yes |

### Telegram Bot Configuration

After deployment, set up your Telegram bot webhook:

```bash
# Set webhook URL
curl -F "url=https://your-worker.your-subdomain.workers.dev/telegram" \
     https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
```

Or use the provided script:

```bash
npm run setwebhook -- --url https://your-worker.your-subdomain.workers.dev/telegram
```

### Custom Domains

#### Workers (API)

```bash
# Add custom route
npx wrangler deploy --env production --routes "api.yourdomain.com/*"
```

#### Pages (Frontend)

1. Go to Cloudflare Dashboard > Pages > your-project
2. Click "Custom domains"
3. Add your custom domain

### Cloudflare Tunnel (Optional)

For local development with Cloudflare tunneling:

```bash
# Install cloudflared
npm install -g cloudflared

# Start tunnel to local server
cloudflared tunnel --url http://localhost:3000
```

### Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Telegram Bot   │────▶│ Cloudflare      │
│                 │     │ Workers (API)   │
└─────────────────┘     └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   Saleor API    │
                        └─────────────────┘

┌─────────────────┐
│  User Browser   │────▶ Cloudflare Pages (Frontend)
└─────────────────┘
```

### Troubleshooting

#### Build Fails

- Ensure Node.js 18+ is installed
- Run `npm install` before building
- Check `tsconfig.json` for correct compiler options

#### Environment Variables Not Loading

- Verify secrets are set in Cloudflare Dashboard
- Use `npx wrangler secret list` to list all secrets

#### Webhook Not Working

- Confirm `WEBHOOK_URL` matches your Worker URL
- Check Telegram Bot token is correct
- Verify Workers has internet access

### Performance Optimization

1. **Enable Caching** - Add Cache-Control headers in your worker
2. **Use KV Store** - Cache frequently accessed data
3. **Minify Assets** - Built-in with Vite production build
4. **Compress Responses** - Enable Gzip/Brotli in wrangler.toml

### Monitoring

- View logs: `npx wrangler tail`
- Check metrics: Cloudflare Dashboard > Workers & Pages > your-project
- Set up alerts: Cloudflare Dashboard > Notifications

### CI/CD Example (GitHub Actions)

```yaml
name: Deploy to Cloudflare
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
```

### Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
