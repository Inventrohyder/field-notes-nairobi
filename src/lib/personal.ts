/**
 * Personal links. The greeting, the line and the ideas travel after the `#`
 * (`#for=<base64url JSON>`), so they never reach the server and nothing is stored.
 * Anything malformed, oversized or naming an unknown idea is ignored, and the page shows as normal.
 */
export interface Personal {
  /** Name, up to 40 characters. */
  n: string;
  /** One line, up to 140 characters. */
  l: string;
  /** Up to three idea ids. */
  i: string[];
  /** Where the link opens: the main page or one idea. */
  p?: string;
}

export const MAX_NAME = 40;
export const MAX_LINE = 140;
export const MAX_IDEAS = 3;
const MAX_ENCODED = 1200;

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(data: string): string | null {
  if (!/^[A-Za-z0-9_-]+$/.test(data)) return null;
  try {
    const b64 = data.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

/** Builds the `#for=...` fragment. Returns null when the data would not pass `parsePersonal`. */
export function encodePersonal(p: Personal, validIds: readonly string[]): string | null {
  const clean: Personal = { n: p.n.trim(), l: p.l.trim(), i: p.i };
  if (p.p) clean.p = p.p;
  const hash = '#for=' + toBase64Url(JSON.stringify(clean));
  return parsePersonal(hash, validIds) ? hash : null;
}

/** Reads a personal link from a location hash. Returns null for anything that isn't a good link. */
export function parsePersonal(hash: string, validIds: readonly string[]): Personal | null {
  if (!hash.startsWith('#for=')) return null;
  const data = hash.slice(5);
  if (!data || data.length > MAX_ENCODED) return null;
  const json = fromBase64Url(data);
  if (json === null) return null;
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return null;
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  const n = typeof o.n === 'string' ? o.n.trim() : '';
  const l = o.l === undefined ? '' : typeof o.l === 'string' ? o.l.trim() : null;
  if (!n || [...n].length > MAX_NAME || l === null || [...l].length > MAX_LINE) return null;
  if (!Array.isArray(o.i) || o.i.length > MAX_IDEAS) return null;
  const ids: string[] = [];
  for (const id of o.i) {
    if (typeof id !== 'string' || !validIds.includes(id) || ids.includes(id)) return null;
    ids.push(id);
  }
  const out: Personal = { n, l, i: ids };
  if (o.p !== undefined) {
    if (typeof o.p !== 'string' || (o.p !== 'main' && !validIds.includes(o.p))) return null;
    out.p = o.p;
  }
  return out;
}

/** The greeting line shown to the visitor: "<name>, <line>". */
export function greeting(p: Personal): string {
  return p.l ? `${p.n}, ${p.l}` : `${p.n},`;
}
