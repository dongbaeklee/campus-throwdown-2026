const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 3000, deviceScaleFactor: 2 });

  const file = 'file://' + path.resolve(__dirname, 'cards/series1-intro.html');
  await page.goto(file, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1800));

  const cards = [
    { id: 'card1', file: 'cards/s1-c1-cover.png' },
    { id: 'card2', file: 'cards/s1-c2-what.png' },
    { id: 'card3', file: 'cards/s1-c3-numbers.png' },
    { id: 'card4', file: 'cards/s1-c4-howto.png' },
  ];

  for (const c of cards) {
    const el = await page.$('#' + c.id);
    await el.screenshot({ path: path.resolve(__dirname, c.file), type: 'png' });
    console.log('✓', c.file);
  }

  await browser.close();
  console.log('\n카드뉴스 4장 완료!');
})();
