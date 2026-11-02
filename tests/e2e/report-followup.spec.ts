import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGE = 'report-followup/';

/** Clicks a choice on the phone screen, or the narrator button with that label. */
async function choose(page: Page, choice: string, label?: string) {
  const onScreen = page.locator(`[data-screen]:not([hidden]) [data-choice="${choice}"]`).first();
  if (await onScreen.count()) {
    await onScreen.click();
  } else {
    await page
      .locator('[data-narr-choices] button', { hasText: label ?? choice })
      .first()
      .click();
  }
}

async function expectStep(page: Page, id: string) {
  await expect(page.locator('[data-demo]')).toHaveAttribute('data-step', id);
}

async function checkA11y(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual(
    [],
  );
}

async function noHorizontalScroll(page: Page) {
  const over = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(over).toBeLessThanOrEqual(0);
}

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`report-followup (${scheme})`, () => {
    test.use({ colorScheme: scheme });

    test.beforeEach(async ({ page }) => {
      await page.goto(PAGE);
      await expect(page.locator('[data-demo]')).toHaveAttribute('data-ready', 'true');
    });

    test('page loads with the scenario picker, passes axe and fits the screen', async ({
      page,
    }) => {
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        'A quick follow-up after the drive',
      );
      await expect(page.locator('[data-start]')).toHaveCount(2);
      // Each scenario card is a drawing with a text equivalent and a short title.
      await expect(page.locator('.pcard svg[role="img"]')).toHaveCount(2);
      for (const h of await page.locator('.pcard .pcard-t').allInnerTexts())
        expect(h.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      // The rules are icon rows of a few words each.
      await expect(page.locator('aside.rules li')).toHaveCount(7);
      for (const r of await page.locator('aside.rules li').allInnerTexts())
        expect(r.trim().split(/\s+/).length).toBeLessThanOrEqual(6);
      await expect(page.locator('footer')).toContainText(
        "A community member's proposal. Not affiliated with or endorsed by Waze or Google.",
      );
      await noHorizontalScroll(page);
      await checkA11y(page);
    });

    test('a short loop tells the idea above the scenarios', async ({ page }) => {
      const glance = page.locator('.lg-glance .scene-block');
      const box = (await glance.locator('.scene').boundingBox())!;
      const picker = (await page.locator('[data-picker]').boundingBox())!;
      expect(box.y).toBeLessThan(picker.y);
      await expect(glance.locator('svg[role="img"]')).toHaveAttribute('aria-label', /AI assistant/);
      await expect(glance.locator('p.vh')).toContainText('Proposed:');
      await expect(glance).toHaveAttribute('data-state', 'proposed', { timeout: 5000 });
      const mb = glance.locator('[data-motion-btn]');
      await expect(mb).toHaveText('Pause');
      await mb.click();
      await expect(mb).toHaveText('Play');
      await expect(page.locator('.askcard .ask')).toContainText('hazard reports and map issues');
    });

    test('the rules stay in view beside the phone while playing', async ({ page }) => {
      await page.click('[data-start="hazard"]');
      const strip = page.locator('.rules-strip');
      await expect(strip).toBeVisible();
      await expect(strip.locator('li')).toHaveCount(7);
      for (const li of await strip.locator('li').all()) await expect(li).toBeVisible();
    });

    test('scenario A, hazard: main path to the ending', async ({ page }) => {
      await page.click('[data-start="hazard"]');
      await expectStep(page, 'a-drive');
      await choose(page, 'report');
      await expectStep(page, 'a-menu');
      // Options outside the story stay visible but greyed out.
      await expect(page.locator('[data-screen="menu"] [data-choice="police"]')).toHaveAttribute(
        'aria-disabled',
        'true',
      );
      await choose(page, 'hazard');
      await choose(page, 'construction');
      await choose(page, 'send', 'Report');
      await expectStep(page, 'a-reported');
      await choose(page, 'drive', 'Keep driving');
      await expectStep(page, 'a-red');
      await expect(page.locator('[data-narr-text]')).toContainText('No call');
      await choose(page, 'drive', 'Keep driving');
      await expectStep(page, 'a-parked');
      await expect(page.locator('[data-narr-text]')).toContainText(
        'Skip ahead: 4:31 pm, you’ve parked at Sarit Centre',
      );
      await choose(page, 'wait', 'Wait a moment');
      await choose(page, 'answer');
      await expectStep(page, 'a-call');
      await expect(page.locator('[data-transcript]').first()).toContainText(
        'this is Waze’s AI assistant',
      );
      await page.click('[data-screen]:not([hidden]) [data-lane="Left"]');
      await page.click('[data-screen]:not([hidden]) [data-lane="Middle"]');
      await choose(page, 'lanes-done');
      await choose(page, 'dir-w');
      await choose(page, 'dur-days');
      await expectStep(page, 'a-end');
      await expect(page.locator('[data-ending]')).toBeVisible();
      await expect(page.locator('[data-screen="summary-a"]')).toContainText(
        'Left and middle lanes',
      );
      await noHorizontalScroll(page);
      await checkA11y(page);
    });

    test('scenario A, call me later: one callback, then the ending', async ({ page }) => {
      await page.click('[data-start="hazard"]');
      await choose(page, 'report');
      await choose(page, 'hazard');
      await choose(page, 'construction');
      await choose(page, 'send', 'Report');
      await choose(page, 'drive', 'Keep driving');
      await choose(page, 'drive', 'Keep driving');
      await choose(page, 'wait', 'Wait a moment');
      await choose(page, 'later');
      await expectStep(page, 'a-later');
      await choose(page, 'in30');
      await expectStep(page, 'a-later-set');
      await choose(page, 'skip', 'Skip ahead');
      await expectStep(page, 'a-callback');
      await expect(page.locator('[data-clock]').first()).toHaveText('5:01');
      await expect(page.locator('[data-screen="incoming"] [data-choice="notnow"]')).toBeVisible();
      await choose(page, 'notnow');
      await expectStep(page, 'a-notnow');
      await expect(page.locator('[data-ending]')).toBeVisible();
      // Back returns to the callback; Restart returns to the first step.
      await page.click('[data-back]');
      await expectStep(page, 'a-callback');
      await page.click('[data-restart]');
      await expectStep(page, 'a-drive');
    });

    test('scenario B, map issue: main path to the editor card', async ({ page }) => {
      await page.click('[data-start="map-issue"]');
      await expectStep(page, 'b-drive');
      await choose(page, 'drive', 'Drive to the junction');
      await choose(page, 'straight', 'Go straight on');
      await choose(page, 'report');
      await choose(page, 'mapissue');
      await expectStep(page, 'b-mapissue');
      await expect(page.locator('[data-screen="mapissue"]')).toContainText('Turn not allowed');
      await choose(page, 'turn');
      await expectStep(page, 'b-comment');
      await expect(page.locator('[data-screen="comment"]')).toContainText(
        'Your feedback and username will be sent for review by our community of volunteer map editors',
      );
      await choose(page, 'send');
      await expectStep(page, 'b-today');
      await choose(page, 'next', 'Next');
      await expectStep(page, 'b-inbox');
      await choose(page, 'next', 'Try the idea');
      await choose(page, 'wait', 'Wait a moment');
      await choose(page, 'text');
      await expectStep(page, 'b-text');
      await page.locator('[data-screen]:not([hidden]) [data-choice="turn-right"]').click();
      await choose(page, 'why-sign');
      await choose(page, 'when-all');
      await expectStep(page, 'b-end');
      await expect(page.locator('[data-screen="wme"]')).toContainText('No-turn sign');
      await expect(page.locator('[data-screen="wme"]')).toContainText('Not identified');
      await noHorizontalScroll(page);
      await checkA11y(page);
    });

    test('the demo works from the keyboard', async ({ page }) => {
      await page.locator('[data-start="hazard"]').focus();
      await page.keyboard.press('Enter');
      await expectStep(page, 'a-drive');
      await page.locator('[data-screen]:not([hidden]) [data-choice="report"]').focus();
      await page.keyboard.press('Enter');
      await expectStep(page, 'a-menu');
    });
  });
}
