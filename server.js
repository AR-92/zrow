#!/usr/bin/env bun
const PORT = process.env.PORT || 3000;
const root = import.meta.dir;

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
};

function mimeType(path) {
  const ext = path.slice(path.lastIndexOf('.'));
  return MIME[ext] || 'application/octet-stream';
}

function serve(file, headers) {
  return new Response(file, { headers });
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;
    if (path === '/') path = '/index.html';

    // Try docs/ first (built assets), then root (source modules)
    const locations = [root + '/docs' + path, root + path];

    for (const filePath of locations) {
      const file = Bun.file(filePath);
      if (await file.exists()) {
        const headers = {
          'Content-Type': mimeType(path),
          'Cross-Origin-Opener-Policy': 'same-origin',
          'Cross-Origin-Embedder-Policy': 'require-corp',
        };
        const ext = path.slice(path.lastIndexOf('.'));
        if (ext === '.wasm') {
          headers['Content-Type'] = 'application/wasm';
        }
        return serve(file, headers);
      }
    }

    return new Response('Not Found', { status: 404 });
  },
});

console.log(`\n  Zrow dev server → http://localhost:${PORT}\n`);
