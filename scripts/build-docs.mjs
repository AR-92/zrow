import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import * as esbuild from 'esbuild';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const docs = join(root, 'docs');

rmSync(docs, { recursive: true, force: true });
mkdirSync(join(docs, 'dist'), { recursive: true });

// 1. Tailwind directly into docs/dist/
const tw = join(root, 'node_modules', '.bin', 'tailwindcss');
execSync(
  `"${tw}" -i "${join(root, 'src', 'styles.css')}" -o "${join(docs, 'dist', 'styles.css')}" --minify`,
  { stdio: 'inherit', cwd: root }
);

// 2. esbuild bundle directly into docs/dist/
await esbuild.build({
  entryPoints: [join(root, 'src', 'main.js')],
  bundle: true,
  minify: true,
  outfile: join(docs, 'dist', 'app.js'),
  format: 'esm',
  alias: { 'ztore': join(root, 'ztore.js') },
  platform: 'browser',
  target: 'es2020',
});

// 3. HTML — strip importmap, point to bundle
let html = readFileSync(join(root, 'index.html'), 'utf-8');
html = html.replace(/<script type="importmap">[\s\S]*?<\/script>\n?/, '');
html = html.replace('src/main.js', 'dist/app.js');
writeFileSync(join(docs, 'index.html'), html);

// 4. Vendor — sql.js WASM
const vendorDst = join(docs, 'dist', 'vendor');
mkdirSync(vendorDst, { recursive: true });
cpSync(join(root, 'node_modules', 'sql.js', 'dist', 'sql-wasm.js'), join(vendorDst, 'sql-wasm.js'));
cpSync(join(root, 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm'), join(vendorDst, 'sql-wasm.wasm'));

console.log('docs/ built successfully');
