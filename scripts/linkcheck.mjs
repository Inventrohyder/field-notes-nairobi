// Checks every internal link and asset reference in the built site.
// Usage: node scripts/linkcheck.mjs dist
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname, posix } from 'node:path';

const root = process.argv[2] ?? 'dist';
const BASE = '/field-notes-nairobi/';

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(root);
const html = files.filter((f) => f.endsWith('.html'));
const ids = new Map();
for (const f of html) {
  const s = readFileSync(f, 'utf8');
  ids.set(f, new Set([...s.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

function resolveTarget(fromFile, url) {
  const [pathPart, hash] = url.split('#');
  let target;
  if (pathPart === '') target = fromFile;
  else {
    let p;
    if (pathPart.startsWith('/')) {
      if (!pathPart.startsWith(BASE)) return { error: `outside base: ${url}` };
      p = join(root, pathPart.slice(BASE.length));
    } else {
      p = join(dirname(fromFile), pathPart);
    }
    p = p.split('?')[0];
    if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
    target = p;
  }
  // The PDF is made from the built site by `npm run pdf`, after this check runs in CI.
  if (!existsSync(target) && !target.endsWith('field-notes-nairobi.pdf'))
    return { error: `missing: ${url}` };
  if (hash && target.endsWith('.html') && !hash.startsWith('for=') && hash !== 'main') {
    const set = ids.get(target);
    if (set && !set.has(decodeURIComponent(hash))) return { error: `missing anchor: ${url}` };
  }
  return {};
}

let errors = 0;
let checked = 0;
for (const f of html) {
  const s = readFileSync(f, 'utf8');
  const urls = [...s.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const u of urls) {
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(u)) continue;
    checked++;
    const r = resolveTarget(f, u.replace(/&amp;/g, '&'));
    if (r.error) {
      errors++;
      console.error(`${posix.normalize(relative(root, f))}: ${r.error}`);
    }
  }
  if (/mailto:/i.test(s)) {
    errors++;
    console.error(`${relative(root, f)}: contains a mailto link`);
  }
}
console.log(`Checked ${checked} internal links in ${html.length} pages: ${errors} problem(s).`);
process.exit(errors ? 1 : 0);
