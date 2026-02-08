// src/worker.ts
async function handleHealth() {
  return new Response(JSON.stringify({ status: "ok", timestamp: Date.now() }), {
    headers: { "Content-Type": "application/json" }
  });
}
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path === "/api/health") {
      return handleHealth();
    }
    if (path === "/api/restaurants") {
      return new Response(JSON.stringify({ ok: true, data: [] }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    if (path === "/api/products") {
      return new Response(JSON.stringify({ ok: true, data: [] }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    if (path === "/api/webapp" && request.method === "POST") {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    if (path === "/telegram" && request.method === "POST") {
      return new Response("OK", { status: 200 });
    }
    if (path === "/" || path === "") {
      return new Response("Saleor TMA API Worker", {
        headers: { "Content-Type": "text/plain" }
      });
    }
    return new Response("Not Found", { status: 404 });
  }
};
export {
  worker_default as default
};
