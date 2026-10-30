/** Idea pages: the personal-link greeting and the "Next pick" tour bar. */
import { IDEA_IDS, IDEA_META } from './ideas-meta';
import { greeting, parsePersonal } from '../lib/personal';
import { parseTour } from '../lib/picks';

const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');

export function initIdeaBars(): void {
  const box = document.querySelector<HTMLElement>('[data-ibars]');
  if (!box) return;
  const id = box.dataset.ibars!;

  try {
    const p = parsePersonal(location.hash, IDEA_IDS);
    const bar = box.querySelector<HTMLElement>('[data-greetbar]');
    if (p && bar) {
      bar.textContent = greeting(p);
      bar.hidden = false;
    }
  } catch {
    /* a damaged link shows the normal page */
  }

  const tour = parseTour(location.search, IDEA_IDS);
  const at = tour.indexOf(id);
  const bar = box.querySelector<HTMLElement>('[data-tourbar]');
  if (!bar || at < 0) return;
  const pos = bar.querySelector<HTMLElement>('[data-tour-pos]');
  if (pos) pos.textContent = `Your picks · ${at + 1} of ${tour.length}`;
  const next = bar.querySelector<HTMLAnchorElement>('[data-tour-next]');
  const end = bar.querySelector<HTMLElement>('[data-tour-end]');
  const nextId = tour[at + 1];
  if (next) {
    if (nextId) {
      next.href = `${base}${nextId}/?tour=${tour.join(',')}`;
      next.textContent = `Next pick: ${IDEA_META[nextId].num} ${IDEA_META[nextId].short}`;
    } else next.hidden = true;
  }
  if (end) end.hidden = !!nextId;
  const all = bar.querySelector<HTMLAnchorElement>('[data-tour-all]');
  if (all) all.href = `${base}#ideas`;
  bar.hidden = false;
}
