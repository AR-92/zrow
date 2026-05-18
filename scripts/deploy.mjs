import { execSync } from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const msg = process.argv[2]?.trim();
if (!msg) {
  console.error('Usage: npm run deploy -- "commit message"');
  process.exit(1);
}

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const run = (cmd) => execSync(cmd, { stdio: 'inherit', cwd: root });

run('npm run build');
run('git add -A');
run(`git commit -m "${msg.replace(/"/g, '\\"')}"`);
run('git push');

console.log('\nDeployed.');
