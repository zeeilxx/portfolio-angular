const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/hp/.vscode/extensions/danielsanmedium.dscodegpt-3.24.84/standalone/node_modules/patchright-core');

(async () => {
  const report = { samples: [], errors: [] };
  const browser = await chromium.launch({ headless: true, executablePath: chromium.executablePath() });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  page.on('pageerror', (error) => report.errors.push(error.message));
  const read = () => page.evaluate(() => {
    const trace = document.querySelector('.portrait-orbit-trace');
    const style = getComputedStyle(trace);
    return {
      width: innerWidth,
      animation: style.animationName,
      duration: style.animationDuration,
      offset: parseFloat(style.strokeDashoffset),
      state: trace.getAnimations().map((animation) => animation.playState),
      frameAnimation: getComputedStyle(document.querySelector('.hero-visual'), '::before').animationName,
    };
  });
  const moving = async () => {
    const before = await read();
    assert.notEqual(before.animation, 'none');
    assert.ok(before.state.includes('running'));
    assert.notEqual(before.frameAnimation, 'none');
    await page.waitForFunction((offset) => Math.abs(parseFloat(getComputedStyle(document.querySelector('.portrait-orbit-trace')).strokeDashoffset) - offset) > 2, before.offset);
    const after = await read();
    report.samples.push({ before, after });
  };
  try {
    await page.goto('http://127.0.0.1:4301/', { waitUntil: 'networkidle' });
    await page.locator('.portrait-orbit').waitFor();
    if (process.argv.includes('--baseline')) {
      report.baseline = await read();
      assert.equal(report.baseline.animation, 'none');
    } else {
      for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
        await page.setViewportSize(viewport);
        await page.locator('.hero-visual').scrollIntoViewIfNeeded();
        await moving();
        await page.locator('.hero-visual').screenshot({ path: path.join(__dirname, `portrait-${viewport.width}.png`) });
      }
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const reduced = await read();
      assert.equal(reduced.animation, 'none');
      assert.equal(reduced.frameAnimation, 'none');
      report.reduced = reduced;
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await moving();
      await page.locator('#experience').scrollIntoViewIfNeeded();
      await page.locator('.hero-visual').scrollIntoViewIfNeeded();
      await moving();
      assert.deepEqual(report.errors, []);
    }
    report.passed = true;
  } catch (error) {
    report.failure = error.stack;
    report.passed = false;
    process.exitCode = 1;
  } finally {
    const name = process.argv.includes('--baseline') ? 'baseline.json' : 'browser-report.json';
    fs.writeFileSync(path.join(__dirname, name), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
