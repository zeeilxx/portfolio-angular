const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/hp/.vscode/extensions/danielsanmedium.dscodegpt-3.24.84/standalone/node_modules/patchright-core');

const output = __dirname;
const origin = 'http://127.0.0.1:4301';
const report = { viewports: [], checks: [], errors: [] };

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: chromium.executablePath() });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.on('pageerror', (error) => report.errors.push(error.message));
  const home = async () => {
    await page.goto(origin, { waitUntil: 'networkidle' });
    await page.locator('#hero-title').waitFor();
    await page.waitForFunction(() => Number.parseFloat(document.documentElement.style.getPropertyValue('--header-height')) > 0);
    await page.waitForFunction(() => document.getAnimations().every((animation) => !Number.isFinite(animation.effect?.getComputedTiming().endTime) || animation.playState === 'finished'));
  };
  const layout = async () => page.evaluate(() => {
    const navbar = document.querySelector('app-navbar');
    const header = navbar.querySelector('header');
    const photo = document.querySelector('.portrait-frame');
    const rect = navbar.getBoundingClientRect();
    return {
      width: innerWidth,
      contentWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      headerHeight: header.getBoundingClientRect().height,
      navbarHeight: rect.height,
      navbarTop: rect.top,
      navbarPosition: getComputedStyle(navbar).position,
      anchorOffset: getComputedStyle(document.documentElement).scrollPaddingTop,
      heroColumns: getComputedStyle(document.querySelector('.hero')).gridTemplateColumns,
      portraitHeight: photo.getBoundingClientRect().height,
      mainOrbit: getComputedStyle(document.querySelector('.portrait-orbit-trace')).strokeDasharray,
      secondaryOrbit: getComputedStyle(document.querySelector('.portrait-orbit-trace-secondary')).strokeDasharray,
      links: Array.from(navbar.querySelectorAll('nav a'), (link) => {
        const box = link.getBoundingClientRect();
        return { text: link.textContent.trim(), width: box.width, left: box.left, right: box.right };
      }),
    };
  });

  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 800, height: 1000 }, { width: 390, height: 844 }, { width: 320, height: 780 }]) {
      await page.setViewportSize(viewport);
      await home();
      const state = await layout();
      report.viewports.push(state);
      assert.equal(state.navbarPosition, 'sticky');
      assert.equal(state.headerHeight, viewport.width > 760 ? 62 : 126);
      assert.ok(state.scrollWidth <= state.contentWidth + 1, `Horizontal overflow at ${viewport.width}: ${state.scrollWidth}/${state.contentWidth}`);
      assert.equal(state.links.length, 5);
      assert.ok(state.links.every((link) => link.width > 0 && link.left >= 0 && link.right <= state.contentWidth));
      assert.equal(state.mainOrbit, '14px, 86px');
      assert.equal(state.secondaryOrbit, '1px, 99px');
      await page.screenshot({ path: path.join(output, `home-${viewport.width}.png`) });

      await page.evaluate(() => scrollTo({ top: 1800, behavior: 'instant' }));
      await page.waitForFunction(() => scrollY > 1000);
      assert.ok(Math.abs((await layout()).navbarTop) < 1, `Navbar stopped sticking at ${viewport.width}`);
      await page.getByRole('link', { name: 'Education', exact: true }).click();
      await page.waitForFunction(() => {
        const top = document.querySelector('#about').getBoundingClientRect().top;
        const bottom = document.querySelector('app-navbar').getBoundingClientRect().bottom;
        return top >= bottom + 20 && top <= bottom + 28;
      });
    }
    report.checks.push('Navbar stays sticky and anchor headings stay visible at four viewport widths.');

    await page.setViewportSize({ width: 1440, height: 1000 });
    await home();
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.skip-link').evaluate((el) => el === document.activeElement), true);
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#main-content').evaluate((el) => el === document.activeElement), true);
    report.checks.push('Skip navigation works with the keyboard.');

    await page.getByRole('button', { name: 'View details for Dicicilaja.com', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.project-dialog').open);
    await page.locator('.project-dialog .gallery-arrow.next').click();
    await page.waitForFunction(() => document.querySelectorAll('.project-dialog .gallery-dot')[1]?.getAttribute('aria-pressed') === 'true');
    assert.equal(await page.locator('.project-dialog .gallery-dot').nth(1).getAttribute('aria-pressed'), 'true');
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('.project-dialog').open);
    report.checks.push('Shared project cards open the modal; gallery navigation and Escape work.');

    for (const route of ['/projects', '/contact']) {
      await page.goto(origin + route, { waitUntil: 'networkidle' });
      await page.locator('h1').waitFor();
      assert.ok(await page.locator('h1').isVisible());
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
      await page.screenshot({ path: path.join(output, route.slice(1) + '.png') });
    }
    report.checks.push('Projects and Contact render using their component styles.');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await home();
    const reduced = await page.evaluate(() => ({
      orbit: getComputedStyle(document.querySelector('.portrait-orbit-trace')).animationName,
      frame: getComputedStyle(document.querySelector('.hero-visual'), '::before').animationName,
      scrolling: getComputedStyle(document.documentElement).scrollBehavior,
    }));
    assert.deepEqual(reduced, { orbit: 'none', frame: 'none', scrolling: 'auto' });
    report.checks.push('Reduced motion disables portrait animations and smooth scrolling.');
    assert.deepEqual(report.errors, []);
    report.passed = true;
  } catch (error) {
    report.passed = false;
    report.failure = error.stack;
    await page.screenshot({ path: path.join(output, 'failure.png') }).catch(() => {});
    process.exitCode = 1;
  } finally {
    fs.writeFileSync(path.join(output, 'browser-report.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
