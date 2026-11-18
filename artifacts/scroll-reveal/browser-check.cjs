const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/hp/.vscode/extensions/danielsanmedium.dscodegpt-3.24.84/standalone/node_modules/patchright-core');

(async () => {
  const report = { cases: [], errors: [] };
  const browser = await chromium.launch({ headless: true, executablePath: chromium.executablePath() });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  await context.addInitScript(() => {
    window.revealEvents = [];
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      if (this.hasAttribute('data-motion-state')) {
        const owner = this.closest('[data-motion-group]');
        window.revealEvents.push({
          group: owner?.getAttribute('data-motion-group'),
          entry: this.closest('.experience-entry')?.getAttribute('aria-labelledby'),
          order: Number(this.getAttribute('data-motion-order')),
          text: this.textContent.trim().slice(0, 70),
          time: performance.now(),
          delay: options.delay,
          top: this.getBoundingClientRect().top,
          height: innerHeight,
        });
        document.documentElement.setAttribute('data-qa-reveals', JSON.stringify(window.revealEvents));
      }
      return animate.call(this, frames, options);
    };
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => report.errors.push(error.message));
  const gotoHome = async () => {
    await page.goto('http://127.0.0.1:4302/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.querySelector('.education-grid')?.dataset.motionGroup === 'education');
  };
  const scrollNear = async (selector, index = 0) => {
    await page.evaluate(({ selector, index }) => {
      const target = document.querySelectorAll(selector)[index];
      scrollTo({ top: scrollY + target.getBoundingClientRect().top - 180, behavior: 'instant' });
    }, { selector, index });
  };
  const waitSettled = () => page.waitForFunction(() => document.getAnimations().every((animation) => !Number.isFinite(animation.effect?.getComputedTiming().endTime) || animation.playState === 'finished'));

  try {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await gotoHome();
      const initial = await page.evaluate(() => ({
        education: Array.from(document.querySelectorAll('.education-grid [data-motion-state]'), (element) => element.dataset.motionState),
        experience: Array.from(document.querySelectorAll('.experience-entry [data-motion-state]'), (element) => element.dataset.motionState),
      }));
      assert.ok(initial.education.length >= 8);
      assert.ok(initial.education.every((state) => state === 'pending'));
      assert.ok(initial.experience.every((state) => state === 'pending'));

      await scrollNear('.education-grid');
      await page.waitForFunction(() => JSON.parse(document.documentElement.getAttribute('data-qa-reveals') || '[]').filter((event) => event.group === 'education').length >= 3);
      const education = await page.evaluate(() => JSON.parse(document.documentElement.getAttribute('data-qa-reveals') || '[]').filter((event) => event.group === 'education'));
      await page.waitForFunction(() => parseFloat(getComputedStyle(document.querySelector('.education-grid [data-motion-order="0"]')).opacity) > 0.15);
      const opacitySamples = await page.evaluate(() => Array.from(document.querySelectorAll('.education-grid [data-motion-state]'), (element) => Number(getComputedStyle(element).opacity)));
      assert.ok(opacitySamples[0] > opacitySamples[opacitySamples.length - 1]);
      for (let i = 1; i < education.length; i++) {
        assert.ok(education[i].time + education[i].delay >= education[i - 1].time + education[i - 1].delay - 2);
      }
      assert.ok(new Set(education.map((event) => event.delay)).size > 1);
      await waitSettled();
      assert.ok(await page.locator('.education-grid h2').evaluate((element) => getComputedStyle(element).opacity === '1' && element.style.opacity === '' && element.style.translate === ''));
      await page.screenshot({ path: path.join(__dirname, `education-${viewport.width}.png`) });

      const educationCount = education.length;
      await scrollNear('.hero');
      await scrollNear('.education-grid');
      await waitSettled();
      assert.equal(await page.evaluate(() => JSON.parse(document.documentElement.getAttribute('data-qa-reveals') || '[]').filter((event) => event.group === 'education').length), educationCount);

      await scrollNear('.experience-entry .experience-title-row', 0);
      await page.waitForFunction(() => JSON.parse(document.documentElement.getAttribute('data-qa-reveals') || '[]').filter((event) => event.entry === 'adira-finance-title').length >= 3);
      const first = await page.evaluate(() => ({
        events: JSON.parse(document.documentElement.getAttribute('data-qa-reveals') || '[]').filter((event) => event.entry === 'adira-finance-title'),
        secondEvents: JSON.parse(document.documentElement.getAttribute('data-qa-reveals') || '[]').filter((event) => event.entry === 'dicicilaja-title'),
        secondStates: Array.from(document.querySelectorAll('.experience-entry')[1].querySelectorAll('[data-motion-state]'), (element) => element.dataset.motionState),
        docsStates: Array.from(document.querySelectorAll('.experience-entry')[0].querySelectorAll('.evidence-grid > *'), (element) => element.dataset.motionState),
      }));
      assert.equal(first.secondEvents.length, 0);
      assert.ok(first.secondStates.every((state) => state === 'pending'));
      assert.ok(first.events.every((event) => event.top < event.height - 60));
      if (viewport.width < 760) assert.ok(first.docsStates.every((state) => state === 'pending'));
      await waitSettled();

      await scrollNear('.experience-entry .evidence-grid', 0);
      await page.waitForFunction(() => Array.from(document.querySelectorAll('.experience-entry')[0].querySelectorAll('.evidence-grid > *')).every((element) => element.dataset.motionState !== 'pending'));
      await waitSettled();
      assert.ok(await page.locator('.experience-entry').first().locator('.evidence-grid > *').evaluateAll((elements) => elements.every((element) => element.dataset.motionState === 'visible')));

      await scrollNear('.experience-entry .experience-title-row', 1);
      await page.waitForFunction(() => JSON.parse(document.documentElement.getAttribute('data-qa-reveals') || '[]').some((event) => event.entry === 'dicicilaja-title'));
      await waitSettled();
      const second = await page.evaluate(() => JSON.parse(document.documentElement.getAttribute('data-qa-reveals') || '[]').filter((event) => event.entry === 'dicicilaja-title'));
      assert.ok(second.every((event) => event.top < event.height - 60));
      assert.ok(second[0].time > first.events[0].time);
      await page.screenshot({ path: path.join(__dirname, `experience-${viewport.width}.png`) });

      await page.locator('.contact-email').first().focus();
      assert.equal(await page.locator('.contact-email').first().evaluate((element) => getComputedStyle(element).opacity), '1');
      report.cases.push({ viewport, education: education.map(({ text, order, delay }) => ({ text, order, delay })), opacitySamples, firstEntry: first.events.length, secondEntry: second.length, deferredDocs: first.docsStates });
    }

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => Array.from(document.querySelectorAll('[data-motion-state]')).every((element) => element.dataset.motionState === 'visible'));
    assert.ok(await page.evaluate(() => Array.from(document.querySelectorAll('[data-motion-state]')).every((element) => element.style.opacity === '' && element.style.translate === '')));
    report.cases.push('Changing to reduced motion reveals all pending content immediately.');
    await gotoHome();
    assert.ok(await page.evaluate(() => Array.from(document.querySelectorAll('[data-motion-state]')).every((element) => element.dataset.motionState === 'visible')));
    report.cases.push('Initial reduced motion leaves the entire page visible.');

    for (const route of ['/projects', '/contact', '/']) {
      await page.goto('http://127.0.0.1:4302' + route, { waitUntil: 'networkidle' });
      assert.ok(await page.locator('h1').isVisible());
    }
    const noJS = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await noJS.newPage();
    await staticPage.goto('http://127.0.0.1:4302/', { waitUntil: 'networkidle' });
    assert.ok(await staticPage.locator('#about h2').isVisible());
    assert.ok(await staticPage.locator('.experience-entry').first().isVisible());
    await noJS.close();
    report.cases.push('Routes and server-rendered content without JavaScript remain readable.');
    assert.deepEqual(report.errors, []);
    report.passed = true;
  } catch (error) {
    report.passed = false;
    report.failure = error.stack;
    await page.screenshot({ path: path.join(__dirname, 'failure.png') }).catch(() => {});
    process.exitCode = 1;
  } finally {
    fs.writeFileSync(path.join(__dirname, 'browser-report.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
