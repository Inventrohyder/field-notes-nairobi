// Makes dist/field-notes-nairobi.pdf from the built /print/ page.
// Usage: npm run build && npm run pdf
import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = 'dist';
const BASE = '/field-notes-nairobi/';
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.json': 'application/json',
};

const server = createServer((req, res) => {
  let p = decodeURIComponent((req.url ?? '/').split('?')[0]);
  if (!p.startsWith(BASE)) {
    res.writeHead(404).end();
    return;
  }
  p = join(DIST, p.slice(BASE.length));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[extname(p)] ?? 'application/octet-stream' });
  res.end(readFileSync(p));
});

await new Promise((r) => server.listen(0, r));
const port = server.address().port;
const executablePath = process.env.CI ? undefined : '/opt/google/chrome/chrome';
const browser = await chromium.launch(executablePath ? { executablePath } : {});
try {
  const page = await browser.newPage();
  const url = `http://localhost:${port}${BASE}print/`;
  const res = await page.goto(url, { waitUntil: 'networkidle' });
  if (!res || !res.ok()) throw new Error(`Could not open ${url}`);
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: join(DIST, 'field-notes-nairobi.pdf'),
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  });
  console.log('Wrote dist/field-notes-nairobi.pdf');
} finally {
  await browser.close();
  server.close();
}
