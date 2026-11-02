import { test, expect, type Page } from '@playwright/test';
import { readdirSync } from 'node:fs';
import { horizontalOverflow, seriousA11y, watch } from './helpers';

const LEGACY = readdirSync('src/legacy/scenes')
  .filter((f) => f.endsWith('.svg.html'))
  .map((f) => f.replace('.svg.html', ''))
  .sort();

/** Words a visitor can see before "More about this idea", leaving out the top bar, the idea
 * bar, the footer and the scene's own labels. */
async function glanceWords(page: Page): Promise<{ count: number; text: string }> {
  return page.evaluate(() => {
    const more = document.querySelector('details[data-more]');
    const skip = 'header.site, nav, footer, .lg-scene, .vh, .visually-hidden, script, style';
    const out: string[] = [];
    const walker = document.createTreeWalker(document.querySelector('main')!, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const el = n.parentElement;
      if (!el || el.closest(skip)) continue;
      if (more && !(more.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_PRECEDING)) {
        // Inside or after the disclosure: only its summary counts.
        if (!el.closest('summary')) continue;
      }
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.width < 2 || r.height < 2 || cs.visibility === 'hidden' || cs.display === 'none')
        continue;
      out.push(n.textContent || '');
    }
    const text = out.join(' ').replace(/\s+/g, ' ').trim();
    const count = (text.match(/[\p{L}\p{N}][\p{L}\p{N}’'.-]*/gu) || []).length;
    return { count, text };
  });
}

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`idea pages (${scheme})`, () => {
    test.use({ colorScheme: scheme });

    for (const id of LEGACY) {
      test(`${id}`, async ({ page }) => {
        const w = watch(page);
        await page.goto(`${id}/`);
        const main = page.locator('main');
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expect(main.locator('.oneline')).not.toBeEmpty();
        const block = page.locator('.lg-scene .scene-block');
        await block.locator('.seg button[data-set="today"]').click();
        await expect(block.locator('.beat-t')).toContainText('You already know');
        await expect(block.locator('.beat-t')).toBeVisible();
        await expect(main.locator('.askcard .for')).toContainText('For:');
        await expect(page.getByRole('button', { name: 'Copy link to this idea' })).toBeVisible();

        // The picture has a text equivalent.
        await expect(block.locator('p.vh')).toContainText('Today:');
        for (const svg of await block.locator('svg.sv').all())
          expect(await svg.getAttribute('aria-label')).toBeTruthy();

        // Depth sits behind one tap.
        const more = main.locator('details[data-more]');
        await expect(main.getByRole('heading', { level: 2, name: 'Sources' })).toBeHidden();
        await more.locator('summary').click();
        for (const h of ['How it works', 'Elsewhere', 'Sources'])
          await expect(main.getByRole('heading', { level: 2, name: h })).toBeVisible();

        // Every footnote points at an item in this page's numbered source list.
        const targets = await main
          .locator('sup.fn a')
          .evaluateAll((as) => as.map((a) => a.getAttribute('href')));
        for (const t of targets) await expect(page.locator(t!)).toHaveCount(1);

        // Screenshots load.
        for (const img of await main.locator('.shot img').all()) {
          await img.scrollIntoViewIfNeeded();
          await expect
            .poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth))
            .toBeGreaterThan(0);
        }

        // Today and Proposed, by hand.
        await block.locator('.seg button[data-set="proposed"]').click();
        await expect(block).toHaveAttribute('data-state', 'proposed');
        await block.locator('.seg button[data-set="today"]').click();
        await expect(block).toHaveAttribute('data-state', 'today');

        expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
        expect(await seriousA11y(page)).toEqual([]);

        // Walk me through it, stepped to the end, then closed.
        await page.getByRole('button', { name: 'Walk me through it' }).first().click();
        const dlg = page.locator('dialog.lg-story');
        await expect(dlg).toBeVisible();
        const next = dlg.locator('[data-st-next]');
        for (let i = 0; i < 12 && (await next.isVisible()); i++) await next.click();
        await expect(dlg.getByRole('heading', { name: 'End of the walkthrough' })).toBeVisible();
        // Let the 0.24 s slide-in finish, so axe measures colours at full opacity.
        await dlg
          .locator('.st-col')
          .evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
        expect(await seriousA11y(page)).toEqual([]);
        await dlg.getByRole('button', { name: 'Back to the idea' }).click();
        await expect(dlg).toBeHidden();

        // Previous and next.
        const nav = page.locator('nav.ideabar');
        await expect(nav.locator('a[rel="prev"], a[rel="next"]').first()).toBeVisible();
        w.expectClean();
      });
    }
  });
}

test.describe('glance budget', () => {
  for (const id of LEGACY) {
    test(`${id}: 60 words or fewer before More, scene on the first screen`, async ({
      page,
    }, info) => {
      test.skip(info.project.name !== 'phone', 'measured at 390 × 844');
      await page.goto(`${id}/`);
      const { count, text } = await glanceWords(page);
      expect(count, text).toBeLessThanOrEqual(60);
      const scene = page.locator('.lg-scene .scene-block .scene, .lg-scene .scene-block .qa-rows');
      const box = (await scene.first().boundingBox())!;
      expect(box.y).toBeLessThan(844 * 0.6);
      // Nothing but the title block sits between the top of the page and the scene.
      const between = await page.evaluate(() => {
        const head = document.querySelector('.idea-head')!.getBoundingClientRect().bottom;
        const sc = document.querySelector('.lg-scene')!.getBoundingClientRect().top;
        return sc - head;
      });
      expect(between).toBeLessThan(40);
    });
  }
});

test.describe('scene loop', () => {
  test('plays Today then Proposed on its own, and stops when the visitor takes over', async ({
    page,
  }) => {
    await page.goto('bump-speed/');
    const block = page.locator('.lg-scene .scene-block');
    await expect(block).toHaveAttribute('data-state', 'today');
    await expect(block).toHaveAttribute('data-state', 'proposed', { timeout: 5000 });
    const mb = block.locator('[data-motion-btn]');
    await expect(mb).toHaveText('Pause');
    await mb.click();
    await expect(mb).toHaveText('Play');
    await mb.click();
    await expect(mb).toHaveText('Pause');
    await block.locator('.seg button[data-set="today"]').click();
    await page.waitForTimeout(3500);
    await expect(block).toHaveAttribute('data-state', 'today');
  });

  test('a footnote opens More and jumps to its source', async ({ page }) => {
    await page.goto('alert-timing/#src-alert-timing-2');
    await expect(page.locator('details[data-more]')).toHaveAttribute('open', '');
    await expect(page.locator('#src-alert-timing-2')).toBeInViewport();
    await page.goto('alert-timing/');
    const more = page.locator('details[data-more]');
    await more.locator('summary').click();
    await more.locator('sup.fn a').first().click();
    const href = await more.locator('sup.fn a').first().getAttribute('href');
    await expect(page.locator(href!)).toBeInViewport();
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('shows the Proposed frame, still, with no loop', async ({ page }) => {
    await page.goto('notifications/');
    const block = page.locator('.lg-scene .scene-block');
    await expect(block).toHaveAttribute('data-state', 'proposed');
    await expect(block.locator('[data-motion-btn]')).toBeHidden();
    await page.waitForTimeout(3000);
    await expect(block).toHaveAttribute('data-state', 'proposed');
  });
});
