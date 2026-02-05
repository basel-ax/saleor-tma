<?php
/**
 * Telegram Mini App - TypeScript with React Frontend
 * 
 * This file serves the TypeScript/React frontend.
 * The actual frontend is built to dist/public/ by Vite.
 */

// For PHP server compatibility, serve the static HTML
$htmlFile = __DIR__ . '/../dist/public/index.html';

if (file_exists($htmlFile)) {
    // Set proper content type
    header('Content-Type: text/html; charset=utf-8');
    
    // Read and output the HTML
    readfile($htmlFile);
    exit;
}

// Fallback if build doesn't exist
header('HTTP/1.1 503 Service Unavailable');
echo "Frontend not built. Run 'npm run build' first.";
exit;
