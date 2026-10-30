/**
 * Presenter mode, for Haitham's own phone at events. Opens with ?presenter in the address and is
 * remembered for the tab. The people list and the picks log stay in this browser on this device.
 */
import { IDEA_IDS, IDEA_META } from './ideas-meta';
import { encodePersonal, MAX_IDEAS, MAX_LINE, MAX_NAME } from '../lib/personal';
import { rankNames } from '../lib/fuzzy';
import { PICKS_KEY, clearPicks, loadPicks, orderedPicks } from '../lib/picks';

const SESSION_KEY = 'field-notes-presenter';
const PEOPLE_KEY = 'field-notes-people';
const LOG_KEY = 'field-notes-picks-log';
const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');

export interface Person {
  name: string;
  ideas: string[];
  line?: string;
}
export interface LogEntry {
  time: string;
  name?: string;
  team?: string;
  picks: { id: string; stars: number }[];
}

function store(kind: 'local' | 'session'): Storage | null {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}
function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = store('local')?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeJson(key: string, value: unknown): void {
  try {
    store('local')?.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

/** Keeps only well-formed people with known idea ids. */
export function cleanPeople(data: unknown, validIds: readonly string[]): Person[] {
  if (!Array.isArray(data)) return [];
  const out: Person[] = [];
  for (const raw of data) {
    if (!raw || typeof raw !== 'object') continue;
    const o = raw as Record<string, unknown>;
    if (typeof o.name !== 'string' || !o.name.trim()) continue;
    const ideas = Array.isArray(o.ideas)
      ? o.ideas.filter((i): i is string => typeof i === 'string' && validIds.includes(i))
      : [];
    const p: Person = { name: o.name.trim().slice(0, MAX_NAME), ideas: ideas.slice(0, MAX_IDEAS) };
    if (typeof o.line === 'string' && o.line.trim()) p.line = o.line.trim().slice(0, MAX_LINE);
    out.push(p);
  }
  return out;
}

function csvCell(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}
export function logAsCsv(log: LogEntry[]): string {
  const rows = [['time', 'name', 'team', 'picks'].join(',')];
  for (const e of log) {
    rows.push(
      [
        e.time,
        e.name ?? '',
        e.team ?? '',
        e.picks.map((p) => `${IDEA_META[p.id]?.num ?? p.id} x${p.stars}`).join('; '),
      ]
        .map(csvCell)
        .join(','),
    );
  }
  return rows.join('\n');
}
export function logAsText(log: LogEntry[]): string {
  return log
    .map((e, i) => {
      const who = [e.name, e.team].filter(Boolean).join(' · ') || 'Visitor';
      const picks = e.picks
        .map(
          (p) =>
            `${'★'.repeat(p.stars)} ${IDEA_META[p.id]?.num ?? ''} ${IDEA_META[p.id]?.title ?? p.id}`,
        )
        .join('\n  ');
      return `${i + 1}. ${who} (${e.time})\n  ${picks || 'No picks'}`;
    })
    .join('\n\n');
}

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function initPresenter(): void {
  const root = document.querySelector<HTMLElement>('[data-presenter]');
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const session = store('session');
  if (params.has('presenter')) session?.setItem(SESSION_KEY, '1');
  if (session?.getItem(SESSION_KEY) !== '1' && !params.has('presenter')) return;
  root.hidden = false;

  const q = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const qa = <T extends Element = HTMLElement>(sel: string) => [...root.querySelectorAll<T>(sel)];

  /* ----- Panel ----- */
  const openBtn = q<HTMLButtonElement>('[data-pz-open]');
  const panel = q('[data-pz-panel]');
  const setOpen = (on: boolean) => {
    panel.hidden = !on;
    openBtn.setAttribute('aria-expanded', String(on));
    if (on) q<HTMLElement>('#pz-h').focus();
  };
  openBtn.addEventListener('click', () => setOpen(panel.hidden));
  q('[data-pz-close]').addEventListener('click', () => {
    setOpen(false);
    openBtn.focus();
  });
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
      openBtn.focus();
    }
  });

  /* ----- Personal link maker ----- */
  const name = q<HTMLInputElement>('[data-pz-name]');
  const line = q<HTMLInputElement>('[data-pz-line]');
  const target = q<HTMLSelectElement>('[data-pz-target]');
  const boxes = qa<HTMLInputElement>('[data-pz-idea]');
  const count = q('[data-pz-count]');
  const linkStatus = q('[data-pz-linkstatus]');
  const out = q<HTMLInputElement>('[data-pz-out]');
  const chosen = () => boxes.filter((b) => b.checked).map((b) => b.value);
  const syncBoxes = () => {
    const n = chosen().length;
    count.textContent = `(${n} of ${MAX_IDEAS})`;
    boxes.forEach((b) => (b.disabled = !b.checked && n >= MAX_IDEAS));
  };
  boxes.forEach((b) => b.addEventListener('change', syncBoxes));
  const fill = (p: Partial<Person>) => {
    name.value = p.name ?? '';
    line.value = p.line ?? '';
    boxes.forEach((b) => (b.checked = (p.ideas ?? []).includes(b.value)));
    target.value = 'main';
    syncBoxes();
    out.hidden = true;
    linkStatus.textContent = '';
  };
  q('[data-pz-clearlink]').addEventListener('click', () => fill({}));
  q('[data-pz-make]').addEventListener('click', async () => {
    const t = target.value;
    const hash = encodePersonal({ n: name.value, l: line.value, i: chosen(), p: t }, IDEA_IDS);
    if (!hash) {
      linkStatus.textContent = 'Add a name first.';
      name.focus();
      return;
    }
    const url = `${location.origin}${base}${t === 'main' ? '' : `${t}/`}${hash}`;
    out.value = url;
    out.hidden = false;
    linkStatus.textContent = (await copy(url)) ? 'Link copied.' : 'Copy the link below.';
    out.select();
  });
  syncBoxes();

  /* ----- People list ----- */
  const find = q('[data-pz-find]');
  const who = q<HTMLInputElement>('[data-pz-who]');
  const matches = q('[data-pz-matches]');
  const peopleStatus = q('[data-pz-peoplestatus]');
  const forget = q<HTMLButtonElement>('[data-pz-forget]');
  let people = cleanPeople(readJson<unknown>(PEOPLE_KEY, []), IDEA_IDS);
  const syncPeople = () => {
    find.hidden = people.length === 0;
    forget.hidden = people.length === 0;
    peopleStatus.textContent = people.length
      ? `${people.length} ${people.length === 1 ? 'person' : 'people'} in the list on this device.`
      : '';
  };
  q<HTMLInputElement>('[data-pz-file]').addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const list = cleanPeople(JSON.parse(String(reader.result)), IDEA_IDS);
        if (!list.length) throw new Error('empty');
        people = list;
        writeJson(PEOPLE_KEY, people);
        syncPeople();
      } catch {
        peopleStatus.textContent = 'That file is not a people list. Nothing was loaded.';
      }
    };
    reader.readAsText(file);
  });
  forget.addEventListener('click', () => {
    if (!window.confirm('Remove the people list from this device?')) return;
    people = [];
    try {
      store('local')?.removeItem(PEOPLE_KEY);
    } catch {
      /* storage unavailable */
    }
    syncPeople();
  });
  who.addEventListener('input', () => {
    matches.replaceChildren();
    for (const p of rankNames(who.value, people)) {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = p.name;
      b.addEventListener('click', () => {
        fill(p);
        who.value = '';
        matches.replaceChildren();
        name.focus();
      });
      li.appendChild(b);
      matches.appendChild(li);
    }
  });
  syncPeople();

  /* ----- Picks log ----- */
  const logStatus = q('[data-pz-logstatus]');
  const logList = q('[data-pz-log]');
  const logCount = q('[data-pz-logcount]');
  const showBtn = q<HTMLButtonElement>('[data-pz-show]');
  const getLog = () => {
    const l = readJson<unknown>(LOG_KEY, []);
    return Array.isArray(l) ? (l as LogEntry[]) : [];
  };
  const renderLog = () => {
    const log = getLog();
    logCount.textContent = `(${log.length})`;
    logList.replaceChildren(
      ...log.map((e) => {
        const li = document.createElement('li');
        const who = [e.name, e.team].filter(Boolean).join(' · ') || 'Visitor';
        const picks = e.picks
          .map((p) => `${IDEA_META[p.id]?.num ?? p.id} ${'★'.repeat(p.stars)}`)
          .join(', ');
        li.textContent = `${who}: ${picks || 'no picks'} (${new Date(e.time).toLocaleString('en-GB')})`;
        return li;
      }),
    );
  };
  q('[data-pz-save]').addEventListener('click', () => {
    const picks = loadPicks(IDEA_IDS);
    const ids = orderedPicks(picks, IDEA_IDS);
    const entry: LogEntry = {
      time: new Date().toISOString(),
      picks: ids.map((id) => ({ id, stars: picks.stars[id] })),
    };
    if (name.value.trim()) entry.name = name.value.trim().slice(0, MAX_NAME);
    if (picks.team) entry.team = picks.team;
    writeJson(LOG_KEY, [...getLog(), entry]);
    clearPicks();
    fill({});
    renderLog();
    logStatus.textContent = 'Saved. Ready for the next visitor.';
    if (document.querySelector('[data-picker]')) {
      // Start the main page afresh for the next visitor, keeping presenter mode.
      location.href = `${base}?presenter`;
    }
  });
  showBtn.addEventListener('click', () => {
    logList.hidden = !logList.hidden;
    showBtn.setAttribute('aria-expanded', String(!logList.hidden));
    showBtn.textContent = logList.hidden ? 'Show entries' : 'Hide entries';
  });
  q('[data-pz-copytext]').addEventListener('click', async () => {
    logStatus.textContent = (await copy(logAsText(getLog()))) ? 'Copied as text.' : 'Copy failed.';
  });
  q('[data-pz-copycsv]').addEventListener('click', async () => {
    logStatus.textContent = (await copy(logAsCsv(getLog()))) ? 'Copied as CSV.' : 'Copy failed.';
  });
  q('[data-pz-clearlog]').addEventListener('click', () => {
    if (!window.confirm('Clear every entry in the picks log on this device?')) return;
    try {
      store('local')?.removeItem(LOG_KEY);
    } catch {
      /* storage unavailable */
    }
    renderLog();
    logStatus.textContent = 'Log cleared.';
  });
  window.addEventListener('storage', (e) => {
    if (e.key === LOG_KEY || e.key === PICKS_KEY) renderLog();
  });
  renderLog();
}
