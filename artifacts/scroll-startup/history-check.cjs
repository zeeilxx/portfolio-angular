const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/hp/.vscode/extensions/danielsanmedium.dscodegpt-3.24.84/standalone/node_modules/patchright-core');

(async () => {
  const report = { cases: [], errors: [] };
  const browser = await chromium.launch({ headless: true, executablePath: chromium.executablePath() });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => {
    const events = [];
    const record = (kind, detail) => {
      events.push({ kind, y: scrollY, hash: location.hash, detail, time: performance.now() });
      document.documentElement?.setAttribute('data-qa-navigation', JSON.stringify(events.slice(-60)));
    };
    const scroll = window.scrollTo.bind(window);
    window.scrollTo = (...args) => { record('scrollTo', args); return scroll(...args); };
    addEventListener('popstate', (event) => record('popstate', event.state));
    addEventListener('hashchange', () => record('hashchange'));
    addEventListener('scroll', () => record('scroll'));
  });
  page.on('pageerror', (error) => report.errors.push(error.message));
  const ready = async () => {
    await page.waitForFunction(() => document.querySelector('.education-grid')?.dataset.motionGroup === 'education');
    await page.waitForLoadState('networkidle');
  };
  const position = () => page.evaluate(() => scrollY);
  const settleAt = async (y) => page.waitForFunction((value) => Math.abs(scrollY - value) < 2, y);
  const anchorVisible = async (id) => page.waitForFunction((value) => {
    const top = document.getElementById(value).getBoundingClientRect().top;
    const bottom = document.querySelector('app-navbar').getBoundingClientRect().bottom;
    return Math.abs(top - bottom - 24) < 1;
  }, id);
  const clickNav = async (name) => {
    const box = await page.getByRole('link', { name, exact: true }).boundingBox();
    assert.ok(box && box.y >= 0 && box.y + box.height <= (await page.viewportSize()).height);
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  };

  try {
    for (const size of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(size);
      await page.goto('http://127.0.0.1:4302/', { waitUntil: 'networkidle' });
      await ready();
      await page.mouse.move(size.width / 2, size.height / 2);
      await page.mouse.wheel(0, 1350);
      await page.waitForFunction(() => scrollY > 1200);
      const beforeReload = await position();
      await page.reload({ waitUntil: 'networkidle' });
      await ready();
      await settleAt(beforeReload);
      report.cases.push({ type: 'refresh-restores-position', size, before: beforeReload, after: await position() });

      let release;
      const gate = new Promise((resolve) => { release = resolve; });
      await page.route('**/main*.js', async (route) => { await gate; await route.continue(); });
      await page.reload({ waitUntil: 'commit' });
      await page.locator('#hero-title').waitFor();
      const beforeWheel = await position();
      await page.mouse.wheel(0, 620);
      await page.waitForFunction((y) => scrollY > y + 500, beforeWheel);
      const userPosition = await position();
      release();
      await ready();
      await settleAt(userPosition);
      report.cases.push({ type: 'early-scroll-after-refresh', size, before: userPosition, after: await position() });
      await page.unroute('**/main*.js');

      await clickNav('Education');
      await anchorVisible('about');
      const education = await position();
      await clickNav('Work');
      await anchorVisible('work');
      const work = await position();
      report.historyExpected = { education, work };
      await page.goBack();
      await settleAt(education);
      await page.goForward();
      await settleAt(work);
      report.cases.push({ type: 'anchors-and-history', size, education, work });

      // A refreshed fragment must not pull the user back after they start scrolling.
      let releaseFragment;
      const fragmentGate = new Promise((resolve) => { releaseFragment = resolve; });
      await page.route('**/main*.js', async (route) => { await fragmentGate; await route.continue(); });
      await page.reload({ waitUntil: 'commit' });
      await page.locator('#work').waitFor();
      const fragmentBeforeWheel = await position();
      await page.mouse.wheel(0, 420);
      await page.waitForFunction((y) => scrollY > y + 300, fragmentBeforeWheel);
      const fragmentPosition = await position();
      releaseFragment();
      await ready();
      await settleAt(fragmentPosition);
      report.cases.push({ type: 'early-scroll-after-fragment-refresh', size, before: fragmentPosition, after: await position() });
      await page.unroute('**/main*.js');

      await clickNav('Portfolio, home');
      await settleAt(0);
    }

    await page.goto('http://127.0.0.1:4302/projects', { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: 'Back to Home' }).click();
    await ready();
    await settleAt(0);
    report.cases.push('Selecting a different route starts it at the top.');
    assert.deepEqual(report.errors, []);
    report.passed = true;
  } catch (error) {
    report.passed = false;
    report.failure = error.stack;
    report.actual = await page.evaluate(() => ({ y: scrollY, url: location.href, restoration: history.scrollRestoration, events: JSON.parse(document.documentElement.getAttribute('data-qa-navigation') || '[]') }));
    process.exitCode = 1;
    await page.screenshot({ path: path.join(__dirname, 'history-failure.png') }).catch(() => {});
  } finally {
    fs.writeFileSync(path.join(__dirname, 'history-report.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
