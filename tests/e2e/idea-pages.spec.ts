import { test, expect } from '@playwright/test';
import { readdirSync } from 'node:fs';
import { horizontalOverflow, seriousA11y, watch } from './helpers';

const LEGACY = readdirSync('src/legacy/scenes')
  .filter((f) => f.endsWith('.svg.html'))
  .map((f) => f.replace('.svg.html', ''))
  .sort();

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
        await expect(main.getByText('You already know', { exact: true })).toBeVisible();
        await expect(main.locator('.idea-head .for')).toContainText('For:');
        for (const h of ['How it works', 'Elsewhere', 'The ask', 'Sources'])
          await expect(main.getByRole('heading', { level: 2, name: h })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Copy link to this idea' })).toBeVisible();

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

        // Today and Proposed.
        const block = page.locator('.lg-scene .scene-block');
        await expect(block).toHaveAttribute('data-state', 'today');
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
