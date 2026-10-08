import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir) || !fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('[Error] dist/index.html not found. Please run npm run build first.');
  process.exit(1);
}

// Ensure .nojekyll exists
fs.writeFileSync(path.join(distDir, '.nojekyll'), '# Disable Jekyll\n', 'utf8');

// Ensure 404.html exists
if (fs.existsSync('public/404.html') && !fs.existsSync(path.join(distDir, '404.html'))) {
  fs.copyFileSync('public/404.html', path.join(distDir, '404.html'));
}

console.log('[1/4] Preparing git repository in dist/ ...');
const runInDist = (cmd) => {
  execSync(cmd, { cwd: distDir, stdio: 'inherit' });
};

// Check if dist already has .git
if (!fs.existsSync(path.join(distDir, '.git'))) {
  runInDist('git init');
  runInDist('git branch -M main');
  runInDist('git remote add origin https://github.com/kadoshaigames-glitch/catchup-deploy.git');
} else {
  try {
    runInDist('git remote set-url origin https://github.com/kadoshaigames-glitch/catchup-deploy.git');
  } catch {
    runInDist('git remote add origin https://github.com/kadoshaigames-glitch/catchup-deploy.git');
  }
}

// Ensure git identity in dist
runInDist('git config user.name "kadoshaigames-glitch"');
runInDist('git config user.email "kadoshaigames-glitch@users.noreply.github.com"');

console.log('[2/4] Staging production build assets ...');
runInDist('git add -A');

console.log('[3/4] Creating deployment commit ...');
const timestamp = new Date().toISOString();
try {
  runInDist(`git commit -m "Deploy Catchup production build: ${timestamp}"`);
} catch (e) {
  console.log('No new changes to commit in dist.');
}

console.log('[4/4] Pushing to kadoshaigames-glitch/catchup-deploy (main) ...');
runInDist('git push -u origin main --force');

console.log('\n[Success] Pushed production build to https://github.com/kadoshaigames-glitch/catchup-deploy');
