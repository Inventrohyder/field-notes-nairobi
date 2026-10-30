/**
 * Public check (plan section 8). Scans the built site in dist/ for anything that must not be
 * public: email addresses, rank and edit counts, meetup names and wording, restricted forum
 * topics, and a real prayer-drive schedule. Run `npm run build` first.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';

const DIST = 'dist';

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = existsSync(DIST)
  ? walk(DIST).filter((f) => /\.(html|js|css|json|txt|xml|webmanifest|svg)$/.test(f))
  : [];
const texts = files.map((f) => ({ file: relative(DIST, f), text: readFileSync(f, 'utf8') }));

/** Visible text of an HTML page: tags, scripts and styles removed, entities decoded. */
function visible(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&mdash;|&#8212;|&#x2014;/gi, '—')
    .replace(/&amp;/g, '&');
}

function hits(re: RegExp, pool = texts): string[] {
  const out: string[] = [];
  for (const { file, text } of pool) {
    for (const m of text.matchAll(
      new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'),
    )) {
      const at = m.index ?? 0;
      out.push(
        `${file}: …${text.slice(Math.max(0, at - 40), at + m[0].length + 40).replace(/\s+/g, ' ')}…`,
      );
      if (out.length > 20) return out;
    }
  }
  return out;
}

/*
 * The private strings themselves stay out of this public repo. Each is kept as the first 16 hex
 * digits of the SHA-256 of its folded form (lower case, accents removed, punctuation other than
 * "." turned into single spaces). The scan hashes every run of one to seven words in dist/.
 */
/** Names from the meetup, and their parts. */
const NAME_DIGESTS = new Set([
  '0dbd44463690cf04',
  '14b50ea775c1b70e',
  'fab9de504867dc51',
  'c14cc2af2b4daa84',
  '0213516b35d86603',
  'e0b5d487d425dae9',
  'f79f8f240960905b',
  '8928890cce53a4d0',
  'a0961cf4237f2bbc',
  'b153424a71d3c238',
  '3cdf8141e7d4972d',
  '43c623a132ca99ee',
  '430d1dd5ff4eb535',
  '22258d04245c7816',
  '4e02dd063427cde6',
  '73efaef281db8cfc',
  '753b59b556cca1d2',
  '7526ea01a737a20e',
  '3e146ff141f3f26e',
  '09cf4958770e6fad',
  '1aa6905d1b397ee0',
  '22cf32510e634d6b',
  '4c5dc9a612288500',
  'a7b01dee46f47ce0',
  '58edd150a261372c',
  'c35baf2037842a8b',
  '04f17819c8d5ddd2',
  'ce04adf7db84a32c',
  '40fec9b86b45f675',
  'ef93b7ce491829cb',
  'd2c60d625e8c1bd0',
  '5909005407a98d49',
  '1839c2b4db46e667',
  '9ab288aef39a3ab8',
  'cf539ae47d4f2063',
  '10104c75ad02b35b',
  'f9e6a2a95d1d24f6',
  '8f613377728ddcd0',
  '06cf5a5db705d801',
  '6bdf0b2dfc2e0221',
  'f1a311e628aa91bc',
  'dc7ec9d8c9b6ecd0',
  '17186abe2aa40e93',
  '2e0b8d61fa2a6959',
  '17ad8056d9799571',
  '0d1bf79a20db228c',
  '96d90cdd34c51b69',
  '0ea5fcdb94d8bf75',
]);

/** Waze Discuss topic numbers that are restricted and must not be cited. */
const TOPIC_DIGESTS = new Set([
  '913ba3380cf2411c',
  '9aa26789ed8d9b7d',
  '0eaa69a16d7c358a',
  '4c32ec775fb82a94',
  '477043c2c479d419',
  '95d30a1b8a2b6482',
  '3911f029da75f78f',
  'abe4cb8599d6c245',
  '441082d52a227a95',
  '1e442ba37d896264',
  '8119db98041f7d81',
  'd6b8e50b30a11367',
  'a44eb29102dd5b86',
  '0ba5ee9ce5943fbc',
  '0a28edc682efbf1f',
  '8530fa4788f104aa',
  '26c46c640f96e149',
  '2eeeb0c76fed5cf0',
  '505487a5f23138c0',
  '68c249f8788d7962',
  '05df5ff2e3d160fa',
  'a201e47ef3440131',
  '1113461ef71d14ed',
  '1750a8b9be17954b',
  '533a426863f8258f',
  '8ea152dbfba38e1f',
  '5a7e2ffd3facaefc',
  '4e505f81dc5c16db',
  '62260d478d7c48ec',
  'b422562a76c4d7a8',
  'feca611bdc5db930',
  '9364b8ea4f02c335',
  '269ab4ec83b382c6',
  '1ba02dfa16793ce6',
  'c658d86dd60c72eb',
  '4943bc78a806e02d',
  'b771652f08a0ad74',
  '60341247a14675d7',
  'd231f5a49fbe8ecd',
  'bf4f9ae7996820d3',
  'b73efdfd82cdfe87',
  'dac98500ab9f4bcd',
  'b3f1b50e4318cd86',
  '5881412a070cf41c',
  '88b04026321ca1af',
  '0c4c453a46af8f80',
  'c472cf0978f9a793',
  '3c1b7053f0edd447',
  '128b8be302cccf84',
  '96f19ea17fd2e65d',
  '29c0c8ae8dc543a8',
  'e8f1ce0be809b15b',
  '3d8dbd98077ee963',
  'c57e45c141c978f1',
  'e91543b37d12a164',
  '228262437dddeafe',
]);

/** Restricted thread titles and private contact details. */
const PHRASE_DIGESTS = new Set([
  '2d709df676284e24',
  '7b616817586fe27d',
  'c6d4ac5305a12fad',
  '944753f4acdf7503',
  '88bf55d26dde58d0',
  '7c27f8d8249e87d7',
  '22b36318f3f00f44',
  '6c566f1e2fb72878',
]);

function fold(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, ' ')
    .trim();
}
function digest(text: string): string {
  return createHash('sha256').update(fold(text)).digest('hex').slice(0, 16);
}

/** Every run of 1 to `max` words whose digest is in `set`. */
function digestHits(set: Set<string>, max: number): string[] {
  const out: string[] = [];
  for (const { file, text } of texts) {
    const words = fold(text)
      .split(' ')
      .map((w) => w.replace(/^\.+|\.+$/g, ''))
      .filter(Boolean);
    for (let i = 0; i < words.length; i++) {
      for (let k = 1; k <= max && i + k <= words.length; k++) {
        const run = words.slice(i, i + k).join(' ');
        if (set.has(digest(run))) out.push(`${file}: word run ${i} (${k} words)`);
      }
    }
  }
  return out;
}

describe('public check of dist/', () => {
  it('has a built site to check', () => {
    expect(files.length, 'run npm run build first').toBeGreaterThan(20);
  });

  it('has no em-dashes in visible text', () => {
    const pages = texts.filter((t) => t.file.endsWith('.html'));
    expect(
      hits(
        /—/,
        pages.map((p) => ({ file: p.file, text: visible(p.text) })),
      ),
    ).toEqual([]);
  });

  it('has no email addresses or mailto links', () => {
    expect(hits(/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/)).toEqual([]);
    expect(hits(/mailto:|gmail/i)).toEqual([]);
  });

  it('has no rank or edit count for the author', () => {
    expect(hits(/Level 2|7,400|7400 edits|Area Manager/i)).toEqual([]);
  });

  it('names nobody from the meetup', () => {
    expect(digestHits(NAME_DIGESTS, 3)).toEqual([]);
  });

  it('cites no restricted forum topic or beta content', () => {
    const cited = new Set<string>();
    for (const { text } of texts)
      for (const m of text.matchAll(/discuss\/t\/(?:[^"'\s<>/]+\/)?(\d+)/g)) cited.add(m[1]);
    expect([...cited].filter((n) => TOPIC_DIGESTS.has(digest(n)))).toEqual([]);
    expect(digestHits(PHRASE_DIGESTS, 7)).toEqual([]);
    expect(hits(/\bBeta\b/)).toEqual([]);
  });

  it('keeps meetup wording off the site', () => {
    expect(
      hits(
        /Before we talk|Thank you for listening|Haitham[’']s phone|Waze EMEA Mega Meetup · Berlin/i,
      ),
    ).toEqual([]);
    // "Next person" belongs to presenter mode only, which uses "next visitor".
    expect(hits(/next person/i)).toEqual([]);
  });

  it('shows no real prayer-drive schedule', () => {
    expect(hits(/Dhuhr Oct|\bAsr\b|Maghrib/)).toEqual([]);
    const dhuhr = hits(/Dhuhr/);
    const allowed = /mosque along the way by 13:15 for Dhuhr/;
    expect(dhuhr.filter((h) => !allowed.test(h))).toEqual([]);
  });

  it('loads nothing from other sites and has no analytics', () => {
    const html = texts.filter((t) => t.file.endsWith('.html'));
    expect(
      hits(
        /<(script|link|img|iframe|source|video|audio)\b[^>]*\s(src|href)="(https?:)?\/\//i,
        html,
      ).filter((h) => !/rel="(canonical|me|noopener)"/.test(h)),
    ).toEqual([]);
    expect(hits(/@import\s+url\(\s*['"]?https?:|url\(\s*['"]?https?:\/\//i)).toEqual([]);
    expect(
      hits(
        /googletagmanager|google-analytics|gtag\(|plausible|matomo|umami|segment\.io|fonts\.googleapis/i,
      ),
    ).toEqual([]);
    expect(hits(/navigator\.sendBeacon|new WebSocket/)).toEqual([]);
  });
});
