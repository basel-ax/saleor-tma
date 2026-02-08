import WebhookHandler from './handlers/webhook.js';
import WebAppHandlers from './handlers/webapp.js';
import saleorService from './services/saleor.js';
import type { ApiResponse as ApiResponseType } from './types/index.js';

// Cloudflare Workers compatible path handling
function getRelativePath(pathname: string): string {
  if (pathname === '/' || pathname === '') {
    return '/index.html';
  }
  return pathname;
}

function getContentType(path: string): string {
  if (path.endsWith('.html')) return 'text/html';
  if (path.endsWith('.css')) return 'text/css';
  if (path.endsWith('.js')) return 'application/javascript';
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  return 'application/octet-stream';
}

// Serve static files from the dist/public directory
async function serveStatic(pathname: string): Promise<Response | null> {
  const fileName = getRelativePath(pathname);
  // In Cloudflare Workers, we can't access local file system
  // Static files need to be served via a separate mechanism (Pages, R2, etc.)
  // For now, return null to fallback to the SPA index.html
  return null;
}

// Get environment variable
const getEnv = (key: string): string | undefined => {
  return process.env[key];
};

// Main fetch handler
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Health check endpoint
    if (path === '/api/health') {
      try {
        const saleorAvailable = await saleorService.checkConnection();
        return new Response(JSON.stringify({ saleor: saleorAvailable }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ saleor: false, error: 'Saleor API unavailable' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Root endpoint
    if (path === '/' || path === '') {
      return new Response('Ready to serve...', {
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // API routes
    if (path === '/api/restaurants') {
      try {
        const restaurants = await saleorService.getShops();
        return new Response(JSON.stringify({ ok: true, data: restaurants }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ ok: false, error: (error as Error).message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (path === '/api/products') {
      try {
        const shopId = url.searchParams.get('shopId') || undefined;
        const products = await saleorService.getProducts(20, shopId);
        return new Response(JSON.stringify({ ok: true, data: products }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ ok: false, error: (error as Error).message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (path === '/api/webapp' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { method, ...data } = body as { method: string; [key: string]: unknown };
        
        const webAppData = {
          user: { id: (body as { user_id?: number }).user_id || 0 },
          data: data
        };

        let result: ApiResponseType;
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

        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ ok: false, error: (error as Error).message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Telegram webhook route
    if (path === '/telegram' && request.method === 'POST') {
      try {
        const update = await request.json() as import('./types/index.js').TelegramUpdate;
        await WebhookHandler.handleUpdate(update);
        return new Response('OK', { status: 200 });
      } catch (error) {
        console.error('Error handling update:', error);
        return new Response('Error processing request', { status: 500 });
      }
    }

    // Serve static files
    const staticResponse = await serveStatic(path);
    if (staticResponse) {
      return staticResponse;
    }

    // Return a simple HTML for SPA routing when in worker mode
    // Static files should be served via Cloudflare Pages
    const spaHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Saleor TMA</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <div id="root">
    <h1>Saleor Telegram Mini App</h1>
    <p>API is running. Frontend should be served via Cloudflare Pages.</p>
    <p>Available endpoints:</p>
    <ul>
      <li><a href="/api/health">/api/health</a></li>
      <li><a href="/api/restaurants">/api/restaurants</a></li>
      <li><a href="/api/products">/api/products</a></li>
    </ul>
  </div>
</body>
</html>`;

    return new Response(spaHtml, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
};
