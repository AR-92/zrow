import { cpSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as esbuild from 'esbuild';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const docs = join(root, 'docs');

rmSync(docs, { recursive: true, force: true });
mkdirSync(join(docs, 'dist'), { recursive: true });

// Bundle JS with esbuild — no more docs/src/ or docs/lib/
await esbuild.build({
  entryPoints: [join(root, 'src', 'main.js')],
  bundle: true,
  minify: true,
  outfile: join(docs, 'dist', 'app.js'),
  format: 'esm',
  alias: { 'ztore': join(root, 'ztore.js') },
  platform: 'browser',
  target: 'es2020',
  mainFields: ['module', 'browser', 'main'],
});

// HTML — strip importmap, point to bundled JS
let html = readFileSync(join(root, 'index.html'), 'utf-8');
html = html.replace(
  /<script type="importmap">[\s\S]*?<\/script>\n?/,
  ''
);
html = html.replace('src/main.js', 'dist/app.js');
writeFileSync(join(docs, 'index.html'), html);

// Vendor — only the WASM build
const vendorDst = join(docs, 'dist', 'vendor');
mkdirSync(vendorDst, { recursive: true });
cpSync(join(root, 'node_modules', 'sql.js', 'dist', 'sql-wasm.js'), join(vendorDst, 'sql-wasm.js'));
cpSync(join(root, 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm'), join(vendorDst, 'sql-wasm.wasm'));

// Built CSS
cpSync(join(root, 'dist', 'styles.css'), join(docs, 'dist', 'styles.css'));

console.log('docs/ built successfully');
