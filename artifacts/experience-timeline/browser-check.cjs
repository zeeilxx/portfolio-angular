const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/hp/.vscode/extensions/danielsanmedium.dscodegpt-3.24.84/standalone/node_modules/patchright-core');

(async () => {
  const report = { samples: [], errors: [] };
  const browser = await chromium.launch({ headless: true, executablePath: chromium.executablePath() });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  page.on('pageerror', (error) => report.errors.push(error.message));
  const load = async () => {
    await page.goto('http://127.0.0.1:4301/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => parseFloat(document.querySelector('.experience-timeline')?.style.getPropertyValue('--timeline-length')) > 0);
  };
  const metrics = () => page.evaluate(() => {
    const root = document.querySelector('.experience-timeline');
    const line = root.querySelector('.experience-track').getBoundingClientRect();
    const fill = root.querySelector('.experience-progress').getBoundingClientRect();
    const entries = Array.from(root.querySelectorAll('.experience-entry'), (entry) => {
      const box = entry.getBoundingClientRect();
      const dot = entry.querySelector('.experience-dot');
      const point = dot.getBoundingClientRect();
      const body = entry.querySelector('.experience-body').getBoundingClientRect();
      return { midpoint: (box.top + box.bottom) / 2, dotCenter: (point.top + point.bottom) / 2, dotX: (point.left + point.right) / 2, bodyLeft: body.left, reached: dot.hasAttribute('data-reached') };
    });
    return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, top: line.top, bottom: line.bottom, x: (line.left + line.right) / 2, height: line.height, progress: parseFloat(root.style.getPropertyValue('--timeline-progress')), filled: fill.height / line.height, entries };
  });
  const checkGeometry = (state) => {
    assert.equal(state.entries.length, 2);
    assert.ok(Math.abs(state.top - state.entries[0].dotCenter) <= 1);
    assert.ok(Math.abs(state.bottom - state.entries[1].dotCenter) <= 1);
    assert.ok(state.scrollWidth <= state.width);
    for (const entry of state.entries) {
      assert.ok(Math.abs(entry.dotCenter - entry.midpoint) <= 1);
      assert.ok(Math.abs(entry.dotX - state.x) <= 1);
      assert.ok(entry.bodyLeft > state.x + 20);
    }
  };
  const scrollToProgress = async (fraction) => {
    await page.evaluate((value) => {
      const root = document.querySelector('.experience-timeline');
      const start = parseFloat(root.style.getPropertyValue('--timeline-start'));
      const length = parseFloat(root.style.getPropertyValue('--timeline-length'));
      const header = parseFloat(document.documentElement.style.getPropertyValue('--header-height')) || 0;
      const focus = header + (innerHeight - header) / 2;
      scrollTo({ top: scrollY + root.getBoundingClientRect().top + start + value * length - focus, behavior: 'instant' });
    }, fraction);
    const expected = Math.min(1, Math.max(0, fraction));
    await page.waitForFunction((value) => Math.abs(parseFloat(document.querySelector('.experience-timeline').style.getPropertyValue('--timeline-progress')) - value) < 0.01, expected);
    const state = await metrics();
    report.current = state;
    checkGeometry(state);
    assert.ok(Math.abs(state.filled - expected) < 0.01);
    report.samples.push(state);
    return state;
  };
  try {
    await load();
    for (const size of [{ width: 1440, height: 1100 }, { width: 800, height: 1000 }, { width: 390, height: 844 }, { width: 320, height: 780 }]) {
      await page.setViewportSize(size);
      await page.waitForFunction(() => {
        const root = document.querySelector('.experience-timeline');
        const dots = Array.from(root.querySelectorAll('.experience-dot'), (dot) => dot.getBoundingClientRect());
        const expected = dots[1].top + dots[1].height / 2 - dots[0].top - dots[0].height / 2;
        return Math.abs(parseFloat(root.style.getPropertyValue('--timeline-length')) - expected) < 1;
      });
      let state = await scrollToProgress(-0.1);
      assert.ok(state.entries.every((entry) => !entry.reached));
      state = await scrollToProgress(0.25);
      assert.equal(state.entries[0].reached, true);
      assert.equal(state.entries[1].reached, false);
      await scrollToProgress(0.5);
      await page.waitForFunction(() => document.getAnimations().every((animation) => !Number.isFinite(animation.effect?.getComputedTiming().endTime) || animation.playState === 'finished'));
      await page.screenshot({ path: path.join(__dirname, `timeline-${size.width}.png`) });
      state = await scrollToProgress(1.1);
      assert.ok(state.entries.every((entry) => entry.reached));
      await scrollToProgress(0.35);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => document.querySelector('.experience-timeline').style.getPropertyValue('--timeline-progress') === '1.0000');
    const reduced = await metrics();
    assert.equal(reduced.filled, 1);
    assert.ok(reduced.entries.every((entry) => entry.reached));
    report.reducedMotion = reduced;
    await page.goto('http://127.0.0.1:4301/projects', { waitUntil: 'networkidle' });
    await load();
    checkGeometry(await metrics());
    assert.deepEqual(report.errors, []);
    report.passed = true;
  } catch (error) {
    report.passed = false;
    report.failure = error.stack;
    await page.screenshot({ path: path.join(__dirname, 'failure.png') }).catch(() => {});
    process.exitCode = 1;
  } finally {
    fs.writeFileSync(path.join(__dirname, 'browser-report.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ passed: report.passed, samples: report.samples.length, errors: report.errors, failure: report.failure, current: report.current }, null, 2));
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
