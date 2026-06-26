const { chromium } = require('playwright');
const path = require('path');
const base = __dirname;

(async function run() {
  const browser = await chromium.launch();
  const names = ['01-mcp-pipeline', '02-mcp-vs-skill', '03-three-layer-framework'];
  
  for (const name of names) {
    const page = await browser.newPage({ 
      viewport: { width: 1200, height: 675 }, 
      deviceScaleFactor: 2 
    });
    const filePath = path.join(base, name + '.html');
    await page.goto('file:///' + filePath.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(base, name + '.png'), fullPage: true });
    console.log(name + ': done');
    await page.close();
  }
  
  await browser.close();
  console.log('All 3 screenshots completed');
})().catch(e => { console.error(e); process.exit(1); });
