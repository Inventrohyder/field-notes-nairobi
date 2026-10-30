/** Main page: the personal greeting, the picker and its stars. */
import { IDEA_IDS } from './ideas-meta';
import { greeting, parsePersonal } from '../lib/personal';
import {
  TOTAL_STARS,
  clearPicks,
  loadPicks,
  orderedPicks,
  savePicks,
  starCount,
  type Picks,
} from '../lib/picks';

const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
const STAR_SVG =
  '<svg class="star" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" stroke-linejoin="round"></path></svg>';

function $<T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T | null {
  return root.querySelector<T>(sel);
}
function $$<T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T[] {
  return [...root.querySelectorAll<T>(sel)];
}

export function tourHref(ids: string[]): string {
  return `${base}${ids[0]}/?tour=${ids.join(',')}`;
}

function initGreeting(): void {
  const p = parsePersonal(location.hash, IDEA_IDS);
  const box = $('[data-greet]');
  if (!p || !box) return;
  const line = $('[data-greet-line]', box);
  if (line) line.textContent = greeting(p);
  const list = $('[data-greet-tiles]', box);
  if (list) {
    for (const id of p.i) {
      const tile = $(`#ideas [data-tile="${id}"]`);
      if (tile) list.appendChild(tile.cloneNode(true));
    }
    list.hidden = p.i.length === 0;
  }
  const go = $<HTMLAnchorElement>('[data-greet-go]', box);
  if (go) {
    if (p.i.length) go.href = tourHref(p.i);
    else go.href = '#ideas';
  }
  box.hidden = false;
}

function initPicker(): void {
  const picker = $('[data-picker]');
  if (!picker) return;
  picker.hidden = false;
  const heroPick = $('[data-hero-pick]');
  if (heroPick) heroPick.hidden = false;

  let picks: Picks = loadPicks(IDEA_IDS);
  const live = $('[data-pk-live]', picker);
  const say = (t: string) => {
    if (live) live.textContent = t;
  };

  /* ----- Steps ----- */
  const show = (step: string, focus = true) => {
    $$('[data-pk-step]', picker).forEach((s) => {
      s.hidden = s.dataset.pkStep !== step;
    });
    const order = ['how', 'team', 'groups'];
    $$('[data-dot]', picker).forEach((d) => {
      d.toggleAttribute('data-on', order.indexOf(d.dataset.dot!) <= order.indexOf(step));
    });
    if (focus) $(`[data-pk-step="${step}"] h2`, picker)?.focus({ preventScroll: false });
  };
  $$<HTMLButtonElement>('[data-go]', picker).forEach((b) =>
    b.addEventListener('click', () => show(b.dataset.go!)),
  );

  /* ----- Team suggestions: a light-touch badge, no stars placed for the visitor ----- */
  const applyTeam = () => {
    const chips = $$<HTMLButtonElement>('[data-team]', picker);
    const ti = chips.findIndex((c) => c.dataset.teamName === picks.team);
    const sugg = new Set(ti >= 0 ? (chips[ti].dataset.teamIdeas ?? '').split(',') : []);
    $$<HTMLButtonElement>('[data-team]', picker).forEach((c) =>
      c.setAttribute('aria-pressed', String(Number(c.dataset.team) === ti)),
    );
    $$('[data-team-sugg]', picker).forEach((s) => {
      s.hidden = Number(s.dataset.teamSugg) !== ti;
    });
    $$('[data-idea]', picker).forEach((li) => {
      const badge = $('[data-sugg-badge]', li);
      if (badge) badge.hidden = !sugg.has(li.dataset.idea!);
    });
    $$('[data-group]', picker).forEach((g) => {
      const n = $$('[data-idea]', g).filter((li) => sugg.has(li.dataset.idea!)).length;
      const tag = $('[data-gsugg]', g);
      if (tag) {
        tag.hidden = n === 0;
        tag.textContent = `${n} suggested`;
      }
    });
  };
  $$<HTMLButtonElement>('[data-team]', picker).forEach((c) =>
    c.addEventListener('click', () => {
      const name = c.dataset.teamName;
      picks.team = picks.team === name ? undefined : name;
      savePicks(picks);
      applyTeam();
    }),
  );

  /* ----- Groups: one open at a time ----- */
  const groupBtns = $$<HTMLButtonElement>('[data-group-btn]', picker);
  groupBtns.forEach((b) =>
    b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') !== 'true';
      groupBtns.forEach((o) => {
        const on = o === b && open;
        o.setAttribute('aria-expanded', String(on));
        const list = document.getElementById(o.getAttribute('aria-controls')!);
        if (list) list.hidden = !on;
      });
    }),
  );

  /* ----- Stars ----- */
  const render = () => {
    const used = starCount(picks);
    const left = TOTAL_STARS - used;
    $$('.tray-star', picker).forEach((s, i) => s.classList.toggle('used', i >= left));
    const leftEl = $('[data-left]', picker);
    if (leftEl) leftEl.textContent = left === 1 ? '1 star left' : `${left} stars left`;
    $$('[data-idea]', picker).forEach((li) => {
      const id = li.dataset.idea!;
      const n = picks.stars[id] ?? 0;
      const box = $('[data-stars]', li);
      if (box && Number(box.dataset.n ?? 0) !== n) {
        box.dataset.n = String(n);
        box.innerHTML =
          STAR_SVG.repeat(n) +
          `<span class="visually-hidden" data-stars-text>${n ? `${n} ${n === 1 ? 'star' : 'stars'}` : 'No stars'}</span>`;
      }
      li.toggleAttribute('data-starred', n > 0);
      const minus = $('[data-minus]', li);
      if (minus) minus.hidden = n === 0;
      $('[data-add]', li)?.setAttribute('aria-disabled', String(left === 0));
    });
    $$('[data-group]', picker).forEach((g) => {
      const n = $$('[data-idea]', g).reduce((a, li) => a + (picks.stars[li.dataset.idea!] ?? 0), 0);
      const tag = $('[data-gstars]', g);
      if (tag) {
        tag.hidden = n === 0;
        tag.textContent = `★ ${n}`;
        tag.setAttribute('aria-label', `${n} ${n === 1 ? 'star' : 'stars'} placed`);
      }
    });
    const full = $('[data-full]', picker);
    if (full) full.hidden = left !== 0;
    const walk = $<HTMLButtonElement>('[data-walk-picks]', picker);
    if (walk) walk.disabled = used === 0;
  };

  const titleOf = (id: string) => $(`[data-idea="${id}"] b`, picker)?.textContent ?? id;
  const add = (id: string) => {
    if (starCount(picks) >= TOTAL_STARS) {
      say('All five stars are placed. Tap minus on an idea to move a star.');
      return;
    }
    picks.stars[id] = (picks.stars[id] ?? 0) + 1;
    savePicks(picks);
    render();
    say(
      `${titleOf(id)}: ${picks.stars[id]} of your stars. ${TOTAL_STARS - starCount(picks)} left.`,
    );
  };
  const remove = (id: string) => {
    const n = picks.stars[id] ?? 0;
    if (!n) return;
    if (n === 1) delete picks.stars[id];
    else picks.stars[id] = n - 1;
    savePicks(picks);
    render();
    say(`Took a star from ${titleOf(id)}. ${TOTAL_STARS - starCount(picks)} left.`);
  };
  $$<HTMLButtonElement>('[data-add]', picker).forEach((b) => {
    b.addEventListener('click', () => add(b.dataset.add!));
    b.addEventListener('keydown', (e) => {
      if (e.key === '-' || e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        remove(b.dataset.add!);
      } else if (e.key === '+') {
        e.preventDefault();
        add(b.dataset.add!);
      }
    });
  });
  $$<HTMLButtonElement>('[data-minus]', picker).forEach((b) =>
    b.addEventListener('click', () => {
      const id = b.dataset.minus!;
      remove(id);
      if (!picks.stars[id]) $<HTMLButtonElement>(`[data-add="${id}"]`, picker)?.focus();
    }),
  );
  $('[data-walk-picks]', picker)?.addEventListener('click', () => {
    const ids = orderedPicks(picks, IDEA_IDS);
    if (ids.length) location.href = tourHref(ids);
  });
  $('[data-clear-picks]', picker)?.addEventListener('click', () => {
    picks = { stars: {} };
    clearPicks();
    applyTeam();
    render();
    say('Your stars are cleared.');
    show('how');
  });

  applyTeam();
  render();
  // A returning visitor with stars goes straight to the groups.
  if (starCount(picks) > 0) {
    show('groups', false);
    const first = orderedPicks(picks, IDEA_IDS)[0];
    const g = $(`[data-idea="${first}"]`, picker)?.closest<HTMLElement>('[data-group]');
    g?.querySelector<HTMLButtonElement>('[data-group-btn]')?.click();
  } else show('how', false);
}

export function initHome(): void {
  try {
    initGreeting();
  } catch {
    /* a damaged link shows the normal page */
  }
  initPicker();
  window.addEventListener('hashchange', () => {
    if (location.hash.startsWith('#for=')) location.reload();
  });
}
