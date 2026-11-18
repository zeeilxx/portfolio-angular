const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/hp/.vscode/extensions/danielsanmedium.dscodegpt-3.24.84/standalone/node_modules/patchright-core');

(async () => {
  const baseline = process.argv.includes('--baseline');
  const report = { cases: [], errors: [] };
  const browser = await chromium.launch({ headless: true, executablePath: chromium.executablePath() });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    const calls = [];
    const hidden = new Set();
    const scroll = window.scrollTo.bind(window);
    window.scrollTo = (...args) => {
      calls.push({ y: scrollY, args, time: performance.now(), stack: new Error().stack?.split('\n').slice(1, 5) });
      document.documentElement?.setAttribute('data-qa-scroll-calls', JSON.stringify(calls));
      return scroll(...args);
    };
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        const target = record.target;
        if (!(target instanceof HTMLElement) || target.style.opacity !== '0') continue;
        const box = target.getBoundingClientRect();
        if (box.top < innerHeight && box.bottom > 100) hidden.add(target.textContent.trim().slice(0, 80));
      }
      document.documentElement?.setAttribute('data-qa-hidden-content', JSON.stringify(Array.from(hidden)));
    });
    observer.observe(document, { attributes: true, attributeFilter: ['style'], subtree: true });
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => report.errors.push(error.message));

  try {
    for (const size of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(size);
      let release;
      const gate = new Promise((resolve) => { release = resolve; });
      await page.route('**/main*.js', async (route) => { await gate; await route.continue(); });
      await page.goto('http://127.0.0.1:4302/', { waitUntil: 'commit' });
      await page.locator('#hero-title').waitFor();
      await page.mouse.move(size.width / 2, size.height / 2);
      await page.mouse.wheel(0, 620);
      await page.waitForFunction(() => scrollY > 500);
      const before = await page.evaluate(() => scrollY);
      release();
      await page.waitForFunction(() => document.querySelector('.education-grid')?.dataset.motionGroup === 'education');
      await page.waitForLoadState('networkidle');
      await page.waitForFunction(() => document.getAnimations().every((animation) => !Number.isFinite(animation.effect?.getComputedTiming().endTime) || animation.playState === 'finished'));
      const after = await page.evaluate(() => ({
        y: scrollY,
        calls: JSON.parse(document.documentElement.getAttribute('data-qa-scroll-calls') || '[]'),
        hidden: JSON.parse(document.documentElement.getAttribute('data-qa-hidden-content') || '[]'),
      }));
      report.cases.push({ size, before, after });
      if (!baseline) {
        assert.ok(Math.abs(after.y - before) < 2, `Hydration moved scroll from ${before} to ${after.y}`);
        assert.equal(after.calls.length, 0, 'Initial navigation should not override a user scroll.');
        assert.equal(after.hidden.length, 0, 'Hydration hid content already inside the viewport.');
      }
      await page.unroute('**/main*.js');
    }
    assert.deepEqual(report.errors, []);
    report.passed = true;
  } catch (error) {
    report.passed = false;
    report.failure = error.stack;
    process.exitCode = 1;
  } finally {
    fs.writeFileSync(path.join(__dirname, baseline ? 'baseline.json' : 'browser-report.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
