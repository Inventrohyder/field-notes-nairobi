import { test, expect } from '@playwright/test';
import { personalHash, watch } from './helpers';

test.describe('personal links', () => {
  test('a good link greets the visitor and lists their ideas first', async ({ page }) => {
    const w = watch(page);
    await page.goto(
      './' +
        personalHash({
          n: 'Amina',
          l: 'you asked about the follow-up call, so start here',
          i: ['report-followup', 'mosques'],
        }),
    );
    const greet = page.locator('[data-greet]');
    await expect(greet).toBeVisible();
    await expect(page.locator('[data-greet-line]')).toHaveText(
      'Amina, you asked about the follow-up call, so start here',
    );
    // The greeting comes before the hero, with the visitor's ideas in their order.
    const tiles = greet.locator('[data-tile]');
    await expect(tiles).toHaveCount(2);
    await expect(tiles.nth(0)).toHaveAttribute('data-tile', 'report-followup');
    await expect(tiles.nth(1)).toHaveAttribute('data-tile', 'mosques');
    const greetY = (await greet.boundingBox())!.y;
    const heroY = (await page.locator('.hero').boundingBox())!.y;
    expect(greetY).toBeLessThan(heroY);
    // Start here plays their ideas in order.
    await page.getByRole('link', { name: 'Start here' }).click();
    await expect(page).toHaveURL(/\/report-followup\/\?tour=report-followup,mosques/);
    await page.getByRole('link', { name: /Next pick/ }).click();
    await expect(page).toHaveURL(/\/mosques\/\?tour=/);
    await expect(page.getByText("That's all your picks.")).toBeVisible();
    w.expectClean();
  });

  test('a link to an idea page shows a greeting bar above the demo', async ({ page }) => {
    await page.goto(
      'mosques/' +
        personalHash({ n: 'Juma', l: 'this is the stops idea', i: ['mosques'], p: 'mosques' }),
    );
    await expect(page.locator('[data-greetbar]')).toHaveText('Juma, this is the stops idea');
  });

  test('a damaged link falls back to the normal page', async ({ page }) => {
    const w = watch(page);
    for (const hash of [
      '#for=%%%not-base64',
      '#for=' + Buffer.from('{"n":').toString('base64url'),
      personalHash({ n: 'A', l: 'x', i: ['not-an-idea'] }),
      personalHash({ n: 'x'.repeat(41), l: 'x', i: [] }),
      personalHash({ n: 'A', l: 'x'.repeat(141), i: [] }),
    ]) {
      await page.goto('./' + hash);
      await expect(page.locator('h1')).toContainText('Field notes');
      await expect(page.locator('[data-greet]')).toBeHidden();
      await page.goto('mosques/' + hash);
      await expect(page.locator('[data-greetbar]')).toBeHidden();
    }
    w.expectClean();
  });

  test('a name with markup is shown as text', async ({ page }) => {
    let dialog = false;
    page.on('dialog', async (d) => {
      dialog = true;
      await d.dismiss();
    });
    const n = '<img src=x onerror=alert(1)>';
    await page.goto('./' + personalHash({ n, l: '<b>hi</b>', i: ['mosques'] }));
    await expect(page.locator('[data-greet-line]')).toHaveText(`${n}, <b>hi</b>`);
    await expect(page.locator('[data-greet] img')).toHaveCount(0);
    await expect(page.locator('[data-greet] b')).toHaveCount(0);
    await page.goto('mosques/' + personalHash({ n, l: 'x', i: [] }));
    await expect(page.locator('[data-greetbar]')).toHaveText(`${n}, x`);
    await expect(page.locator('[data-greetbar] img')).toHaveCount(0);
    expect(dialog).toBe(false);
  });
});
