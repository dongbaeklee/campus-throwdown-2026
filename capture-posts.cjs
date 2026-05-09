const puppeteer = require('puppeteer');
const path = require('path');

const posts = [
  { selector: '.post-1', filename: 'post1-open.png', label: 'Post 1 오픈공지' },
  { selector: '.post-2', filename: 'post2-category.png', label: 'Post 2 부문소개' },
  { selector: '.post-3', filename: 'post3-deadline.png', label: 'Post 3 마감D-30' },
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 2400, deviceScaleFactor: 2 });

  const filePath = 'file://' + path.resolve('instagram-posts.html');
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // wait for fonts
  await new Promise(r => setTimeout(r, 1500));

  for (const post of posts) {
    const el = await page.$(post.selector);
    if (!el) { console.log('not found:', post.selector); continue; }
    await el.screenshot({
      path: 'instagram/' + post.filename,
      type: 'png',
    });
    console.log('✓', post.label, '→ instagram/' + post.filename);
  }

  await browser.close();
  console.log('\n완료! instagram/ 폴더에 저장됐습니다.');
})();
