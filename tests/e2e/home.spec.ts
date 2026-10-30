import { test, expect } from '@playwright/test';
import { horizontalOverflow, seriousA11y, watch } from './helpers';

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`main page (${scheme})`, () => {
    test.use({ colorScheme: scheme });

    test('loads clean, fits the screen and passes axe', async ({ page }) => {
      const w = watch(page);
      await page.goto('./');
      await expect(page.locator('h1')).toContainText('Field notes');
      await expect(page.getByText('Short on time? Start with these three')).toBeVisible();
      await expect(page.locator('#ideas [data-tile]')).toHaveCount(21);
      await expect(page.locator('[data-presenter]')).toBeHidden();
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
      expect(await seriousA11y(page)).toEqual([]);
      w.expectClean();
    });
  });
}

test('picker: two stars, then walk me through my picks', async ({ page }) => {
  const w = watch(page);
  await page.goto('./');
  const picker = page.locator('[data-picker]');
  await expect(picker.getByRole('heading', { name: 'You have five stars' })).toBeVisible();
  await picker.getByRole('button', { name: 'Next' }).click();
  await expect(
    picker.getByRole('heading', { name: 'Which team are you closest to?' }),
  ).toBeVisible();
  await picker.getByRole('button', { name: 'Hyperlocal & places' }).click();
  await expect(picker.getByText('Suggested for Hyperlocal & places')).toBeVisible();
  await picker.getByRole('button', { name: 'Show me the groups' }).click();
  await expect(picker.locator('[data-left]')).toHaveText('5 stars left');
  // The walk button waits for a star.
  await expect(picker.locator('[data-walk-picks]')).toBeDisabled();

  await picker.locator('[data-group-btn="map"]').click();
  await expect(picker.locator('[data-idea="mosques"] [data-sugg-badge]')).toBeVisible();
  await picker.locator('[data-add="parking"]').click();
  await picker.locator('[data-group-btn="reports"]').click();
  await expect(picker.locator('#pkg-map')).toBeHidden();
  await picker.locator('[data-add="alert-timing"]').click();
  await picker.locator('[data-add="alert-timing"]').click();
  await expect(picker.locator('[data-left]')).toHaveText('2 stars left');
  // Keyboard: minus takes a star back.
  await picker.locator('[data-add="alert-timing"]').focus();
  await page.keyboard.press('-');
  await expect(picker.locator('[data-left]')).toHaveText('3 stars left');
  await picker.locator('[data-add="alert-timing"]').click();
  expect(await seriousA11y(page)).toEqual([]);

  // Picks stay after a reload.
  await page.reload();
  await expect(picker.locator('[data-left]')).toHaveText('2 stars left');

  await picker.getByRole('button', { name: 'Walk me through my picks' }).click();
  await expect(page).toHaveURL(/\/alert-timing\/\?tour=alert-timing,parking$/);
  await expect(page.locator('[data-tour-pos]')).toHaveText('Your picks · 1 of 2');
  await page.getByRole('link', { name: /Next pick/ }).click();
  await expect(page).toHaveURL(/\/parking\/\?tour=/);
  await expect(page.getByText("That's all your picks.")).toBeVisible();
  await page.getByRole('link', { name: 'See all 21 ideas' }).click();
  await expect(page.locator('#ideas')).toBeVisible();
  w.expectClean();
});

test('presenter mode stays hidden without ?presenter and works with it', async ({ page }) => {
  const w = watch(page);
  await page.goto('./');
  await expect(page.locator('[data-presenter]')).toBeHidden();
  await page.goto('./?presenter');
  await page.getByRole('button', { name: 'Presenter' }).click();
  // Remembered for the tab.
  await page.goto('mosques/');
  await expect(page.getByRole('button', { name: 'Presenter' })).toBeVisible();
  await page.goto('./');
  await page.getByRole('button', { name: 'Presenter' }).click();
  const panel = page.locator('[data-pz-panel]');
  await panel.getByLabel('Name').fill('Amina');
  await panel.getByLabel('One line').fill('you asked about the follow-up call, so start here');
  await panel.locator('[data-pz-idea][value="report-followup"]').check();
  await panel.getByRole('button', { name: 'Copy link' }).click();
  const url = await panel.locator('[data-pz-out]').inputValue();
  expect(url).toMatch(/\/field-notes-nairobi\/#for=/);

  // People list from a local file, then fuzzy find.
  await panel.locator('summary', { hasText: 'People list' }).click();
  await panel.getByLabel('Load a people list').setInputFiles({
    name: 'people.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify([{ name: 'José Ortega', ideas: ['mosques'], line: 'hi' }])),
  });
  await expect(panel.getByText('1 person in the list on this device.')).toBeVisible();
  await panel.getByLabel('Find someone in your list').fill('hi im jose');
  await panel.getByRole('button', { name: 'José Ortega' }).click();
  await expect(panel.getByLabel('Name')).toHaveValue('José Ortega');

  // Picks log.
  await page.goto('./?presenter');
  await page.locator('[data-go="groups"]').first().click();
  await page.locator('[data-group-btn="ride"]').click();
  await page.locator('[data-add="cabin-comfort"]').click();
  await page.getByRole('button', { name: 'Presenter' }).click();
  await panel.locator('summary', { hasText: 'Picks log' }).click();
  await panel.getByRole('button', { name: 'Save and reset for the next visitor' }).click();
  await expect(page.locator('[data-left]')).toBeHidden();
  await page.getByRole('button', { name: 'Presenter' }).click();
  await panel.locator('summary', { hasText: 'Picks log' }).click();
  await expect(panel.locator('[data-pz-logcount]')).toHaveText('(1)');
  page.once('dialog', (d) => d.accept());
  await panel.getByRole('button', { name: 'Clear log' }).click();
  await expect(panel.locator('[data-pz-logcount]')).toHaveText('(0)');
  w.expectClean();
});

test('print page renders every idea', async ({ page }) => {
  const w = watch(page);
  await page.goto('print/');
  await expect(page.locator('article.pi')).toHaveCount(21);
  await expect(page.locator('.lg-print')).toHaveCount(20);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.url').first()).toBeVisible();
  w.expectClean();
});
