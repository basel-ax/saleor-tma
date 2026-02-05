# Saleor Telegram Mini App - TypeScript Migration

This project has been migrated to TypeScript with React frontend using `@tma.js/sdk-react`.

## Migration Summary

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
