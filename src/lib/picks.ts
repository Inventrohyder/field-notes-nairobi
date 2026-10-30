/** The visitor's stars, kept in this browser only. */
export const PICKS_KEY = 'field-notes-picks';
export const TOTAL_STARS = 5;

export interface Picks {
  stars: Record<string, number>;
  team?: string;
}

export function loadPicks(validIds: readonly string[]): Picks {
  try {
    const raw = JSON.parse(localStorage.getItem(PICKS_KEY) || 'null') as unknown;
    if (!raw || typeof raw !== 'object') return { stars: {} };
    const o = raw as { stars?: Record<string, unknown>; team?: unknown };
    const stars: Record<string, number> = {};
    let total = 0;
    for (const [id, n] of Object.entries(o.stars ?? {})) {
      if (!validIds.includes(id) || typeof n !== 'number' || n < 1) continue;
      const k = Math.min(Math.floor(n), TOTAL_STARS - total);
      if (k > 0) {
        stars[id] = k;
        total += k;
      }
    }
    return { stars, team: typeof o.team === 'string' ? o.team : undefined };
  } catch {
    return { stars: {} };
  }
}

export function savePicks(p: Picks): void {
  try {
    localStorage.setItem(PICKS_KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable: picks last for this visit only */
  }
}

export function clearPicks(): void {
  try {
    localStorage.removeItem(PICKS_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function starCount(p: Picks): number {
  return Object.values(p.stars).reduce((a, b) => a + b, 0);
}

/** Picked ideas, most stars first, then in page order. */
export function orderedPicks(p: Picks, order: readonly string[]): string[] {
  return order
    .filter((id) => (p.stars[id] ?? 0) > 0)
    .sort((a, b) => (p.stars[b] ?? 0) - (p.stars[a] ?? 0) || order.indexOf(a) - order.indexOf(b));
}

/** Reads `?tour=a,b,c`, keeping known ids only, without repeats. */
export function parseTour(search: string, validIds: readonly string[]): string[] {
  const raw = new URLSearchParams(search).get('tour');
  if (!raw) return [];
  const out: string[] = [];
  for (const id of raw.split(',')) {
    if (validIds.includes(id) && !out.includes(id)) out.push(id);
    if (out.length >= 21) break;
  }
  return out;
}
