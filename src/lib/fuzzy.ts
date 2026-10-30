/** Name matching for the presenter's people list: accents folded, filler words ignored. */

const FILLER = new Set([
  'hi',
  'hello',
  'hey',
  'im',
  'i',
  'am',
  'my',
  'name',
  'is',
  'its',
  'this',
  'from',
  'the',
  'at',
  'and',
  'of',
  'waze',
  'google',
  'team',
]);

export function fold(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function tokens(text: string): string[] {
  return fold(text)
    .split(' ')
    .filter((t) => t && !FILLER.has(t));
}

/** Optimal string alignment distance (Levenshtein plus adjacent swaps). */
export function osa(a: string, b: string): number {
  const d: number[][] = [];
  for (let i = 0; i <= a.length; i++) d[i] = [i];
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

/** How far one typed word is from a name word; prefixes of 3+ letters count as exact. */
function wordScore(q: string, w: string): number {
  if (q === w) return 0;
  if (q.length >= 3 && w.startsWith(q)) return 0.25;
  const dist = osa(q, w);
  const allowed = q.length <= 3 ? 0 : q.length <= 6 ? 1 : 2;
  return dist <= allowed ? dist : Infinity;
}

/** Ranks names against what was typed. Every typed word must match a word of the name. */
export function rankNames<T extends { name: string }>(query: string, people: T[], max = 5): T[] {
  const q = tokens(query);
  if (!q.length) return [];
  const scored: { p: T; s: number }[] = [];
  for (const p of people) {
    const words = tokens(p.name);
    if (!words.length) continue;
    let total = 0;
    for (const t of q) {
      const best = Math.min(...words.map((w) => wordScore(t, w)));
      total += best;
      if (!Number.isFinite(total)) break;
    }
    if (Number.isFinite(total)) scored.push({ p, s: total });
  }
  return scored
    .sort((a, b) => a.s - b.s || a.p.name.localeCompare(b.p.name))
    .slice(0, max)
    .map((x) => x.p);
}
