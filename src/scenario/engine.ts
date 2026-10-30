import type { Choice, Scenario, Step } from './types';

/**
 * Plays guided scenarios inside a `[data-demo]` element rendered by GuidedDemo.astro.
 *
 * Contract with the markup:
 * - `[data-screen="<name>"]` is shown when the current step's `screen` matches.
 * - `[data-choice="<id>"]` inside the visible screen is bound to the step's choice with that id.
 * - `[data-sc="<scenario id>"]` is shown only while that scenario plays.
 * - `[data-on-steps="a b"][data-on-class="cls"]` gets `cls` while the step is one of those listed.
 * - `[data-show-steps="a b"]` is shown only on those steps; `[data-hide-steps]` the reverse.
 * - `[data-var="key"]` gets the text of a recorded value; `[data-var-show="key=value"]` is shown
 *   only when it matches.
 * - Conversation screens fill `[data-transcript]` and `[data-answer]`.
 */

type Vars = Record<string, string>;

interface Visit {
  step: string;
  /** Values recorded on arrival at this step. */
  vars: Vars;
  /** The label the visitor picked to leave this step (for the transcript). */
  picked?: string;
}

export interface DemoData {
  ideaId: string;
  scenarios: Scenario[];
  ask: string;
  nextHref?: string;
  allHref: string;
}

const REDUCED = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Works for HTML and SVG elements alike (SVG has no `hidden` property). */
function hide(el: Element, on: boolean): void {
  el.toggleAttribute('hidden', on);
}

export function fill(text: string, vars: Vars): string {
  return text.replace(/\{\{(\w+)(?:\|([^}]*))?\}\}/g, (_m, k: string, d?: string) =>
    vars[k] !== undefined ? vars[k] : (d ?? ''),
  );
}

function plain(html: string): string {
  const d = document.createElement('div');
  d.innerHTML = html;
  d.querySelectorAll('sup').forEach((s) => s.remove());
  return (d.textContent ?? '').replace(/\s+/g, ' ').trim();
}

/** Fewest steps from `id` to any end step, following enabled choices. */
function distanceToEnd(sc: Scenario, id: string): number {
  const seen = new Set([id]);
  let frontier = [id];
  let d = 0;
  while (frontier.length) {
    const next: string[] = [];
    for (const f of frontier) {
      const s = sc.steps[f];
      if (s.end) return d;
      for (const c of s.choices) {
        if (!c.disabled && !seen.has(c.to)) {
          seen.add(c.to);
          next.push(c.to);
        }
      }
    }
    frontier = next;
    d++;
  }
  return 0;
}

export class Demo {
  private root: HTMLElement;
  private data: DemoData;
  private sc: Scenario | null = null;
  private history: Visit[] = [];
  private vars: Vars = {};
  private lanes = new Set<string>();
  private voice = false;
  private replayRaf = 0;
  private replayedFor = '';

  private els: {
    picker: HTMLElement;
    play: HTMLElement;
    narr: HTMLElement;
    narrText: HTMLElement;
    narrAction: HTMLElement;
    narrChoices: HTMLElement;
    narrStatus: HTMLElement;
    narrStep: HTMLElement;
    narrTag: HTMLElement;
    dots: HTMLElement;
    back: HTMLButtonElement;
    restart: HTMLButtonElement;
    voiceBtn: HTMLButtonElement;
    ending: HTMLElement;
    clock: HTMLElement[];
    title: HTMLElement;
  };

  constructor(root: HTMLElement, data: DemoData) {
    this.root = root;
    this.data = data;
    const q = <T extends HTMLElement>(sel: string) => root.querySelector(sel) as T;
    this.els = {
      picker: q('[data-picker]'),
      play: q('[data-play]'),
      narr: q('[data-narrator]'),
      narrText: q('[data-narr-text]'),
      narrAction: q('[data-narr-action]'),
      narrChoices: q('[data-narr-choices]'),
      narrStatus: q('[data-narr-status]'),
      narrStep: q('[data-narr-step]'),
      narrTag: q('[data-narr-tag]'),
      dots: q('[data-dots]'),
      back: q('[data-back]'),
      restart: q('[data-restart]'),
      voiceBtn: q('[data-voice]'),
      ending: q('[data-ending]'),
      clock: [...root.querySelectorAll<HTMLElement>('[data-clock]')],
      title: q('[data-sc-title]'),
    };
    this.bind();
  }

  private bind(): void {
    this.root
      .querySelectorAll<HTMLButtonElement>('[data-start]')
      .forEach((b) =>
        b.addEventListener('click', () => this.start(b.dataset.start as string, true)),
      );
    this.els.back.addEventListener('click', () => this.back());
    this.els.restart.addEventListener('click', () => this.sc && this.start(this.sc.id, true));
    this.root
      .querySelectorAll<HTMLButtonElement>('[data-choose-other]')
      .forEach((b) => b.addEventListener('click', () => this.showPicker(true)));
    if (!('speechSynthesis' in window)) hide(this.els.voiceBtn, true);
    this.els.voiceBtn.addEventListener('click', () => {
      this.voice = !this.voice;
      this.els.voiceBtn.setAttribute('aria-pressed', String(this.voice));
      this.els.voiceBtn.querySelector('[data-voice-label]')!.textContent = this.voice
        ? 'Voice: on'
        : 'Voice: off';
      if (this.voice) this.speakCurrent();
      else this.hush();
    });
    this.root.querySelectorAll<HTMLElement>('[data-choice]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.pick(el.dataset.choice as string, el);
      });
      if (el.getAttribute('role') === 'button') {
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.pick(el.dataset.choice as string, el);
          }
        });
      }
    });
    this.root.querySelectorAll<HTMLButtonElement>('[data-lane]').forEach((b) =>
      b.addEventListener('click', () => {
        const k = b.dataset.lane as string;
        if (this.lanes.has(k)) this.lanes.delete(k);
        else this.lanes.add(k);
        b.setAttribute('aria-pressed', String(this.lanes.has(k)));
        this.syncChoices();
      }),
    );
    this.root.addEventListener('keydown', (e) => {
      if (!this.sc) return;
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea')) return;
      if (e.key === 'Backspace' && !this.els.back.disabled) {
        e.preventDefault();
        this.back();
      }
    });
  }

  /** Shows the scenario picker. */
  showPicker(focus = false): void {
    this.hush();
    this.sc = null;
    this.root.dataset.state = 'pick';
    hide(this.els.picker, false);
    hide(this.els.play, true);
    hide(this.els.ending, true);
    if (focus) this.els.picker.querySelector<HTMLElement>('h3, [data-start]')?.focus();
  }

  start(id: string, focus = false): void {
    const sc = this.data.scenarios.find((s) => s.id === id);
    if (!sc) return;
    this.sc = sc;
    this.history = [{ step: sc.start, vars: {} }];
    this.vars = {};
    this.setLanes([]);
    this.replayedFor = '';
    this.root.dataset.state = 'play';
    this.root.dataset.scenario = sc.id;
    hide(this.els.picker, true);
    hide(this.els.play, false);
    this.els.title.textContent = sc.title;
    this.root.querySelectorAll<HTMLElement>('[data-sc]').forEach((el) => {
      hide(el, el.dataset.sc !== sc.id);
    });
    this.root.querySelectorAll<HTMLElement>('[data-other-sc]').forEach((el) => {
      const other = this.data.scenarios.find((s) => s.id !== sc.id);
      hide(el, !other);
      if (other) el.dataset.otherSc = other.id;
    });
    this.render();
    if (focus) {
      const grid = this.root.querySelector<HTMLElement>('.play-grid') ?? this.els.play;
      grid.scrollIntoView({ block: 'start', behavior: REDUCED() ? 'auto' : 'smooth' });
      this.els.narr.focus({ preventScroll: true });
    }
  }

  private get step(): Step {
    const sc = this.sc as Scenario;
    return sc.steps[this.history[this.history.length - 1].step];
  }

  private back(): void {
    if (this.history.length < 2) return;
    this.history.pop();
    const last = this.history[this.history.length - 1];
    last.picked = undefined;
    this.vars = { ...last.vars };
    if (this.step.widget === 'lanes') this.setLanes([]);
    this.render();
    this.els.narr.focus({ preventScroll: true });
  }

  private setLanes(keys: string[]): void {
    this.lanes = new Set(keys);
    this.root
      .querySelectorAll<HTMLElement>('[data-lane]')
      .forEach((b) =>
        b.setAttribute('aria-pressed', String(this.lanes.has(b.dataset.lane as string))),
      );
  }

  private laneText(): string {
    const order = ['Left', 'Middle', 'Right'].filter((l) => this.lanes.has(l));
    if (order.length === 3) return 'All three lanes';
    if (order.length === 0) return '';
    const names = order.map((l) => l.toLowerCase());
    const joined =
      names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`;
    return `${joined.charAt(0).toUpperCase()}${joined.slice(1)} lane${order.length > 1 ? 's' : ''}`;
  }

  private pick(choiceId: string, el?: HTMLElement): void {
    if (!this.sc) return;
    const step = this.step;
    const c = step.choices.find((ch) => ch.id === choiceId);
    const screen = el?.closest<HTMLElement>('[data-screen]');
    if (screen && screen.dataset.screen !== step.screen) return;
    if (!c || c.disabled) {
      this.status(c?.note ?? 'Not in this demo');
      return;
    }
    if (c.needs === 'lanes' && this.lanes.size === 0) {
      this.status('Tap at least one lane first, or Couldn’t tell.');
      return;
    }
    let label = fill(c.label, this.vars);
    if (c.needs === 'lanes') label = this.laneText();
    this.history[this.history.length - 1].picked = label;
    Object.assign(this.vars, c.set ?? {});
    if (c.needs === 'lanes') {
      this.vars.lanes = label;
      this.vars.laneKeys = [...this.lanes].join(' ');
    }
    this.history.push({ step: c.to, vars: { ...this.vars } });
    this.render();
    this.keepInView();
    // Keep keyboard users in the story: move focus to the narrator for the new step.
    this.els.narr.focus({ preventScroll: true });
  }

  /** Keeps the narrator and the phone on screen together after each step. */
  private keepInView(): void {
    const grid = this.root.querySelector<HTMLElement>('.play-grid');
    if (!grid) return;
    const top = grid.getBoundingClientRect().top;
    const bar = 64;
    if (Math.abs(top - bar) > 8 && window.innerWidth < 900) {
      window.scrollBy({ top: top - bar, behavior: 'auto' });
    } else if (window.innerWidth >= 900 && (top < 64 || top > window.innerHeight / 2)) {
      window.scrollBy({ top: top - 120, behavior: 'auto' });
    }
  }

  private status(msg: string): void {
    this.els.narrStatus.textContent = '';
    window.setTimeout(() => (this.els.narrStatus.textContent = msg), 30);
  }

  private render(): void {
    const sc = this.sc as Scenario;
    const step = this.step;
    const v = this.vars;
    this.root.dataset.step = step.id;
    this.els.narrStatus.textContent = '';

    // Screens
    this.root.querySelectorAll<HTMLElement>('[data-screen]').forEach((s) => {
      hide(s, s.dataset.screen !== step.screen);
    });
    this.root.querySelectorAll<HTMLElement>('[data-show-steps]').forEach((el) => {
      hide(el, !(el.dataset.showSteps as string).split(' ').includes(step.id));
    });
    this.root.querySelectorAll<HTMLElement>('[data-hide-steps]').forEach((el) => {
      hide(el, (el.dataset.hideSteps as string).split(' ').includes(step.id));
    });
    this.root.querySelectorAll<HTMLElement>('[data-on-steps]').forEach((el) => {
      const on = (el.dataset.onSteps as string).split(' ').includes(step.id);
      (el.dataset.onClass as string).split(' ').forEach((cls) => el.classList.toggle(cls, on));
    });
    this.root.querySelectorAll<HTMLElement>('[data-var]').forEach((el) => {
      el.textContent = v[el.dataset.var as string] ?? el.dataset.varDefault ?? '';
    });
    this.root.querySelectorAll<HTMLElement>('[data-var-show]').forEach((el) => {
      const [k, val] = (el.dataset.varShow as string).split('=');
      hide(el, v[k] !== val);
    });
    this.root.querySelectorAll<HTMLElement>('[data-lane-mini]').forEach((el) => {
      const keys = (v.laneKeys ?? '').split(' ');
      el.classList.toggle('closed', keys.includes(el.dataset.laneMini as string));
    });

    // Clock: the latest clock set along the path.
    let clock = '';
    for (const h of this.history) {
      const c = sc.steps[h.step].clock;
      if (c) clock = fill(c, v);
    }
    this.els.clock.forEach((el) => (el.textContent = clock));

    // Narrator
    this.els.narrText.innerHTML = fill(step.narrator, v);
    const action = step.action
      ? fill(step.action, v)
      : step.end
        ? 'The end of this scenario. What changed and the ask are below the phone.'
        : '';
    this.els.narrAction.textContent = action;
    hide(this.els.narrAction, !action);
    this.els.narrTag.textContent = step.tag === 'proposed' ? 'The idea' : 'Today';
    this.els.narrTag.dataset.tag = step.tag ?? 'today';
    this.els.back.disabled = this.history.length < 2;

    // Progress dots: steps taken, then the fewest steps left to an ending.
    const done = this.history.length;
    const left = distanceToEnd(sc, step.id);
    const total = done + left;
    this.els.narrStep.textContent = `Step ${done} of ${total}`;
    this.els.dots.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const d = document.createElement('span');
      d.className = i < done - 1 ? 'dot done' : i === done - 1 ? 'dot now' : 'dot';
      this.els.dots.appendChild(d);
    }

    this.renderConversation(step);
    this.syncChoices();
    this.renderEnding(step);
    this.maybeReplay(step);
    this.speakCurrent();
  }

  /** Binds on-screen targets and lists the remaining choices in the narrator. */
  private syncChoices(): void {
    if (!this.sc) return;
    const step = this.step;
    const v = this.vars;
    const screen = this.root.querySelector<HTMLElement>(`[data-screen="${step.screen}"]`);
    const onScreen = new Set<string>();
    this.root.querySelectorAll<HTMLElement>('[data-choice]').forEach((el) => {
      el.classList.remove('is-target');
      const inScreen = !!screen && screen.contains(el) && !el.closest('[hidden]');
      const c = inScreen ? step.choices.find((ch) => ch.id === el.dataset.choice) : undefined;
      if (inScreen && c) onScreen.add(c.id);
      const enabled = !!c && !c.disabled && !(c.needs === 'lanes' && this.lanes.size === 0);
      el.setAttribute('aria-disabled', String(!enabled));
      if (el.tagName !== 'BUTTON') el.setAttribute('tabindex', inScreen && c ? '0' : '-1');
      else (el as HTMLButtonElement).tabIndex = inScreen && c ? 0 : -1;
      const note = c?.disabled
        ? (c.note ?? 'Not in this demo')
        : !c && inScreen
          ? 'Not in this demo'
          : '';
      if (note) el.setAttribute('title', note);
      else el.removeAttribute('title');
      const base = el.dataset.label ?? el.textContent?.trim() ?? '';
      if (el.dataset.label || note)
        el.setAttribute('aria-label', note ? `${base} (${note})` : base);
      if (enabled && !step.end) el.classList.add('is-target');
    });

    // Narrator buttons for choices with nothing to tap on the phone.
    const box = this.els.narrChoices;
    box.innerHTML = '';
    const rest = step.choices.filter((c) => !onScreen.has(c.id));
    for (const c of rest) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn narr-choice' + (c.disabled ? '' : ' primary');
      b.textContent = fill(c.label, v);
      if (c.disabled) {
        b.setAttribute('aria-disabled', 'true');
        const n = document.createElement('span');
        n.className = 'not-in-demo';
        n.textContent = c.note ?? 'Not in this demo';
        b.append(' ', n);
      }
      b.addEventListener('click', () => this.pick(c.id));
      box.appendChild(b);
    }
    hide(box, rest.length === 0);
  }

  private renderConversation(step: Step): void {
    const sc = this.sc as Scenario;
    const screen = this.root.querySelector<HTMLElement>(`[data-screen="${step.screen}"]`);
    const tx = screen?.querySelector<HTMLElement>('[data-transcript]');
    if (!tx) return;
    tx.innerHTML = '';
    // Every visited conversation step adds the assistant's line, then the visitor's answer.
    this.history.forEach((h) => {
      const s = sc.steps[h.step];
      if (s.screen !== step.screen) return;
      if (s.say) this.bubble(tx, fill(s.say, h.vars), 'them');
      if (h.picked) this.bubble(tx, h.picked, 'me');
    });
    tx.scrollTop = tx.scrollHeight;
    const mode = this.vars.mode === 'text' ? 'text' : 'call';
    screen?.querySelectorAll<HTMLElement>('[data-mode]').forEach((el) => {
      hide(el, el.dataset.mode !== mode);
    });
  }

  private bubble(tx: HTMLElement, text: string, who: 'them' | 'me'): void {
    const d = document.createElement('p');
    d.className = `ph-bubble ${who}`;
    if (who === 'them') {
      const s = document.createElement('span');
      s.className = 'visually-hidden';
      s.textContent = 'Assistant: ';
      d.appendChild(s);
    } else {
      const s = document.createElement('span');
      s.className = 'visually-hidden';
      s.textContent = 'You: ';
      d.appendChild(s);
    }
    d.append(text);
    tx.appendChild(d);
  }

  private renderEnding(step: Step): void {
    const end = this.els.ending;
    if (!step.end) {
      hide(end, true);
      return;
    }
    hide(end, false);
    const changed = end.querySelector<HTMLElement>('[data-changed]');
    if (changed) changed.textContent = fill(step.changed ?? '', this.vars);
  }

  /** Animates the drive replay the first time a conversation opens. */
  private maybeReplay(step: Step): void {
    const screen = this.root.querySelector<HTMLElement>(`[data-screen="${step.screen}"]`);
    const svg = screen?.querySelector<SVGSVGElement>(`[data-replay="${this.sc?.id}"]`);
    if (!svg) return;
    const key = `${this.sc?.id}:${this.history.findIndex((h) => this.sc?.steps[h.step].screen === step.screen)}`;
    const car = svg.querySelector<SVGGElement>('[data-replay-car]');
    const path = svg.querySelector<SVGPathElement>('[data-replay-path]');
    const trace = svg.querySelector<SVGPathElement>('[data-replay-trace]');
    const cap = screen?.querySelector<HTMLElement>('[data-replay-cap]');
    const done = svg.querySelectorAll<SVGElement>('[data-replay-done]');
    if (!car || !path) return;
    const L = path.getTotalLength();
    const place = (k: number) => {
      const l = L * k;
      const p = path.getPointAtLength(l);
      const p2 = path.getPointAtLength(Math.min(L, l + 1));
      const ang = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI + 90;
      car.setAttribute(
        'transform',
        `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${ang.toFixed(1)})`,
      );
      if (trace) {
        trace.style.strokeDasharray = `${L}`;
        trace.style.strokeDashoffset = `${L * (1 - k)}`;
      }
    };
    const finish = () => {
      place(1);
      done.forEach((d) => d.classList.add('on'));
      if (cap) cap.textContent = cap.dataset.doneText ?? '';
    };
    if (this.replayedFor === key) {
      finish();
      return;
    }
    this.replayedFor = key;
    cancelAnimationFrame(this.replayRaf);
    done.forEach((d) => d.classList.remove('on'));
    if (cap) cap.textContent = 'Replaying your drive';
    if (REDUCED()) {
      finish();
      return;
    }
    const t0 = performance.now();
    const dur = 3200;
    const frame = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      place(1 - (1 - k) * (1 - k));
      if (k < 1) this.replayRaf = requestAnimationFrame(frame);
      else finish();
    };
    this.replayRaf = requestAnimationFrame(frame);
  }

  private speakCurrent(): void {
    if (!this.voice || !this.sc || !('speechSynthesis' in window)) return;
    const step = this.step;
    const parts = [plain(fill(step.narrator, this.vars))];
    if (step.say) parts.push(plain(fill(step.say, this.vars)));
    if (step.action) parts.push(fill(step.action, this.vars));
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(parts.join(' '));
      u.lang = 'en-GB';
      u.rate = 1;
      speechSynthesis.speak(u);
    } catch {
      /* speech unavailable */
    }
  }

  private hush(): void {
    try {
      if ('speechSynthesis' in window) speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
  }

  /** Test hook: the choices of the current step. */
  current(): { step: string; choices: Choice[] } | null {
    return this.sc ? { step: this.step.id, choices: this.step.choices } : null;
  }
}

export function mountDemos(): void {
  document.querySelectorAll<HTMLElement>('[data-demo]').forEach((root) => {
    const json = root.querySelector('script[type="application/json"][data-demo-data]');
    if (!json?.textContent) return;
    const data = JSON.parse(json.textContent) as DemoData;
    const demo = new Demo(root, data);
    root
      .querySelectorAll<HTMLButtonElement>('[data-other-sc]')
      .forEach((b) =>
        b.addEventListener('click', () => demo.start(b.dataset.otherSc as string, true)),
      );
    demo.showPicker();
    const narr = root.querySelector<HTMLElement>('[data-narrator]');
    if (narr && 'ResizeObserver' in window) {
      new ResizeObserver(() =>
        root.style.setProperty('--narr-h', `${Math.ceil(narr.getBoundingClientRect().height)}px`),
      ).observe(narr);
    }
    root.dataset.ready = 'true';
  });
}
