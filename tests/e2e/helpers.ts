import { expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/** Serious and critical axe violations on the page, as readable lines. */
export async function seriousA11y(page: Page): Promise<string[]> {
  const results = await new AxeBuilder({ page }).analyze();
  return results.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
}

export async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

/**
 * Records console errors, page errors, failed responses and any request that leaves the site,
 * so a test can assert there were none.
 */
export function watch(page: Page) {
  const problems: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') problems.push(`console: ${m.text()}`);
  });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (!['localhost', '127.0.0.1'].includes(u.hostname) && !u.protocol.startsWith('data'))
      problems.push(`third-party request: ${r.url()}`);
  });
  page.on('response', (r) => {
    if (r.status() >= 400) problems.push(`${r.status()}: ${r.url()}`);
  });
  return {
    problems,
    expectClean: () => expect(problems).toEqual([]),
  };
}

export function personalHash(o: unknown): string {
  return '#for=' + Buffer.from(JSON.stringify(o), 'utf8').toString('base64url');
}
