import { test } from '@playwright/test';

// Personal links (#for=...) are built on the main page. Their tests live with that page.
test.describe('personal links', () => {
  test.fixme('a good link greets the visitor and lists their ideas first', async () => {});
  test.fixme('a damaged link falls back to the normal page', async () => {});
});
