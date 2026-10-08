import https from 'https';

const baseUrl = 'https://kadoshaigames-glitch.github.io/catchup-deploy/';

const tests = [
  { path: '', expectedType: 'text/html' },
  { path: '404.html', expectedType: 'text/html' },
  { path: 'assets/branding/kadoshai-logo.png', expectedType: 'image/png' },
  { path: 'assets/awang/awang-v2-rigged-fixed.glb', expectedType: 'model/gltf-binary' },
  { path: 'assets/awang/awang-diffuse.png', expectedType: 'image/png' },
  { path: 'assets/audio/awang/module-1/welcome.mp3', expectedType: 'audio/mpeg' },
  { path: 'assets/audio/awang/module-2/intro.mp3', expectedType: 'audio/mpeg' },
  { path: 'assets/audio/awang/module-3/intro.mp3', expectedType: 'audio/mpeg' },
  { path: 'assets/audio/awang/module-4/intro.mp3', expectedType: 'audio/mpeg' },
  { path: 'assets/audio/awang/module-5/intro.mp3', expectedType: 'audio/mpeg' },
  { path: 'assets/audio/awang/module-6/intro.mp3', expectedType: 'audio/mpeg' },
  { path: 'assets/index-TaEkMfg0.css', expectedType: 'text/css' },
  { path: 'assets/index-DOWBmMrC.js', expectedType: 'application/javascript' }
];

async function checkUrl(testPath) {
  const url = baseUrl + testPath;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let dataLen = 0;
      res.on('data', chunk => dataLen += chunk.length);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          contentType: res.headers['content-type'],
          contentLength: res.headers['content-length'] || dataLen
        });
      });
    }).on('error', (err) => {
      resolve({ url, error: err.message });
    });
  });
}

console.log('=== VERIFYING LIVE GITHUB PAGES DEPLOYMENT ===');
let allPassed = true;

for (const t of tests) {
  const res = await checkUrl(t.path);
  if (res.error || res.status !== 200) {
    console.error(`FAIL: [${res.status || 'ERR'}] ${res.url} (Error: ${res.error || 'Non-200 status'})`);
    allPassed = false;
  } else {
    console.log(`PASS: [${res.status}] ${res.url} (${res.contentType}, ${res.contentLength} bytes)`);
  }
}

if (allPassed) {
  console.log('\nALL ASSETS & PAGES VERIFIED SUCCESSFULLY ON PRODUCTION!');
} else {
  process.exit(1);
}
