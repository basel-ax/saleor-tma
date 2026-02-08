/**
 * Cloudflare Worker entry point
 * This file provides a minimal worker that handles API requests
 */

// Type definitions for Cloudflare Workers
interface Env {
  TELEGRAM_BOT_TOKEN?: string;
  SALEOR_API_URL?: string;
  SALEOR_API_TOKEN?: string;
  SALEOR_CHANNEL_TOKEN?: string;
}

export interface ExportedHandler {
  fetch?: (request: Request, env?: Env) => Promise<Response> | Response;
  scheduled?: (controller: { scheduledTime: number }, env?: Env) => Promise<void> | void;
}

// Health check endpoint
async function handleHealth(): Promise<Response> {
  return new Response(JSON.stringify({ status: 'ok', timestamp: Date.now() }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// Main fetch handler
export default {
  async fetch(request: Request, env?: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Health check
    if (path === '/api/health') {
      return handleHealth();
    }

    // API endpoints
    if (path === '/api/restaurants') {
      // Return mock data for now - replace with Saleor API call
      return new Response(JSON.stringify({ ok: true, data: [] }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path === '/api/products') {
      // Return mock data for now
      return new Response(JSON.stringify({ ok: true, data: [] }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path === '/api/webapp' && request.method === 'POST') {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Telegram webhook
    if (path === '/telegram' && request.method === 'POST') {
      return new Response('OK', { status: 200 });
    }

    // Root
    if (path === '/' || path === '') {
      return new Response('Saleor TMA API Worker', {
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    return new Response('Not Found', { status: 404 });
  }
} satisfies ExportedHandler;
