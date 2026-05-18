#!/usr/bin/env bun
const PORT = process.env.PORT || 3000;
const dir = import.meta.dir;

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
};

const ISOLATION_HEADERS = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
};

function mimeType(path) {
  const ext = path.slice(path.lastIndexOf('.'));
  return MIME[ext] || 'application/octet-stream';
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;
    if (path === '/') path = '/index.html';

    const filePath = dir + path;
    const file = Bun.file(filePath);
    const exists = await file.exists();

    if (!exists) {
      return new Response('Not Found', { status: 404 });
    }

    const headers = {
      'Content-Type': mimeType(path),
      ...ISOLATION_HEADERS,
    };

    const ext = path.slice(path.lastIndexOf('.'));
    if (ext === '.wasm') {
      return new Response(file, {
        headers: { ...headers, 'Content-Type': 'application/wasm', 'Cross-Origin-Embedder-Policy': 'require-corp' },
      });
    }

    return new Response(file, { headers });
  },
});

console.log(`\n  Zrow dev server running → http://localhost:${PORT}`);
console.log(`  COOP/COEP headers enabled for SQLocal support\n`);
