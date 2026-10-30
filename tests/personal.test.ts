import { describe, expect, it } from 'vitest';
import { encodePersonal, parsePersonal } from '../src/lib/personal';
import { rankNames } from '../src/lib/fuzzy';
import { parseTour } from '../src/lib/picks';

const IDS = ['alert-timing', 'police-undivided', 'mosques', 'report-followup'];
const b64 = (o: unknown) => '#for=' + Buffer.from(JSON.stringify(o)).toString('base64url');

describe('personal links', () => {
  it('round-trips a good link', () => {
    const hash = encodePersonal(
      { n: 'Amina', l: 'start here', i: ['mosques', 'alert-timing'], p: 'main' },
      IDS,
    );
    expect(hash).toMatch(/^#for=[A-Za-z0-9_-]+$/);
    expect(parsePersonal(hash!, IDS)).toEqual({
      n: 'Amina',
      l: 'start here',
      i: ['mosques', 'alert-timing'],
      p: 'main',
    });
  });

  it('keeps accents and non-Latin names', () => {
    const hash = encodePersonal({ n: 'Zoë 李', l: 'karibu', i: [] }, IDS);
    expect(parsePersonal(hash!, IDS)?.n).toBe('Zoë 李');
  });

  it.each([
    ['not base64', '#for=***'],
    ['empty', '#for='],
    ['not JSON', '#for=' + Buffer.from('nope').toString('base64url')],
    ['array', b64([1])],
    ['no name', b64({ n: '', l: 'x', i: [] })],
    ['name too long', b64({ n: 'x'.repeat(41), l: '', i: [] })],
    ['line too long', b64({ n: 'A', l: 'x'.repeat(141), i: [] })],
    ['four ideas', b64({ n: 'A', l: '', i: [...IDS] })],
    ['unknown idea', b64({ n: 'A', l: '', i: ['nope'] })],
    ['unknown target', b64({ n: 'A', l: '', i: [], p: 'nope' })],
    ['oversized', '#for=' + 'A'.repeat(5000)],
    ['other hash', '#ideas'],
  ])('ignores a damaged link: %s', (_label, hash) => {
    expect(parsePersonal(hash, IDS)).toBeNull();
  });
});

describe('name matching', () => {
  const people = [{ name: 'Amina Wanjiru' }, { name: 'José Ortega' }, { name: 'Ann Lee' }];
  it('folds accents and ignores filler words', () => {
    expect(rankNames('hi im jose from waze', people)[0]?.name).toBe('José Ortega');
  });
  it('allows a small typo', () => {
    expect(rankNames('Amnia', people)[0]?.name).toBe('Amina Wanjiru');
  });
  it('does not match short words loosely', () => {
    expect(rankNames('Ana', people)).toEqual([]);
  });
});

describe('tour', () => {
  it('keeps known ids once, in order', () => {
    expect(parseTour('?tour=mosques,nope,mosques,alert-timing', IDS)).toEqual([
      'mosques',
      'alert-timing',
    ]);
  });
});
