/*
 * Legacy Field Notes scenes: the Today and Proposed toggle, the moving pictures, each idea's own
 * controls, and the "Walk me through it" guided mode. It initialises every legacy scene block on
 * the page, so one import serves any page that renders LegacyScene.
 */
import { ICONS, STORY, type Spot, type StoryEntry } from './story-data';

type Fn = () => void;
type Geo = SVGGeometryElement;

interface Run {
  car: Element | null;
  spd: Element | null;
  ph: Element | null;
  d: number;
  wait: number;
}

/** Everything a scene keeps between frames. */
interface State {
  vis?: boolean;
  still?: boolean;
  moved?: number;
  ringed?: boolean;
  ringT?: number;
  paths?: Record<string, Geo | null>;
  carMap?: Record<string, Element | null>;
  traces?: { r: Element | null; s: Element | null };
  d?: number;
  ph?: number;
  acc?: number;
  jit?: number;
  jx?: number;
  jy?: number;
  ja?: number;
  glide?: { t0: number; dur: number } | null;
  kicks?: Record<number, number>;
  ccUpdate?: Fn;
  sensorOn?: boolean;
  live?: number;
  comfort?: number;
  calm?: number;
  p?: Geo | null;
  c?: Element | null;
  run?: { t: Run; p: Run };
  auto?: boolean;
  v?: number;
  t?: number;
  hold?: number;
  held?: boolean;
  apply?: (v: number) => void;
  setAuto?: (on: boolean) => void;
  rest?: Fn;
  cars?: Element[];
  early?: Element | null;
  after?: Element | null;
  lateEls?: Element[];
  earlyEls?: Element[];
  dotT?: Element | null;
  dotP?: Element | null;
  lfUpdate?: Fn;
  ciChoose?: (dir: string | null) => void;
  mqUpdate?: Fn;
  nodes?: Element[];
  i?: number;
  manual?: boolean;
}

interface Scene {
  init?: (b: HTMLElement) => void;
  onState?: (b: HTMLElement, state: string) => void;
  tick?: (b: HTMLElement, t: number, dt: number) => void;
}

const doc = document;
const root = doc.documentElement;
let reduce = false;
try {
  reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
} catch {
  reduce = false;
}

const STATES = new WeakMap<HTMLElement, State>();
function st(b: HTMLElement): State {
  let s = STATES.get(b);
  if (!s) {
    s = {};
    STATES.set(b, s);
  }
  return s;
}

function $<T extends Element = HTMLElement>(sel: string, el?: ParentNode | null): T | null {
  return (el || doc).querySelector<T>(sel);
}
function $$<T extends Element = HTMLElement>(sel: string, el?: ParentNode | null): T[] {
  return Array.prototype.slice.call((el || doc).querySelectorAll<T>(sel));
}
function safe(fn: Fn): void {
  try {
    fn();
  } catch {
    /* keep the rest of the page working */
  }
}
function now(): number {
  return window.performance && performance.now ? performance.now() : Date.now();
}

/* ---------- Helpers for moving things along paths ---------- */
function placeOnPath(el: Element | null, path: Geo | null | undefined, d: number, laneOffset = 0) {
  if (!el || !path || !path.getTotalLength) return null;
  const L = path.getTotalLength();
  const s = Math.max(0, Math.min(L, d * L));
  const p = path.getPointAtLength(s);
  let q: { x: number; y: number } = path.getPointAtLength(Math.min(L, s + 1));
  if (s + 1 > L) {
    const r = path.getPointAtLength(Math.max(0, s - 1));
    q = { x: p.x + (p.x - r.x), y: p.y + (p.y - r.y) };
  }
  let dx = q.x - p.x;
  let dy = q.y - p.y;
  const n = Math.sqrt(dx * dx + dy * dy) || 1;
  dx /= n;
  dy /= n;
  const x = p.x + dy * laneOffset;
  const y = p.y - dx * laneOffset;
  const ang = (Math.atan2(dx, -dy) * 180) / Math.PI;
  const sc = el.getAttribute('data-s');
  el.setAttribute(
    'transform',
    'translate(' +
      x.toFixed(2) +
      ' ' +
      y.toFixed(2) +
      ') rotate(' +
      ang.toFixed(1) +
      ')' +
      (sc ? ' scale(' + sc + ')' : ''),
  );
  return { x, y, dx, dy };
}
function hash01(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
function traceValue(kind: string, n: number): number {
  let v: number;
  if (kind === 'r') {
    v = Math.sin(n * 0.9) * 1.6 + (hash01(n) - 0.5) * 3.0;
    if (hash01(n * 0.37 + 3.1) > 0.9) v += (hash01(n + 7.7) - 0.5) * 26;
  } else {
    v = Math.sin(n * 0.33) * 1.3 + (hash01(n) - 0.5) * 0.9;
  }
  return Math.max(-16, Math.min(16, v));
}
function tracePoints(
  kind: string,
  x0: number,
  x1: number,
  base: number,
  phase: number,
  kicks: Record<number, number> | undefined,
  quiet: boolean | undefined,
): string {
  const pts: string[] = [];
  for (let i = 0, x = x0; x <= x1 + 0.01; i++, x += 2) {
    const v = (quiet ? 0 : traceValue(kind, i + phase)) + ((kicks && kicks[i + phase]) || 0);
    pts.push(x.toFixed(0) + ',' + (base - Math.max(-16, Math.min(16, v))).toFixed(1));
  }
  return pts.join(' ');
}
function lerpProfile(prof: number[][], d: number): number {
  if (d <= prof[0][0]) return prof[0][1];
  for (let i = 1; i < prof.length; i++) {
    if (d <= prof[i][0]) {
      const a = prof[i - 1];
      const b = prof[i];
      return a[1] + ((b[1] - a[1]) * (d - a[0])) / (b[0] - a[0]);
    }
  }
  return prof[prof.length - 1][1];
}
function lineAt(pts: number[][], x: number): number {
  return lerpProfile(pts, x);
}
function isProposed(b: HTMLElement): boolean {
  return b.getAttribute('data-state') === 'proposed';
}

/* ---------- Scenes ---------- */
const SCENES: Record<string, Scene> = {};

SCENES['cabin-comfort'] = {
  init(b) {
    const s = st(b);
    const sl = $<HTMLInputElement>('#cc-slider', b);
    const out = $('[data-cc-out]', b);
    s.paths = { '1': $<Geo>('[data-path="1"]', b), '2': $<Geo>('[data-path="2"]', b) };
    s.carMap = { '1': $('[data-a="r1"]', b), '2': $('[data-a="r2"]', b) };
    s.traces = { r: $('.trace-r', b), s: $('.trace-s', b) };
    s.d = 0.45;
    s.ph = 0;
    s.acc = 0;
    s.jit = 0;
    s.jx = 0;
    s.jy = 0;
    s.ja = 0;
    s.ccUpdate = () => {
      if (!sl) return;
      const pick = +sl.value >= 50 ? '2' : '1';
      if (isProposed(b)) b.setAttribute('data-pick', pick);
      if (out)
        out.textContent =
          pick === '2'
            ? 'Smoothest: route 2, +4 min, comfort 8/10 vs 3/10'
            : 'Fastest: route 1, 18 min, comfort 3/10';
    };
    if (sl)
      sl.addEventListener('input', () => {
        s.glide = null;
        s.ccUpdate?.();
      });
    s.kicks = {};
    safe(() => feelDemo(b));
  },
  onState(b, state) {
    const s = st(b);
    const sl = $<HTMLInputElement>('#cc-slider', b);
    if (!sl) return;
    if (state === 'proposed') {
      if (reduce) {
        sl.value = '100';
        s.ccUpdate?.();
        return;
      }
      sl.value = '0';
      s.ccUpdate?.();
      s.glide = { t0: now() + 300, dur: 1000 };
    } else {
      s.glide = null;
      sl.value = '100';
      b.removeAttribute('data-pick');
      s.ccUpdate?.();
    }
  },
  tick(b, t, dt) {
    const s = st(b);
    const sl = $<HTMLInputElement>('#cc-slider', b);
    if (s.glide && sl) {
      let k = (t - s.glide.t0) / s.glide.dur;
      if (k >= 0) {
        k = Math.min(1, k);
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        sl.value = String(Math.round(100 * e));
        s.ccUpdate?.();
        if (k >= 1) s.glide = null;
      }
    }
    const rough = b.getAttribute('data-state') === 'today' || b.getAttribute('data-pick') === '1';
    const key = rough ? '1' : '2';
    const path = s.paths?.[key];
    const car = s.carMap?.[key];
    if (path && car) {
      const L = path.getTotalLength();
      s.d = ((s.d || 0) + ((dt / 1000) * (rough ? 30 : 34)) / L) % 1;
      const pos = placeOnPath(car, path, s.d, 0);
      if (pos && rough) {
        s.jit = (s.jit || 0) + dt;
        if (s.jit > 70) {
          s.jit = 0;
          s.jx = (Math.random() - 0.5) * 2.6;
          s.jy = (Math.random() - 0.5) * 2.6;
          s.ja = (Math.random() - 0.5) * 9;
        }
        const tr = (car.getAttribute('transform') || '').replace(
          /translate\(([-\d.]+) ([-\d.]+)\) rotate\(([-\d.]+)\)/,
          (_m, x: string, y: string, a: string) =>
            'translate(' +
            (+x + (s.jx || 0)).toFixed(2) +
            ' ' +
            (+y + (s.jy || 0)).toFixed(2) +
            ') rotate(' +
            (+a + (s.ja || 0)).toFixed(1) +
            ')',
        );
        car.setAttribute('transform', tr);
      }
    }
    s.acc = (s.acc || 0) + dt;
    if (s.acc > 60) {
      s.acc = 0;
      s.ph = (s.ph || 0) + 1;
      const kicks = s.kicks || (s.kicks = {});
      if (s.sensorOn)
        kicks[s.ph + 119] = (s.ph % 2 ? 1 : -1) * (s.live || 0) * (0.6 + Math.random() * 0.4);
      if (s.ph % 60 === 0) {
        for (const kk in kicks) {
          if (+kk < s.ph) delete kicks[+kk];
        }
      }
      const line = rough ? s.traces?.r : s.traces?.s;
      if (line)
        line.setAttribute(
          'points',
          tracePoints(rough ? 'r' : 's', 66, 304, 202, s.ph, kicks, s.sensorOn),
        );
    }
  },
};

/* Feel it: a simulated bump always works; the phone's own motion sensor is offered only where the
   browser has one, and only asked for on a tap. Any refusal or silence keeps the simulated button. */
function feelDemo(b: HTMLElement): void {
  const s = st(b);
  const feel = $('[data-feel]', b);
  if (!feel) return;
  const phone = $('[data-feel-phone]', feel);
  const scoreEl = $('[data-feel-score]', feel);
  const noteEl = $('[data-feel-note]', feel);
  const bumpBtn = $<HTMLButtonElement>('[data-feel-bump]', feel);
  const sensorBtn = $<HTMLButtonElement>('[data-feel-sensor]', feel);
  let recover = 0;
  let noData = 0;
  let ema = 0;
  let gotMotion = false;
  let lastDraw = 0;
  let shakeT = 0;
  s.comfort = 9;
  function setScore(n: number) {
    s.comfort = Math.max(0, Math.min(10, Math.round(n)));
    if (scoreEl) scoreEl.textContent = String(s.comfort);
  }
  function note(msg: string) {
    if (noteEl) {
      noteEl.textContent = msg || '';
      noteEl.hidden = !msg;
    }
  }
  function redraw() {
    const rough = b.getAttribute('data-state') === 'today' || b.getAttribute('data-pick') === '1';
    const line = rough ? s.traces?.r : s.traces?.s;
    if (line)
      line.setAttribute(
        'points',
        tracePoints(rough ? 'r' : 's', 66, 304, 202, s.ph || 0, s.kicks, s.sensorOn),
      );
  }
  function shake() {
    if (!phone) return;
    phone.classList.remove('is-shaking');
    void phone.getBoundingClientRect();
    phone.classList.add('is-shaking');
    clearTimeout(shakeT);
    shakeT = window.setTimeout(() => phone.classList.remove('is-shaking'), 700);
  }
  if (bumpBtn)
    bumpBtn.addEventListener('click', () => {
      const p = (s.ph || 0) + 117;
      const kicks = s.kicks || (s.kicks = {});
      kicks[p] = 6;
      kicks[p + 1] = -12;
      kicks[p + 2] = 16;
      kicks[p + 3] = -10;
      kicks[p + 4] = 5;
      shake();
      setScore(3);
      clearInterval(recover);
      recover = window.setInterval(() => {
        if (s.sensorOn || (s.comfort || 0) >= 9) {
          clearInterval(recover);
          return;
        }
        setScore((s.comfort || 0) + 1);
      }, 400);
      redraw();
      if (s.still) setStill(b, false);
      kick();
      if (reduce) {
        clearTimeout(s.calm);
        s.calm = window.setTimeout(() => {
          s.kicks = {};
          redraw();
        }, 1800);
      }
    });
  const hasDM = typeof window.DeviceMotionEvent !== 'undefined';
  let coarse = false;
  try {
    coarse = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  } catch {
    coarse = false;
  }
  if (!sensorBtn || !hasDM || !coarse) return;
  const btn = sensorBtn;
  btn.hidden = false;
  function onMotion(e: DeviceMotionEvent) {
    let a = e.acceleration;
    let g = false;
    if (!a || a.x == null) {
      a = e.accelerationIncludingGravity;
      g = true;
    }
    if (!a || a.x == null) return;
    gotMotion = true;
    let m = Math.sqrt((a.x || 0) * (a.x || 0) + (a.y || 0) * (a.y || 0) + (a.z || 0) * (a.z || 0));
    if (g) m = Math.abs(m - 9.81);
    ema = ema * 0.7 + m * 0.3;
    s.live = Math.min(16, ema * 1.6);
    setScore(10 - ema * 1.2);
    if (reduce) {
      const t = Date.now();
      if (t - lastDraw > 250) {
        lastDraw = t;
        s.ph = (s.ph || 0) + 1;
        (s.kicks || (s.kicks = {}))[s.ph + 119] = (s.ph % 2 ? 1 : -1) * s.live;
        redraw();
      }
    }
  }
  function stop(msg: string) {
    try {
      window.removeEventListener('devicemotion', onMotion);
    } catch {
      /* ignore */
    }
    clearTimeout(noData);
    s.sensorOn = false;
    s.live = 0;
    s.kicks = {};
    btn.textContent = 'Use this phone’s motion sensor';
    btn.setAttribute('aria-pressed', 'false');
    setScore(9);
    redraw();
    note(msg || '');
  }
  function start() {
    gotMotion = false;
    ema = 0;
    window.addEventListener('devicemotion', onMotion);
    s.sensorOn = true;
    btn.textContent = 'Stop using the motion sensor';
    btn.setAttribute('aria-pressed', 'true');
    note('Shake the phone gently and watch the trace.');
    kick();
    clearTimeout(noData);
    noData = window.setTimeout(() => {
      if (!gotMotion) stop('No motion data from this device, so Feel a bump stays.');
    }, 1500);
  }
  btn.setAttribute('aria-pressed', 'false');
  btn.addEventListener('click', () => {
    if (s.sensorOn) {
      stop('');
      return;
    }
    const DM = window.DeviceMotionEvent as unknown as
      { requestPermission?: () => Promise<string> } | undefined;
    try {
      if (DM && typeof DM.requestPermission === 'function') {
        DM.requestPermission().then(
          (r) => {
            if (r === 'granted') start();
            else note('Motion data was not shared, so Feel a bump stays.');
          },
          () => note('Motion data is not available here, so Feel a bump stays.'),
        );
      } else if (DM) start();
    } catch {
      note('Motion data is not available here, so Feel a bump stays.');
    }
  });
}

/* Notifications that clear themselves: one example lock screen from Wednesday 07:20 to Sunday 00:45. */
const NT_KNOTS = [
  [0, 440],
  [60, 1110],
  [80, 1980],
  [100, 5805],
];
const NT_DAYS = ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
function ntMinutes(v: number): number {
  return Math.round(lerpProfile(NT_KNOTS, v));
}
function hhmm(t: number): string {
  const m = t % 1440;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm;
}
/** The first reminder's leave-by time, in minutes from Wednesday 00:00. */
let ntFirstExp = 0;
SCENES['notifications'] = {
  init(b) {
    const s = st(b);
    const sc = $<HTMLInputElement>('#nt-clock', b);
    const play = $('#nt-play', b);
    const out = $('[data-nt-out]', b);
    const timeEl = $('[data-nt-time]', b);
    const dayEl = $('[data-nt-day]', b);
    const clearEl = $('[data-nt-clear]', b);
    const items = $$<SVGGElement>('.nt', b).map((g) => ({
      el: g,
      post: +(g.getAttribute('data-post') || 0),
      exp: +(g.getAttribute('data-exp') || 0),
      y: 0,
    }));
    ntFirstExp = items.reduce(
      (m, it) => (it.post < m.post ? it : m),
      items[0] || { post: 0, exp: 0 },
    ).exp;
    s.auto = false;
    s.v = 100;
    function label() {
      if (play) {
        play.setAttribute('aria-pressed', s.auto ? 'true' : 'false');
        play.textContent = s.auto ? 'Pause' : 'Play';
      }
    }
    s.apply = (v: number) => {
      s.v = v;
      if (sc && +sc.value !== Math.round(v)) sc.value = String(Math.round(v));
      const t = ntMinutes(v);
      const proposed = isProposed(b);
      s.t = t;
      const shown = items
        .filter((it) => it.post <= t && (!proposed || t < it.exp))
        .sort((x, y) => y.post - x.post);
      items.forEach((it) => {
        const k = shown.indexOf(it);
        if (k >= 0) {
          it.y = 78 + k * 34;
          it.el.style.transform = 'translateY(' + it.y + 'px)';
          it.el.style.opacity = '1';
        } else if (it.post > t) {
          it.el.style.transform = 'translateY(44px)';
          it.el.style.opacity = '0';
        } else if (proposed) {
          it.el.style.transform = 'translate(60px, ' + (it.y || 78) + 'px)';
          it.el.style.opacity = '0';
        } else it.el.style.opacity = '0';
      });
      const day = Math.min(4, Math.floor(t / 1440));
      const when = NT_DAYS[day] + ' ' + hhmm(t);
      if (timeEl) timeEl.textContent = hhmm(t);
      if (dayEl) dayEl.textContent = NT_DAYS[day].toUpperCase();
      if (clearEl) clearEl.classList.toggle('sv-off', !(proposed && shown.length === 0));
      if (out)
        out.textContent =
          when +
          ': ' +
          (shown.length === 0
            ? 'nothing out of date'
            : shown.length + (shown.length === 1 ? ' notification' : ' notifications'));
      if (sc) sc.setAttribute('aria-valuetext', when);
    };
    s.setAuto = (on: boolean) => {
      s.auto = !!on && !reduce;
      if (s.auto && (s.v || 0) >= 100) s.v = 0;
      label();
      if (s.auto) kick();
    };
    /* Rest frames: Today shows Sunday with every stale reminder; Proposed replays the week once and holds. */
    s.rest = () => {
      if (isProposed(b) && !reduce) {
        s.auto = true;
        label();
        s.apply?.(0);
        kick();
      } else {
        s.auto = false;
        label();
        s.apply?.(100);
      }
    };
    if (sc)
      sc.addEventListener('input', () => {
        s.auto = false;
        label();
        s.apply?.(+sc.value);
      });
    if (play) play.addEventListener('click', () => s.setAuto?.(!s.auto));
    label();
    s.apply(s.v);
  },
  onState(b) {
    st(b).rest?.();
  },
  tick(b, _t, dt) {
    const s = st(b);
    if (!s.auto || !s.apply) return;
    let v = (s.v || 0) + (dt / 1000) * 28;
    if (v >= 100) {
      v = 100;
      s.auto = false;
      const play = $('#nt-play', b);
      if (play) {
        play.setAttribute('aria-pressed', 'false');
        play.textContent = 'Play';
      }
    }
    s.apply(v);
  },
};

function pathCar(pathSel: string, carSel: string, speed: number, offset: number): Scene {
  return {
    init(b) {
      const s = st(b);
      s.p = $<Geo>(pathSel, b);
      s.c = $(carSel, b);
      s.d = 0.12;
    },
    tick(b, _t, dt) {
      const s = st(b);
      if (!s.p || !s.c) return;
      const L = s.p.getTotalLength();
      s.d = ((s.d || 0) + ((dt / 1000) * speed) / L) % 1;
      placeOnPath(s.c, s.p, s.d, offset);
    },
  };
}
SCENES['why-this-route'] = pathCar('[data-path="w"]', '[data-a="w"]', 34, 0);
SCENES['black-spots'] = pathCar('[data-path="bs"]', '[data-a="bs"]', 36, 4);

const BEND = {
  t: [
    [0, 50],
    [0.48, 50],
    [0.54, 46],
    [0.6, 27],
    [1, 30],
  ],
  p: [
    [0, 50],
    [0.22, 50],
    [0.38, 42],
    [0.5, 30],
    [0.6, 25],
    [1, 30],
  ],
};
SCENES['bump-speed'] = {
  init(b) {
    const s = st(b);
    s.p = $<Geo>('[data-path="b"]', b);
    s.run = {
      t: {
        car: $('[data-a="bt"]', b),
        spd: $('[data-spd="t"]', b),
        ph: $('.ph-t', b),
        d: 0.3,
        wait: 0,
      },
      p: {
        car: $('[data-a="bp"]', b),
        spd: $('[data-spd="p"]', b),
        ph: $('.ph-p', b),
        d: 0.42,
        wait: 0,
      },
    };
  },
  tick(b, _t, dt) {
    const s = st(b);
    if (!s.p || !s.run) return;
    (['t', 'p'] as const).forEach((k) => {
      const r = s.run![k];
      if (r.wait > 0) {
        r.wait -= dt;
        if (r.wait <= 0) r.d = 0;
        return;
      }
      const v = lerpProfile(BEND[k], r.d);
      r.d += (dt / 1000) * v * 0.0055;
      if (r.d >= 1) {
        r.d = 1;
        r.wait = 900;
      }
      placeOnPath(r.car, s.p, r.d, 0);
      if (r.spd) r.spd.textContent = String(Math.round(v));
      if (r.ph) {
        r.ph.setAttribute('cx', (168 + 134 * r.d).toFixed(1));
        r.ph.setAttribute('cy', (192 - 1.4 * v).toFixed(1));
      }
    });
  },
};

function playLabel(play: Element | null, on: boolean | undefined) {
  if (play) {
    play.setAttribute('aria-pressed', on ? 'true' : 'false');
    play.textContent = on ? 'Pause' : 'Play';
  }
}

SCENES['alert-timing'] = {
  init(b) {
    const s = st(b);
    const sc = $<HTMLInputElement>('#at-scrub', b);
    const play = $('#at-play', b);
    const out = $('[data-at-out]', b);
    s.cars = $$('[data-a="at"]', b);
    s.early = $('.prompt-early', b);
    s.after = $('.prompt-after', b);
    s.auto = !reduce;
    s.v = 8;
    s.hold = reduce ? 0 : now() + 2500;
    s.held = false;
    s.apply = (v: number) => {
      s.v = v;
      if (sc && +sc.value !== Math.round(v)) sc.value = String(Math.round(v));
      const x = 20 + v * 2.8;
      s.cars?.forEach((c) =>
        c.setAttribute('transform', 'translate(' + x.toFixed(1) + ' 89.5) rotate(90)'),
      );
      const early = x <= 120;
      const after = x >= 250;
      s.early?.classList.toggle('sv-off', !early);
      s.after?.classList.toggle('sv-off', !after);
      const today = !isProposed(b);
      if (out)
        out.textContent = today
          ? early
            ? 'Prompt shown about 10 km before the report'
            : 'No prompt here'
          : after
            ? 'Prompt shown just after passing the report'
            : 'No prompt yet: not passed';
    };
    s.setAuto = (on: boolean) => {
      s.auto = !!on && !reduce;
      playLabel(play, s.auto);
      if (s.auto) kick();
    };
    if (sc)
      sc.addEventListener('input', () => {
        s.auto = false;
        playLabel(play, s.auto);
        s.apply?.(+sc.value);
      });
    if (play)
      play.addEventListener('click', () => {
        s.auto = !s.auto;
        playLabel(play, s.auto);
        if (s.auto) kick();
      });
    playLabel(play, s.auto);
    s.apply(s.v);
  },
  onState(b, state) {
    const s = st(b);
    if (!s.apply) return;
    s.held = false;
    s.hold = reduce ? 0 : now() + (state === 'proposed' ? 0 : 2500);
    s.apply(state === 'proposed' ? (reduce ? 86 : 70) : 8);
  },
  tick(b, t, dt) {
    const s = st(b);
    if (!s.auto || !s.apply) return;
    if (s.hold && t < s.hold) return;
    const prop = isProposed(b);
    let v = (s.v || 0) + (dt / 1000) * 11;
    if (prop && !s.held && v >= 83) {
      s.held = true;
      s.hold = t + 2500;
      s.apply(83);
      return;
    }
    if (!prop && (s.v || 0) < 8 && v >= 8) {
      s.hold = t + 2500;
      s.apply(8);
      return;
    }
    if (v > 100) {
      v = prop ? 70 : 0;
      s.held = false;
    }
    s.apply(v);
  },
};

/* Where checks are frequent: the same drive with a late alert (Today) or an early, calm note (Proposed). */
const CP = {
  t: [
    [20, 154],
    [200, 154],
    [210, 166],
    [220, 182],
    [230, 178],
    [250, 165],
    [300, 154],
  ],
  p: [
    [20, 154],
    [80, 154],
    [130, 161],
    [170, 168],
    [270, 168],
    [300, 156],
  ],
};
SCENES['checkpoints'] = {
  init(b) {
    const s = st(b);
    const sc = $<HTMLInputElement>('#cp-scrub', b);
    const play = $('#cp-play', b);
    const out = $('[data-cp-out]', b);
    s.cars = $$('[data-a="cp"]', b);
    s.lateEls = $$('.cp-late', b);
    s.earlyEls = $$('.cp-early', b);
    s.dotT = $('.ph-t', b);
    s.dotP = $('.ph-p', b);
    s.auto = !reduce;
    s.v = reduce ? 66 : 64;
    s.hold = reduce ? 0 : now() + 2500;
    s.apply = (v: number) => {
      s.v = v;
      if (sc && +sc.value !== Math.round(v)) sc.value = String(Math.round(v));
      const x = 20 + v * 2.8;
      s.cars?.forEach((c) =>
        c.setAttribute('transform', 'translate(' + x.toFixed(1) + ' 95.5) rotate(90)'),
      );
      const late = x >= 196 && x <= 262;
      const early = x >= 50;
      s.lateEls?.forEach((el) => el.classList.toggle('sv-off', !late));
      s.earlyEls?.forEach((el) => el.classList.toggle('sv-off', !early));
      if (s.dotT) {
        s.dotT.setAttribute('cx', x.toFixed(1));
        s.dotT.setAttribute('cy', lineAt(CP.t, x).toFixed(1));
      }
      if (s.dotP) {
        s.dotP.setAttribute('cx', x.toFixed(1));
        s.dotP.setAttribute('cy', lineAt(CP.p, x).toFixed(1));
      }
      const today = !isProposed(b);
      if (out)
        out.textContent = today
          ? x < 196
            ? 'No warning yet'
            : late
              ? 'Police seen late: hard braking'
              : 'Past the check'
          : !early
            ? 'Approaching the stretch'
            : x < 170
              ? 'Calm note shown well ahead: easing down'
              : x <= 280
                ? 'Through the stretch at a steady, lower speed'
                : 'Past the stretch';
    };
    s.setAuto = (on: boolean) => {
      s.auto = !!on && !reduce;
      playLabel(play, s.auto);
      if (s.auto) kick();
    };
    if (sc)
      sc.addEventListener('input', () => {
        s.auto = false;
        playLabel(play, s.auto);
        s.apply?.(+sc.value);
      });
    if (play)
      play.addEventListener('click', () => {
        s.auto = !s.auto;
        playLabel(play, s.auto);
        if (s.auto) kick();
      });
    playLabel(play, s.auto);
    s.apply(s.v);
  },
  onState(b, state) {
    const s = st(b);
    if (!s.apply) return;
    const prop = state === 'proposed';
    s.hold = reduce ? 0 : now() + (prop ? 1500 : 2500);
    s.apply(prop ? (reduce ? 40 : 20) : reduce ? 66 : 64);
  },
  tick(b, t, dt) {
    const s = st(b);
    if (!s.auto || !s.apply) return;
    if (s.hold && t < s.hold) return;
    const prop = isProposed(b);
    let v = (s.v || 0) + (dt / 1000) * 9;
    if (!prop && (s.v || 0) < 64 && v >= 64) {
      s.hold = t + 2500;
      s.apply(64);
      return;
    }
    if (v > 100) v = prop ? 20 : 0;
    s.apply(v);
  },
};

SCENES['lane-followups'] = {
  init(b) {
    const s = st(b);
    const out = $('[data-lf-out]', b);
    const hud = $('[data-lf-hud]', b);
    const route = $('[data-lf-route]', b);
    const head = $('[data-lf-head]', b);
    const X: Record<string, number> = { left: 60, middle: 100, right: 140 };
    function update() {
      const blocked: Record<string, boolean> = {};
      $$('.pick[data-lane]', b).forEach((p) => {
        blocked[p.getAttribute('data-lane') || ''] = p.getAttribute('aria-pressed') === 'true';
      });
      $$('[data-lane]', b).forEach((el) => {
        if (!el.classList.contains('pick'))
          el.classList.toggle('on', !!blocked[el.getAttribute('data-lane') || '']);
      });
      const target = !blocked.middle
        ? 'middle'
        : !blocked.right
          ? 'right'
          : !blocked.left
            ? 'left'
            : null;
      if (route && head) {
        route.classList.toggle('sv-off', !target);
        head.classList.toggle('sv-off', !target);
        if (target) {
          const x = X[target];
          route.setAttribute(
            'd',
            target === 'middle'
              ? 'M100 168 L100 26'
              : 'M100 168 L100 150 C100 134 ' + x + ' 138 ' + x + ' 120 L' + x + ' 26',
          );
          head.setAttribute('points', x + ',18 ' + (x - 5.5) + ',28 ' + (x + 5.5) + ',28');
        }
      }
      const msg = !target
        ? 'All lanes blocked: road closed'
        : target === 'middle'
          ? 'Middle lane is clear'
          : 'Use the ' + target + ' lane';
      if (hud) hud.textContent = msg;
      if (out) out.textContent = 'Route: ' + msg.charAt(0).toLowerCase() + msg.slice(1);
    }
    $$('.pick[data-lane]', b).forEach((p) => {
      p.addEventListener('click', () => {
        p.setAttribute(
          'aria-pressed',
          p.getAttribute('aria-pressed') === 'true' ? 'false' : 'true',
        );
        update();
      });
    });
    s.lfUpdate = update;
    update();
  },
};

SCENES['closure-in-view'] = {
  init(b) {
    const s = st(b);
    const hud = $('[data-ci-hud]', b);
    const TEXT: Record<string, string> = {
      east: 'Eastbound only · sent',
      west: 'Westbound only · sent',
      both: 'Both directions · sent',
    };
    function choose(dir: string | null) {
      $$('.pick[data-dir]', b).forEach((p) =>
        p.setAttribute(
          'aria-pressed',
          !!dir && p.getAttribute('data-dir') === dir ? 'true' : 'false',
        ),
      );
      $$('.cl-x', b).forEach((r) => {
        const d = r.getAttribute('data-dir');
        r.classList.toggle('on', !!dir && (dir === 'both' || d === dir));
      });
      if (hud) hud.textContent = dir ? TEXT[dir] || TEXT.east : 'Which direction is closed?';
    }
    $$('.pick[data-dir]', b).forEach((p) =>
      p.addEventListener('click', () => choose(p.getAttribute('data-dir'))),
    );
    s.ciChoose = choose;
    choose('east');
  },
};

SCENES['mosques'] = {
  init(b) {
    const s = st(b);
    const sl = $<HTMLInputElement>('#mq-time', b);
    const sd = $<HTMLInputElement>('#mq-dist', b);
    if (!sl) return;
    const M = [
      { k: 'A', t: 772, d: 2, n: 'first' },
      { k: 'B', t: 792, d: 3, n: 'second' },
      { k: 'C', t: 811, d: 5, n: 'third' },
    ];
    const F = [
      { k: 'A', km: 60, d: 4, n: 'first' },
      { k: 'B', km: 150, d: 2, n: 'second' },
      { k: 'C', km: 240, d: 1, n: 'third' },
    ];
    const fmt = (m: number) => {
      const h = Math.floor(m / 60);
      const mm = m % 60;
      return h + ':' + (mm < 10 ? '0' : '') + mm;
    };
    const setText = (sel: string, t: string) => {
      const el = $(sel, b);
      if (el) el.textContent = t;
    };
    /* The deadline gate: the arrival time (or distance limit) laid along the route, through the stops' own positions. */
    const route = $<Geo>('[data-mq-route]', b);
    const gate = $('[data-mq-gate]', b);
    const flagG = $('[data-mq-flagg]', b);
    const flagR = $('[data-mq-flagr]', b);
    const flagT = $('[data-mq-flag]', b);
    const TX = [
      [750, 20],
      [772, 81],
      [792, 158],
      [811, 254],
      [840, 300],
    ];
    const KX = [
      [50, 24],
      [60, 59],
      [150, 130],
      [240, 270],
      [300, 300],
    ];
    function yAt(x: number) {
      if (!route || !route.getTotalLength) return 40;
      const L = route.getTotalLength();
      let lo = 0;
      let hi = L;
      let p = route.getPointAtLength(0);
      for (let k = 0; k < 22; k++) {
        const mid = (lo + hi) / 2;
        p = route.getPointAtLength(mid);
        if (p.x < x) lo = mid;
        else hi = mid;
      }
      return p.y;
    }
    /* What the flag must not cover: the stops and their time or distance labels. */
    const KEEP: Record<string, number[][]> = {
      time: [
        [81, 66, 12],
        [158, 26, 12],
        [254, 50, 12],
        [96, 66, 34, 14],
        [172, 10, 34, 14],
        [268, 44, 34, 14],
      ],
      dist: [
        [59, 72, 12],
        [130, 24, 12],
        [270, 52, 12],
        [71, 66, 40, 14],
        [142, 17, 44, 14],
        [280, 45, 38, 14],
      ],
    };
    function hits(box: number[], keep: number[][]) {
      return keep.some((k) => {
        if (k.length === 3) {
          const cx = Math.max(box[0], Math.min(k[0], box[0] + box[2]));
          const cy = Math.max(box[1], Math.min(k[1], box[1] + box[3]));
          return (cx - k[0]) * (cx - k[0]) + (cy - k[1]) * (cy - k[1]) < k[2] * k[2];
        }
        return (
          box[0] < k[0] + k[2] &&
          box[0] + box[2] > k[0] &&
          box[1] < k[1] + k[3] &&
          box[1] + box[3] > k[1]
        );
      });
    }
    function placeGate(x: number, label: string, mode: string) {
      if (!gate) return;
      const y = yAt(x);
      gate.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
      if (flagT) flagT.textContent = label;
      const w = Math.max(44, label.length * 5.6 + 10);
      const keep = KEEP[mode] || [];
      const spots = [
        [3, 13],
        [-w - 3, 13],
        [3, -25],
        [-w - 3, -25],
      ];
      let pick = spots[0];
      for (const sp of spots) {
        const bx = x + sp[0];
        const by = y + sp[1];
        if (bx < 2 || bx + w > 318 || by < 1) continue;
        if (!hits([bx, by, w, 13], keep)) {
          pick = sp;
          break;
        }
      }
      if (flagR) flagR.setAttribute('width', w.toFixed(1));
      if (flagG)
        flagG.setAttribute('transform', 'translate(' + pick[0].toFixed(1) + ' ' + pick[1] + ')');
    }
    function update() {
      const dist = b.getAttribute('data-mq-mode') === 'dist';
      $$('button[data-mq-mode]', b).forEach((btn) =>
        btn.setAttribute(
          'aria-pressed',
          (btn.getAttribute('data-mq-mode') === 'dist') === dist ? 'true' : 'false',
        ),
      );
      $$('[data-mq-panel]', b).forEach((p) => {
        p.hidden = (p.getAttribute('data-mq-panel') === 'dist') !== dist;
      });
      if (!dist) {
        const v = +sl!.value;
        let best: (typeof M)[number] | null = null;
        M.forEach((x) => {
          if (x.t <= v && (!best || x.t > best.t)) best = x;
        });
        const bm = best as (typeof M)[number] | null;
        $$('[data-m]', b).forEach((el) =>
          el.classList.toggle('on', !!bm && el.getAttribute('data-m') === bm.k),
        );
        M.forEach((x) =>
          $$('.mq-pin[data-m="' + x.k + '"]', b).forEach((el) =>
            el.classList.toggle('is-late', x.t > v),
          ),
        );
        placeGate(lerpProfile(TX, v), 'BY ' + fmt(v), 'time');
        setText('[data-mq-field]', 'Add a stop: Mosque · arrive by ' + fmt(v));
        setText('[data-mq-kind]', 'Mosque on your route');
        setText('[data-mq-note]', 'Congregation 13:30, set by the mosque');
        setText(
          '[data-mq-result]',
          bm
            ? '+' + bm.d + ' min detour · arrive ' + fmt(bm.t)
            : 'Nothing on the route before ' + fmt(M[0].t),
        );
        setText(
          '[data-mq-out]',
          'Arrive by ' +
            fmt(v) +
            ': ' +
            (bm
              ? bm.n + ' mosque on the route, arrive ' + fmt(bm.t) + ', +' + bm.d + ' min detour'
              : 'no mosque on the route before ' + fmt(M[0].t)),
        );
        sl!.setAttribute('aria-valuetext', fmt(v));
      } else {
        const lim = sd ? +sd.value : 200;
        let best: (typeof F)[number] | null = null;
        F.forEach((x) => {
          if (x.km <= lim && (!best || x.d < best.d)) best = x;
        });
        const bf = best as (typeof F)[number] | null;
        $$('[data-f]', b).forEach((el) =>
          el.classList.toggle('on', !!bf && el.getAttribute('data-f') === bf.k),
        );
        F.forEach((x) =>
          $$('.mq-pin[data-f="' + x.k + '"]', b).forEach((el) =>
            el.classList.toggle('is-late', x.km > lim),
          ),
        );
        placeGate(lerpProfile(KX, lim), 'WITHIN ' + lim + ' KM', 'dist');
        setText('[data-mq-field]', 'Add a stop: Fuel · within ' + lim + ' km');
        setText('[data-mq-kind]', 'Petrol station on your route');
        setText('[data-mq-note]', 'Smallest detour within your limit');
        setText(
          '[data-mq-result]',
          bf
            ? bf.km + ' km ahead · +' + bf.d + ' min detour'
            : 'Nothing on the route within ' + lim + ' km',
        );
        setText(
          '[data-mq-out]',
          'Fuel within ' +
            lim +
            ' km: ' +
            (bf
              ? bf.n + ' station on the route, ' + bf.km + ' km ahead, +' + bf.d + ' min detour'
              : 'no station on the route within ' + lim + ' km'),
        );
        if (sd) sd.setAttribute('aria-valuetext', lim + ' km');
      }
    }
    sl.addEventListener('input', update);
    if (sd) sd.addEventListener('input', update);
    $$('button[data-mq-mode]', b).forEach((btn) =>
      btn.addEventListener('click', () => {
        b.setAttribute('data-mq-mode', btn.getAttribute('data-mq-mode') || 'time');
        update();
      }),
    );
    s.mqUpdate = update;
    b.setAttribute('data-mq-mode', 'time');
    update();
  },
};

SCENES['matatu-dashcam'] = {
  init(b) {
    const s = st(b);
    s.nodes = $$('.node', b);
    s.i = 0;
    s.acc = 0;
  },
  onState(b, state) {
    if (state !== 'proposed') st(b).nodes?.forEach((n) => n.classList.remove('hl'));
  },
  tick(b, _t, dt) {
    const s = st(b);
    if (s.manual || !isProposed(b) || !s.nodes || !s.nodes.length) return;
    s.acc = (s.acc || 0) + dt;
    if (s.acc < 750) return;
    s.acc = 0;
    s.nodes.forEach((n, i) => n.classList.toggle('hl', i === s.i));
    s.i = ((s.i || 0) + 1) % s.nodes.length;
  },
};

/* ---------- Moving scenes stop after a while, with Pause and Replay ---------- */
const MOTION_MS = 15000;
let blocks: HTMLElement[] = [];
function motionOn(b: HTMLElement): boolean {
  const m = b.getAttribute('data-motion');
  return !!m && !reduce && (m === 'both' || b.getAttribute('data-state') === m);
}
function setStill(b: HTMLElement, still: boolean): void {
  const s = st(b);
  s.still = !!still;
  s.moved = 0;
  b.classList.toggle('is-still', s.still);
  const mb = $('.motion-btn', b);
  const lab = mb && $('.mb-label', mb);
  if (lab) lab.textContent = s.still ? 'Replay' : 'Pause';
  if (mb) {
    mb.setAttribute(
      'aria-label',
      s.still ? 'Replay the moving picture' : 'Pause the moving picture',
    );
    mb.title = s.still ? 'Replay' : 'Pause';
  }
  if (!s.still) kick();
}
function syncMotion(b: HTMLElement): void {
  if (!b.hasAttribute('data-motion')) return;
  b.classList.toggle('no-motion', !motionOn(b));
  setStill(b, false);
}

/* ---------- One spotlight ring on what changed, the first time a scene shows Proposed ---------- */
function ring(block: HTMLElement): void {
  const s = st(block);
  if (reduce || s.ringed) return;
  const svg = $('.scene svg', block);
  const el = svg ? $<SVGGraphicsElement>('[data-focus]', svg) : null;
  if (!el || !el.getBBox) return;
  s.ringed = true;
  let maxD = 0;
  $$('.sv-p', svg).forEach((g) => {
    let d = 0;
    try {
      d = parseFloat(getComputedStyle(g).getPropertyValue('--d')) || 0;
    } catch {
      d = 0;
    }
    if (d > maxD) maxD = d;
  });
  clearTimeout(s.ringT);
  s.ringT = window.setTimeout(
    () => {
      if (!isProposed(block) || !el.parentNode) return;
      let bb: DOMRect;
      try {
        bb = el.getBBox();
      } catch {
        return;
      }
      if (!bb || (!bb.width && !bb.height)) return;
      const ns = 'http://www.w3.org/2000/svg';
      const pad = 5;
      const w = bb.width + pad * 2;
      const h = bb.height + pad * 2;
      const g = doc.createElementNS(ns, 'g');
      const r = doc.createElementNS(ns, 'rect');
      g.setAttribute('class', 'spot-ring-g');
      const tr = el.getAttribute('transform');
      if (tr) g.setAttribute('transform', tr);
      r.setAttribute('class', 'spot-ring');
      r.setAttribute('x', (bb.x - pad).toFixed(1));
      r.setAttribute('y', (bb.y - pad).toFixed(1));
      r.setAttribute('width', w.toFixed(1));
      r.setAttribute('height', h.toFixed(1));
      r.setAttribute('rx', Math.min(14, h / 2).toFixed(1));
      g.appendChild(r);
      el.parentNode.insertBefore(g, el.nextSibling);
      window.setTimeout(() => g.remove(), 1100);
    },
    150 + maxD * 250 + 250,
  );
}

/* ---------- State toggles ---------- */
export function setState(block: HTMLElement | null, state: string): void {
  if (!block || (state !== 'today' && state !== 'proposed')) return;
  block.setAttribute('data-state', state);
  $$('.seg button', block).forEach((btn) =>
    btn.setAttribute('aria-pressed', btn.getAttribute('data-set') === state ? 'true' : 'false'),
  );
  const s = SCENES[block.getAttribute('data-scene') || ''];
  if (s && s.onState) safe(() => s.onState!(block, state));
  if (state === 'proposed') ring(block);
  else $$('.spot-ring-g', block).forEach((g) => g.remove());
  syncMotion(block);
  kick();
}

/* ---------- Animation loop (only for scenes on screen) ---------- */
let running = false;
let last = 0;
function frame(t: number): void {
  let any = false;
  const dt = last ? Math.min(64, t - last) : 16;
  last = t;
  if (!doc.hidden) {
    blocks.forEach((b) => {
      const s = st(b);
      if (!s.vis) return;
      const sc = SCENES[b.getAttribute('data-scene') || ''];
      if (motionOn(b)) {
        if (s.still) return;
        any = true;
        s.moved = (s.moved || 0) + dt;
        if (s.moved > MOTION_MS) {
          setStill(b, true);
          return;
        }
      }
      if (sc && sc.tick) {
        any = true;
        try {
          sc.tick(b, t, dt);
        } catch {
          /* skip this frame */
        }
      }
    });
  }
  if (any) window.requestAnimationFrame(frame);
  else {
    running = false;
    last = 0;
  }
}
function kick(): void {
  if (reduce || running || !window.requestAnimationFrame) return;
  running = true;
  last = 0;
  window.requestAnimationFrame(frame);
}

function initBlock(block: HTMLElement): void {
  if (block.hasAttribute('data-lg-ready')) return;
  block.setAttribute('data-lg-ready', '');
  safe(() => {
    const btns = $$<HTMLButtonElement>('.seg button', block);
    btns.forEach((btn, i) => {
      btn.addEventListener('click', () => setState(block, btn.getAttribute('data-set') || 'today'));
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const other = btns[(i + (e.key === 'ArrowRight' ? 1 : btns.length - 1)) % btns.length];
          if (other) {
            other.focus();
            setState(block, other.getAttribute('data-set') || 'today');
          }
        }
      });
    });
    const s = SCENES[block.getAttribute('data-scene') || ''];
    if (s && s.init) s.init(block);
    if (!reduce) $$('.scene, .mini', block).forEach((el) => el.classList.add('live'));
    const mb = $('[data-motion-btn]', block);
    if (mb) mb.addEventListener('click', () => setStill(block, !st(block).still));
    syncMotion(block);
  });
}

/* ======================================================================================
 * Walk me through it: one idea in short steps that follow its own sections, reusing its scene.
 * ====================================================================================== */

interface StoryIdea {
  id: string;
  num: string;
  title: string;
  known: string;
  problem: string;
  moment?: { text: string; shots?: { src: string; alt: string; caption: string }[] };
  also: string[];
  elsewhere: { text: string; gap?: boolean }[];
  questions: { q: string; a: string }[];
  why: string[];
  ask: string;
  teams: string[];
  sources: { n: number; label: string; url: string }[];
}
interface Cur {
  id: string;
  idea: StoryIdea;
  d: StoryEntry;
  block: HTMLElement;
  slot: HTMLElement;
  spots?: HTMLElement | null;
  undrag?: Fn | null;
  coach?: { box: HTMLElement; hint: HTMLElement; ok: HTMLElement } | null;
  done?: boolean;
  touched?: boolean;
  tapped?: boolean;
  lastHint?: string;
  seen?: Record<number, boolean>;
  seenCount?: number;
  nodeCount?: number;
  lit?: Record<string, boolean>;
}

const NAMES: Record<string, string> = {
  situation: 'The situation',
  try: 'Try it',
  uses: 'It would also',
  elsewhere: 'Already exists elsewhere',
  questions: 'Questions you will ask',
  why: 'Why it’s worth it',
  ask: 'The ask',
};
const SHORT: Record<string, string> = {
  situation: 'Situation',
  try: 'Try it',
  uses: 'Uses',
  elsewhere: 'Elsewhere',
  questions: 'Questions',
  why: 'Why',
  ask: 'Ask',
};
const MONTHS =
  'January|February|March|April|May|June|July|August|September|October|November|December';
const ICON_TAP =
  '<svg class="ic-tap" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/></svg>';
const ICON_CHECK =
  '<svg class="ic-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 12.5l4.2 4.2L18.5 8"/></svg>';

function make<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls?: string | null,
  text?: string | null,
): HTMLElementTagNameMap[K] {
  const n = doc.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}
function button(cls: string, text: string | null): HTMLButtonElement {
  const b = make('button', cls, text);
  b.type = 'button';
  return b;
}
function focusEl(n: Element | null | undefined): void {
  if (!n || !(n instanceof HTMLElement)) return;
  try {
    n.focus({ preventScroll: true });
  } catch {
    try {
      n.focus();
    } catch {
      /* ignore */
    }
  }
}

function initStory(dlg: HTMLDialogElement): void {
  const dataEl = $<HTMLScriptElement>('script[data-lg-story]');
  if (!dataEl) return;
  let idea: StoryIdea;
  try {
    idea = JSON.parse(dataEl.textContent || '{}') as StoryIdea;
  } catch {
    return;
  }
  const entry = STORY[idea.id];
  if (!entry) return;
  const ideaEl = $('[data-st-idea]', dlg);
  const barsEl = $('[data-st-bars]', dlg);
  const body = $('[data-st-body]', dlg);
  const col = $('[data-st-content]', dlg);
  const hold = $('[data-st-hold]', dlg);
  const live = $('[data-st-live]', dlg);
  const backBtn = $<HTMLButtonElement>('[data-st-back]', dlg);
  const nextBtn = $<HTMLButtonElement>('[data-st-next]', dlg);
  const nextLabel = $('[data-st-next-label]', dlg);
  if (!body || !col || !hold || !backBtn || !nextBtn) return;
  const stage = make('div', 'st-stage');
  hold.appendChild(stage);

  let step = 1;
  let end = false;
  let isOpen = false;
  let opener: HTMLElement | null = null;
  let fromHash = false;
  let cur: Cur | null = null;
  let revealT = 0;
  let countT: number[] = [];
  const mo =
    'MutationObserver' in window
      ? new MutationObserver(() => {
          if (isOpen && kindNow() === 'try') check();
        })
      : null;

  function plan(): string[] {
    const p = ['situation', 'try'];
    if (idea.also.length) p.push('uses');
    if (idea.elsewhere.length) p.push('elsewhere');
    if (idea.questions.length) p.push('questions');
    p.push(idea.why.length ? 'why' : 'ask');
    return p;
  }
  function kindNow(): string {
    return end ? 'end' : plan()[step - 1];
  }
  function lastStep(): number {
    return plan().length;
  }

  /* Superscripts open the source itself while the walkthrough is open. */
  function source(href: string) {
    const m = /-(\d+)$/.exec(href);
    const n = m ? +m[1] : -1;
    return idea.sources.find((x) => x.n === n) || null;
  }
  function linkCites(node: ParentNode): void {
    $$<HTMLAnchorElement>('a[href^="#src-"]', node).forEach((a) => {
      const s = source(a.getAttribute('href') || '');
      if (!s) return;
      a.setAttribute('data-fn-href', a.getAttribute('href') || '');
      a.setAttribute('href', s.url);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
      a.setAttribute('title', s.label);
      a.setAttribute('aria-label', 'Source: ' + s.label);
    });
  }
  function unlinkCites(node: ParentNode): void {
    $$<HTMLAnchorElement>('a[data-fn-href]', node).forEach((a) => {
      a.setAttribute('href', a.getAttribute('data-fn-href') || '');
      a.removeAttribute('data-fn-href');
      a.removeAttribute('target');
      a.removeAttribute('rel');
      a.removeAttribute('title');
      a.setAttribute('aria-label', 'Source ' + a.textContent);
    });
  }
  function htmlInto<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    cls: string,
    html: string,
  ): HTMLElementTagNameMap[K] {
    const n = make(tag, cls);
    n.innerHTML = html;
    linkCites(n);
    return n;
  }

  /* ---------- Borrow the page's scene, and give it back ---------- */
  function mount(): Cur | null {
    const block = $<HTMLElement>('.lg-scene .scene-block[data-scene="' + idea.id + '"]');
    if (!block || !block.parentNode) return null;
    const slot = make('span', 'scene-slot');
    slot.hidden = true;
    block.parentNode.insertBefore(slot, block);
    stage.appendChild(block);
    linkCites(block);
    if (mo) mo.observe(block, { attributes: true, attributeFilter: ['data-state', 'data-pick'] });
    return { id: idea.id, idea, d: entry, block, slot };
  }
  function unmount(): void {
    if (!cur) return;
    const c = cur;
    clearTry();
    if (mo) mo.disconnect();
    setState(c.block, 'today');
    resetScene(c);
    unlinkCites(c.block);
    if (c.slot.parentNode) {
      c.slot.parentNode.insertBefore(c.block, c.slot);
      c.slot.remove();
    }
    cur = null;
  }

  /* ---------- What each idea asks the visitor to try ---------- */
  const proposed = (c: Cur) => isProposed(c.block);
  function mark(c: Cur, sel: string) {
    const n = $(sel, c.block);
    if (n) n.classList.add('st-mark');
  }
  function laneSet(b: HTMLElement) {
    const s: Record<string, boolean> = {};
    $$('.pick[data-lane]', b).forEach((p) => {
      s[p.getAttribute('data-lane') || ''] = p.getAttribute('aria-pressed') === 'true';
    });
    return s;
  }
  function setLanes(b: HTMLElement, on: string[]) {
    $$('.pick[data-lane]', b).forEach((p) =>
      p.setAttribute(
        'aria-pressed',
        on.indexOf(p.getAttribute('data-lane') || '') >= 0 ? 'true' : 'false',
      ),
    );
    st(b).lfUpdate?.();
  }
  function mqReset(b: HTMLElement) {
    const s = $<HTMLInputElement>('#mq-time', b);
    const d = $<HTMLInputElement>('#mq-dist', b);
    b.setAttribute('data-mq-mode', 'time');
    if (s) s.value = '795';
    if (d) d.value = '200';
    st(b).mqUpdate?.();
  }
  function nodeText(n: Element) {
    return $$('.node-t.sv-p tspan', n)
      .map((t) => t.textContent)
      .join(' ');
  }
  function spots(
    c: Cur,
    list: Spot[] | undefined,
    onTap?: (s: Spot, i: number, btn: HTMLElement) => void,
  ) {
    const scene = $('.scene', c.block);
    const svg = scene ? $<SVGSVGElement>('svg', scene) : null;
    if (!scene || !svg || !list || !list.length) return;
    const vb = svg.viewBox && svg.viewBox.baseVal;
    const W = (vb && vb.width) || 320;
    const H = (vb && vb.height) || 200;
    const box = make('div', 'st-spots');
    list.forEach((s, i) => {
      const b: HTMLElement = s.passive
        ? make('span', 'st-spot is-passive')
        : button('st-spot', null);
      if (s.w) b.classList.add('is-rect');
      b.style.left = (s.x / W) * 100 + '%';
      b.style.top = (s.y / H) * 100 + '%';
      if (s.w && s.h) {
        b.style.width = (s.w / W) * 100 + '%';
        b.style.height = (s.h / H) * 100 + '%';
      }
      if (s.passive) b.setAttribute('aria-hidden', 'true');
      else {
        b.setAttribute('aria-label', s.label || 'Tap here');
        b.addEventListener('click', () => onTap && onTap(s, i, b));
      }
      if (s.icon) {
        const ic = make('span', 'st-spot-ic', s.icon);
        ic.setAttribute('aria-hidden', 'true');
        b.appendChild(ic);
      }
      box.appendChild(b);
    });
    scene.appendChild(box);
    c.spots = box;
  }
  /* Drag along the road: both drive scenes place the car at x = 20 + 2.8 v in SVG units. */
  function drag(c: Cur, ringY: number) {
    const b = c.block;
    const s = st(b);
    const scene = $('.scene', b);
    const svg = scene ? $<SVGSVGElement>('svg', scene) : null;
    if (!scene || !svg || !s.apply) return;
    const vb = svg.viewBox && svg.viewBox.baseVal;
    const W = (vb && vb.width) || 320;
    let on = false;
    scene.classList.add('st-drag');
    spots(c, [{ x: 20 + 2.8 * (s.v || 0), y: ringY, passive: true }]);
    const val = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      const x = ((e.clientX - r.left) / (r.width || 1)) * W;
      return Math.max(0, Math.min(100, (x - 20) / 2.8));
    };
    const down = (e: PointerEvent) => {
      if (e.button > 0) return;
      on = true;
      if (c.spots) c.spots.hidden = true;
      try {
        scene.setPointerCapture(e.pointerId);
      } catch {
        /* capture unsupported */
      }
      s.setAuto?.(false);
      s.apply?.(val(e));
      check();
      if (e.cancelable) e.preventDefault();
    };
    const move = (e: PointerEvent) => {
      if (!on) return;
      s.apply?.(val(e));
      check();
    };
    const up = () => {
      on = false;
    };
    scene.addEventListener('pointerdown', down);
    scene.addEventListener('pointermove', move);
    scene.addEventListener('pointerup', up);
    scene.addEventListener('pointercancel', up);
    c.undrag = () => {
      scene.classList.remove('st-drag');
      scene.removeEventListener('pointerdown', down);
      scene.removeEventListener('pointermove', move);
      scene.removeEventListener('pointerup', up);
      scene.removeEventListener('pointercancel', up);
    };
  }

  interface Kit {
    prep: (c: Cur) => void;
    ok: (c: Cur) => boolean;
    hint?: (c: Cur) => string;
    reset?: (c: Cur) => void;
  }
  const KIT: Record<string, Kit> = {
    'cabin-comfort': {
      prep(c) {
        const b = c.block;
        const s = $<HTMLInputElement>('#cc-slider', b);
        setState(b, 'proposed');
        st(b).glide = null;
        if (s) s.value = '0';
        st(b).ccUpdate?.();
        mark(c, '.controls');
      },
      ok: (c) => c.block.getAttribute('data-pick') === '2',
    },
    'alert-timing': {
      prep(c) {
        const b = c.block;
        setState(b, 'proposed');
        st(b).setAuto?.(false);
        st(b).apply?.(8);
        mark(c, '.controls');
        drag(c, 89.5);
      },
      ok: (c) =>
        proposed(c) && !!st(c.block).after && !st(c.block).after!.classList.contains('sv-off'),
      reset: (c) => st(c.block).setAuto?.(true),
    },
    checkpoints: {
      prep(c) {
        const b = c.block;
        setState(b, 'proposed');
        st(b).setAuto?.(false);
        st(b).apply?.(5);
        mark(c, '.controls');
        drag(c, 95.5);
      },
      ok: (c) => proposed(c) && (st(c.block).v || 0) >= 54,
      reset: (c) => st(c.block).setAuto?.(true),
    },
    notifications: {
      prep(c) {
        const b = c.block;
        setState(b, 'proposed');
        st(b).setAuto?.(false);
        st(b).apply?.(0);
        mark(c, '.controls');
      },
      ok: (c) => proposed(c) && (st(c.block).t || 0) > ntFirstExp,
      reset: (c) => st(c.block).rest?.(),
    },
    'lane-followups': {
      prep(c) {
        setState(c.block, 'proposed');
        setLanes(c.block, []);
        mark(c, '.controls');
      },
      ok(c) {
        const s = laneSet(c.block);
        return s.left && s.middle && !s.right;
      },
      hint(c) {
        const s = laneSet(c.block);
        return s.shoulder || s.left || s.middle || s.right ? c.d.hint || '' : '';
      },
      reset: (c) => setLanes(c.block, ['left', 'middle']),
    },
    'closure-in-view': {
      prep(c) {
        setState(c.block, 'proposed');
        st(c.block).ciChoose?.(null);
        mark(c, '.controls');
      },
      ok: (c) => $$('.pick[data-dir][aria-pressed="true"]', c.block).length > 0,
      reset: (c) => st(c.block).ciChoose?.('east'),
    },
    mosques: {
      prep(c) {
        setState(c.block, 'proposed');
        mqReset(c.block);
        mark(c, '.controls');
      },
      ok(c) {
        const o = $('[data-mq-out]', c.block);
        return (
          c.block.getAttribute('data-mq-mode') === 'dist' ||
          (!!c.touched && !!o && !/^Arrive by [0-9:]+: no /.test(o.textContent || ''))
        );
      },
      hint(c) {
        const o = $('[data-mq-out]', c.block);
        return c.touched && o && /^Arrive by [0-9:]+: no /.test(o.textContent || '')
          ? c.d.hint || ''
          : '';
      },
      reset: (c) => mqReset(c.block),
    },
    'matatu-dashcam': {
      prep(c) {
        const b = c.block;
        const nodes = $$('.node', b);
        setState(b, 'proposed');
        st(b).manual = true;
        nodes.forEach((n) => n.classList.remove('hl'));
        c.seen = {};
        c.seenCount = 0;
        c.nodeCount = nodes.length;
        spots(
          c,
          nodes.map((n, i) => {
            const r = $('.node-bg', n);
            return {
              x: +(r?.getAttribute('x') || 0),
              y: +(r?.getAttribute('y') || 0),
              w: +(r?.getAttribute('width') || 0),
              h: +(r?.getAttribute('height') || 0),
              label: 'Step ' + (i + 1) + ': ' + nodeText(n),
            };
          }),
          (_s, i, btn) => {
            nodes[i].classList.add('hl');
            btn.classList.add('is-done');
            if (!c.seen![i]) {
              c.seen![i] = true;
              c.seenCount = (c.seenCount || 0) + 1;
            }
            c.lastHint = c.seenCount + ' of ' + c.nodeCount + ': ' + nodeText(nodes[i]);
            check();
          },
        );
      },
      ok: (c) => (c.nodeCount || 0) > 0 && (c.seenCount || 0) >= (c.nodeCount || 0),
      hint: (c) => c.lastHint || '',
    },
    'partners-reach': {
      prep(c) {
        const b = c.block;
        setState(b, 'today');
        b.removeAttribute('data-lit');
        c.lit = {};
        spots(c, c.d.spots, (s, _i, btn) => {
          c.lit![s.lit || ''] = true;
          btn.classList.add('is-done');
          b.setAttribute('data-lit', Object.keys(c.lit!).join(' '));
          if (c.lit!.urban && c.lit!.rural) setState(b, 'proposed');
          check();
        });
      },
      ok: (c) => !!(c.lit && c.lit.urban && c.lit.rural),
      hint: (c) => (c.lit && (c.lit.urban || c.lit.rural) ? c.d.hint || '' : ''),
    },
    'quick-asks': {
      prep(c) {
        setState(c.block, 'today');
        stage.classList.add('show-seg');
        const p = $('.seg button[data-set="proposed"]', c.block);
        if (p) p.classList.add('st-pulse');
      },
      ok: proposed,
    },
  };
  const TAP: Kit = {
    prep(c) {
      setState(c.block, 'today');
      spots(c, c.d.spots, (_s, _i, btn) => {
        btn.classList.add('is-done');
        setState(c.block, 'proposed');
        check();
      });
    },
    ok: proposed,
  };
  const kit = (id: string): Kit => KIT[id] || TAP;
  function resetScene(c: Cur) {
    const k = kit(c.id);
    if (k.reset) safe(() => k.reset!(c));
  }
  function clearTry() {
    if (!cur) return;
    const c = cur;
    const b = c.block;
    c.spots?.remove();
    if (c.undrag) c.undrag();
    $$('.st-mark', b).forEach((n) => n.classList.remove('st-mark'));
    $$('.st-pulse', b).forEach((n) => n.classList.remove('st-pulse'));
    b.removeAttribute('data-lit');
    st(b).manual = false;
    stage.classList.remove('show-seg');
    c.spots = null;
    c.undrag = null;
    c.coach = null;
    c.done = c.touched = c.tapped = false;
    c.lastHint = '';
  }
  function check() {
    if (!cur || kindNow() !== 'try' || !cur.coach) return;
    const c = cur;
    const k = kit(c.id);
    let ok = false;
    try {
      ok = !!k.ok(c);
    } catch {
      ok = false;
    }
    if (c.done) return;
    if (ok) {
      c.done = true;
      c.coach!.box.setAttribute('data-done', 'true');
      c.coach!.hint.hidden = true;
      c.coach!.ok.hidden = false;
      nextBtn!.classList.add('is-ready');
      $$('.st-spot', c.block).forEach((s) => s.classList.add('is-done'));
      return;
    }
    const h = k.hint ? k.hint(c) : '';
    c.coach!.hint.textContent = h;
    c.coach!.hint.hidden = !h;
  }

  /* ---------- The steps ---------- */
  function eyebrow(kind: string) {
    const p = make('p', 'st-eyebrow');
    const num = make('span', 'st-num', String(step));
    num.setAttribute('aria-hidden', 'true');
    p.appendChild(num);
    p.appendChild(doc.createTextNode(NAMES[kind]));
    return p;
  }
  function heading(text: string, small: boolean) {
    const h = make('h2', 'st-title' + (small ? ' is-sm' : ''), text);
    h.id = 'lg-story-h';
    h.tabIndex = -1;
    return h;
  }
  function buildSituation(c: Cur) {
    col!.appendChild(eyebrow('situation'));
    col!.appendChild(heading(idea.title, false));
    /* First beat: something the viewer already knows, then the new problem. */
    const br = make('div', 'st-bridge');
    const kp = make('p', 'st-known');
    kp.appendChild(make('span', 'st-tag', 'You already know'));
    kp.appendChild(htmlInto('span', 'st-known-text', idea.known));
    br.appendChild(kp);
    const np = make('p', 'st-now');
    np.appendChild(make('span', 'st-tag is-now', 'Now'));
    np.appendChild(htmlInto('span', 'st-now-text', idea.problem));
    br.appendChild(np);
    col!.appendChild(br);
    const mom = idea.moment;
    if (mom) {
      const shots = mom.shots || [];
      const box = make(
        'div',
        'st-moment' + (shots.length ? '' : ' no-shot') + (shots.length > 1 ? ' two' : ''),
      );
      if (shots.length) {
        const sh = make('div', 'st-shots');
        shots.forEach((s) => {
          const k = button('shot', null);
          k.setAttribute('aria-label', 'Enlarge screenshot: ' + s.alt);
          k.setAttribute('aria-pressed', 'false');
          const img = make('img');
          img.src = s.src;
          img.alt = s.alt;
          img.loading = 'lazy';
          k.appendChild(img);
          k.addEventListener('click', () => {
            const on = !box.classList.contains('is-zoomed');
            box.classList.toggle('is-zoomed', on);
            $$('.shot', box).forEach((x) => x.setAttribute('aria-pressed', on ? 'true' : 'false'));
          });
          sh.appendChild(k);
        });
        box.appendChild(sh);
      }
      const w = make('div');
      w.appendChild(make('p', 'eyebrow', 'The moment'));
      const mt = htmlInto('p', 'st-moment-text', mom.text);
      shots.forEach((s) => mt.appendChild(make('span', 'st-cap', s.caption)));
      w.appendChild(mt);
      box.appendChild(w);
      col!.appendChild(box);
    }
    resetScene(c);
    setState(c.block, 'today');
    col!.appendChild(stage);
  }
  function buildTry(c: Cur) {
    col!.appendChild(eyebrow('try'));
    col!.appendChild(heading(idea.title, true));
    const box = make('div', 'st-coach');
    box.setAttribute('data-done', 'false');
    box.setAttribute('aria-live', 'polite');
    const ic = make('span', 'st-coach-ic');
    ic.setAttribute('aria-hidden', 'true');
    ic.innerHTML = ICON_TAP + ICON_CHECK;
    const txt = make('div', 'st-coach-txt');
    const hint = make('p', 'st-hint');
    const ok = make('p', 'st-ok', c.d.done || 'That’s it.');
    hint.hidden = true;
    ok.hidden = true;
    txt.appendChild(make('p', 'st-prompt', c.d.try || 'Tap Proposed.'));
    txt.appendChild(hint);
    txt.appendChild(ok);
    box.appendChild(ic);
    box.appendChild(txt);
    col!.appendChild(box);
    col!.appendChild(stage);
    c.coach = { box, hint, ok };
    c.done = false;
    c.touched = false;
    kit(c.id).prep(c);
  }
  function iconFor(
    c: Cur,
    part: 'uses' | 'elsewhere' | 'questions' | 'why',
    i: number,
    gap: boolean,
  ) {
    const names = (c.d.icons && c.d.icons[part]) || [];
    const name = gap ? 'not-found' : names[i] || 'document';
    const box = make('span', 'st-ic ic-' + name);
    box.setAttribute('aria-hidden', 'true');
    box.innerHTML =
      '<svg class="st-icn" viewBox="0 0 48 48" focusable="false">' + (ICONS[name] || '') + '</svg>';
    return box;
  }
  /* Text of an item without its footnote numbers, plus its sources as links that open in a new tab. */
  function sourced(html: string) {
    const c = make('div');
    c.innerHTML = html;
    const srcs: { url: string; label: string }[] = [];
    $$<HTMLAnchorElement>('sup.fn a', c).forEach((a) => {
      const s = source(a.getAttribute('href') || '');
      if (s && !srcs.some((x) => x.url === s.url)) srcs.push(s);
    });
    $$('sup.fn', c).forEach((x) => x.remove());
    let src: HTMLElement | null = null;
    if (srcs.length) {
      src = make('p', 'st-src', srcs.length > 1 ? 'Sources: ' : 'Source: ');
      srcs.forEach((x, i) => {
        if (i) src!.appendChild(doc.createTextNode(' · '));
        const a = make('a', '', x.label);
        a.href = x.url;
        a.target = '_blank';
        a.rel = 'noopener';
        src!.appendChild(a);
      });
    }
    return { html: c.innerHTML.trim(), src };
  }
  function itemCard(
    c: Cur,
    part: 'uses' | 'elsewhere' | 'why',
    html: string,
    i: number,
    gap: boolean,
  ) {
    const li = make('li', 'st-item' + (gap ? ' is-gap' : ''));
    li.appendChild(iconFor(c, part, i, gap));
    const bodyEl = make('div', 'st-item-body');
    if (gap) bodyEl.appendChild(make('p', 'st-gap-tag', 'Not found'));
    const t = sourced(html);
    const p = make('p', 'st-item-text');
    p.innerHTML = t.html;
    bodyEl.appendChild(p);
    if (t.src) bodyEl.appendChild(t.src);
    li.appendChild(bodyEl);
    return li;
  }
  /* Numbers in a fact count up when it appears; years, dates and times stay as they are. */
  function countables(p: HTMLElement | null) {
    if (!p) return;
    const walker = doc.createTreeWalker(p, NodeFilter.SHOW_TEXT, null);
    const nodes: Text[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);
    nodes.forEach((tn) => {
      const text = tn.nodeValue || '';
      const re = /(US\$|KSh )?(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?)(%?)/g;
      let m: RegExpExecArray | null;
      let lastI = 0;
      let hit = false;
      const frag = doc.createDocumentFragment();
      while ((m = re.exec(text))) {
        const num = m[2];
        const val = parseFloat(num.replace(/,/g, ''));
        const start = m.index;
        const endI = start + m[0].length;
        const before = text.slice(Math.max(0, start - 12), start);
        const after = text.slice(endI, endI + 12);
        const year = !m[3] && /^\d{4}$/.test(num) && val >= 1900 && val <= 2099;
        const date =
          new RegExp('^\\s(' + MONTHS + ')').test(after) ||
          new RegExp('(' + MONTHS + ')\\s$').test(before);
        const time = /^:\d/.test(after) || /\d:$/.test(before);
        const glued = /[A-Za-z]$/.test(before) || (!m[3] && /^[A-Za-z]/.test(after));
        if (year || date || time || glued || (val < 10 && !m[3])) continue;
        frag.appendChild(doc.createTextNode(text.slice(lastI, start)));
        const shown = make('span', 'st-count', m[0]);
        shown.setAttribute('aria-hidden', 'true');
        shown.setAttribute('data-to', String(val));
        shown.setAttribute('data-final', m[0]);
        frag.appendChild(shown);
        frag.appendChild(make('span', 'vh st-count-exact', m[0]));
        lastI = endI;
        hit = true;
      }
      if (!hit) return;
      frag.appendChild(doc.createTextNode(text.slice(lastI)));
      tn.parentNode?.replaceChild(frag, tn);
    });
  }
  function countUp(li: HTMLElement) {
    if (reduce) return;
    $$('.st-count', li).forEach((el) => {
      const to = +(el.getAttribute('data-to') || 0);
      const fin = el.getAttribute('data-final') || '';
      const m = /^(US\$|KSh )?([\d,]+(?:\.(\d+))?)(%?)$/.exec(fin);
      const pre = m ? m[1] || '' : '';
      const dec = m && m[3] ? m[3].length : 0;
      const pct = m ? m[4] : '';
      const commas = fin.indexOf(',') >= 0;
      let t0: number | null = null;
      const dur = 1100;
      const fmt = (v: number) => {
        let x = v.toFixed(dec);
        if (commas) x = x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return pre + x + pct;
      };
      const done = () => {
        const exact = el.nextSibling as HTMLElement | null;
        if (exact && exact.classList && exact.classList.contains('st-count-exact')) exact.remove();
        el.parentNode?.replaceChild(doc.createTextNode(fin), el);
      };
      el.textContent = fmt(0);
      const tickCount = (ts: number) => {
        if (!el.isConnected) return;
        if (t0 === null) t0 = ts;
        const k = Math.min(1, (ts - t0) / dur);
        const e = 1 - Math.pow(1 - k, 3);
        if (k < 1) {
          el.textContent = fmt(to * e);
          countT.push(requestAnimationFrame(tickCount));
        } else done();
      };
      countT.push(requestAnimationFrame(tickCount));
    });
  }
  function stopTimers() {
    clearInterval(revealT);
    revealT = 0;
    countT.forEach((t) => cancelAnimationFrame(t));
    countT = [];
  }
  /* Show items one at a time: on a gentle timer, or straight away with the button. */
  function revealAll(
    list: HTMLElement[],
    words: (shown: number) => string,
    onShow?: (el: HTMLElement, i: number) => void,
  ) {
    let shown = 0;
    let more: HTMLButtonElement | null = null;
    function showNext() {
      if (shown >= list.length) return;
      const el = list[shown];
      el.hidden = false;
      if (!reduce) el.classList.add('is-in');
      if (onShow) onShow(el, shown);
      shown += 1;
      if (more) {
        if (shown >= list.length) {
          more.hidden = true;
          clearInterval(revealT);
          revealT = 0;
        } else more.textContent = words(shown);
      }
    }
    if (reduce || list.length < 2) {
      list.forEach(() => showNext());
      return null;
    }
    list.forEach((el) => {
      el.hidden = true;
    });
    more = button('btn-quiet st-more', words(1));
    more.addEventListener('click', () => {
      clearInterval(revealT);
      const el = list[shown];
      showNext();
      if (el) {
        try {
          el.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
        } catch {
          /* older browsers */
        }
      }
      if (shown < list.length) revealT = window.setInterval(showNext, 2600);
    });
    showNext();
    revealT = window.setInterval(showNext, 2600);
    return more;
  }
  function skipLink() {
    const b = button('st-skip', 'Skip to the ask');
    b.addEventListener('click', () => {
      step = lastStep();
      render(1);
    });
    return b;
  }
  function listStep(
    c: Cur,
    kind: string,
    part: 'uses' | 'elsewhere',
    items: { html: string; gap: boolean }[],
    word: string,
  ) {
    col!.appendChild(eyebrow(kind));
    col!.appendChild(heading(idea.title, true));
    const ol = make('ol', 'st-items is-' + part);
    const list = items.map((n, i) => {
      const li = itemCard(c, part, n.html, i, n.gap);
      ol.appendChild(li);
      return li;
    });
    col!.appendChild(ol);
    const more = revealAll(list, () => word);
    const foot = make('div', 'st-step-foot');
    if (more) foot.appendChild(more);
    foot.appendChild(skipLink());
    col!.appendChild(foot);
  }
  function buildQuestions(c: Cur) {
    col!.appendChild(eyebrow('questions'));
    col!.appendChild(heading(idea.title, true));
    const ol = make('ol', 'st-items is-questions');
    idea.questions.forEach((qa, i) => {
      const qText = qa.q;
      const t = sourced(qa.a);
      const li = make('li', reduce ? 'st-qa' : 'st-flip');
      li.style.setProperty('--i', String(i));
      if (reduce) {
        li.appendChild(iconFor(c, 'questions', i, false));
        const b = make('div', 'st-item-body');
        b.appendChild(make('p', 'st-flip-q', qText));
        const ans = make('p', 'st-flip-a');
        ans.innerHTML = t.html;
        b.appendChild(ans);
        if (t.src) b.appendChild(t.src);
        li.appendChild(b);
        ol.appendChild(li);
        return;
      }
      const inner = make('div', 'st-flip-in');
      const front = button('st-face st-ffront', null);
      front.setAttribute('aria-expanded', 'false');
      front.appendChild(iconFor(c, 'questions', i, false));
      const ft = make('span', 'st-front-txt');
      ft.appendChild(make('span', 'st-flip-q', qText));
      ft.appendChild(make('span', 'st-flip-tap', 'Tap for the answer'));
      front.appendChild(ft);
      const back = make('div', 'st-face st-fback');
      back.tabIndex = -1;
      back.setAttribute('role', 'group');
      back.setAttribute('aria-label', 'Answer: ' + qText);
      back.appendChild(make('p', 'st-fback-q', qText));
      const ans2 = make('p', 'st-flip-a');
      ans2.innerHTML = t.html;
      back.appendChild(ans2);
      if (t.src) back.appendChild(t.src);
      const again = button('st-flip-back', 'Show the question');
      back.appendChild(again);
      /* A quarter turn, swap the faces, then turn back: each face keeps its own height. */
      const flip = (on: boolean) => {
        if (li.classList.contains('is-turning')) return;
        li.classList.add('is-turning');
        window.setTimeout(() => {
          front.hidden = on;
          back.hidden = !on;
          li.classList.toggle('is-flipped', on);
          front.setAttribute('aria-expanded', on ? 'true' : 'false');
          li.classList.remove('is-turning');
          focusEl(on ? back : front);
        }, 190);
      };
      back.hidden = true;
      front.addEventListener('click', () => flip(true));
      again.addEventListener('click', () => flip(false));
      inner.appendChild(front);
      inner.appendChild(back);
      li.appendChild(inner);
      ol.appendChild(li);
    });
    col!.appendChild(ol);
    const foot = make('div', 'st-step-foot');
    foot.appendChild(skipLink());
    col!.appendChild(foot);
  }
  function askBox() {
    const a = make('div', 'ask st-ask');
    a.appendChild(make('p', 'eyebrow', 'The ask'));
    a.appendChild(htmlInto('p', 'ask-text', idea.ask));
    const f = make('p', 'for', 'For: ');
    idea.teams.forEach((t, i) => {
      if (i) f.appendChild(doc.createTextNode(' · '));
      f.appendChild(make('b', null, t));
    });
    a.appendChild(f);
    return a;
  }
  function buildWhy(c: Cur, kind: string) {
    col!.appendChild(eyebrow(kind));
    col!.appendChild(heading(idea.title, true));
    const list: HTMLElement[] = [];
    if (kind === 'why') {
      const ol = make('ol', 'st-items is-why');
      idea.why.forEach((h, i) => {
        const li = itemCard(c, 'why', h, i, false);
        if (!reduce) countables($('.st-item-text', li));
        ol.appendChild(li);
        list.push(li);
      });
      col!.appendChild(ol);
    }
    const a = askBox();
    col!.appendChild(a);
    list.push(a);
    const factsN = list.length - 1;
    const more = revealAll(
      list,
      (shown) => (shown < factsN ? 'Next fact' : 'Show the ask'),
      (el) => {
        if (el.classList.contains('st-item')) countUp(el);
      },
    );
    if (more) {
      const foot = make('div', 'st-step-foot');
      foot.appendChild(more);
      col!.appendChild(foot);
    }
  }
  function buildEnd() {
    const wrap = make('div', 'st-end');
    const h = make('h2', 'st-title', 'End of the walkthrough');
    h.id = 'lg-story-h';
    h.tabIndex = -1;
    wrap.appendChild(h);
    wrap.appendChild(make('p', 'st-end-sub', idea.num + ' · ' + idea.title));
    const act = make('div', 'st-end-actions');
    const back = button('btn-primary', 'Back to the idea');
    const again = button('btn-quiet', 'Start again');
    back.addEventListener('click', () => close());
    again.addEventListener('click', () => {
      end = false;
      step = 1;
      render(-1);
    });
    act.appendChild(back);
    act.appendChild(again);
    wrap.appendChild(act);
    col!.appendChild(wrap);
  }

  /* ---------- Frame: progress, buttons, focus ---------- */
  function header() {
    if (ideaEl) ideaEl.textContent = end ? 'Walkthrough' : 'Idea ' + idea.num;
    if (barsEl) {
      const p = end ? [] : plan();
      barsEl.hidden = end;
      barsEl.style.setProperty('--n', String(p.length || 1));
      barsEl.textContent = '';
      p.forEach((k, i) => {
        const b = make(
          'span',
          'st-bar' + (i + 1 < step ? ' is-done' : i + 1 === step ? ' is-on' : ''),
        );
        b.appendChild(make('i'));
        b.appendChild(make('b', null, SHORT[k]));
        barsEl.appendChild(b);
      });
    }
  }
  function nav() {
    backBtn!.disabled = !end && step === 1;
    nextBtn!.hidden = end;
    nextBtn!.classList.remove('is-ready');
    if (nextLabel) nextLabel.textContent = step < lastStep() ? 'Next' : 'Finish';
  }
  function announce() {
    if (!live) return;
    const kind = kindNow();
    const msg = end
      ? 'End of the walkthrough.'
      : 'Step ' +
        step +
        ' of ' +
        lastStep() +
        ': ' +
        NAMES[kind] +
        '.' +
        (kind === 'try' && cur ? ' ' + cur.d.try : '');
    live.textContent = '';
    window.setTimeout(() => {
      live.textContent = msg;
    }, 60);
  }
  function render(how: number) {
    const active = doc.activeElement as HTMLButtonElement | null;
    const keep = active === nextBtn || active === backBtn;
    hold!.appendChild(stage);
    clearTry();
    stopTimers();
    col!.textContent = '';
    col!.classList.remove('st-in-next', 'st-in-back');
    if (end) {
      unmount();
      col!.setAttribute('data-kind', 'end');
      buildEnd();
    } else {
      if (!cur) cur = mount();
      const kind = plan()[step - 1];
      col!.setAttribute('data-step', String(step));
      col!.setAttribute('data-kind', kind);
      if (cur) {
        if (kind === 'situation') buildSituation(cur);
        else if (kind === 'try') buildTry(cur);
        else if (kind === 'uses')
          listStep(
            cur,
            'uses',
            'uses',
            idea.also.map((h) => ({ html: h, gap: false })),
            'Next use',
          );
        else if (kind === 'elsewhere')
          listStep(
            cur,
            'elsewhere',
            'elsewhere',
            idea.elsewhere.map((e) => ({ html: e.text, gap: !!e.gap })),
            'Next example',
          );
        else if (kind === 'questions') buildQuestions(cur);
        else buildWhy(cur, kind);
        if (kind === 'situation' || kind === 'try') {
          st(cur.block).vis = true;
          kick();
        }
      }
    }
    header();
    nav();
    if (how && !reduce) {
      void col!.offsetWidth;
      col!.classList.add(how > 0 ? 'st-in-next' : 'st-in-back');
    }
    body!.scrollTop = 0;
    if (!keep || !active || active.disabled || active.hidden) focusEl($('#lg-story-h', col));
    announce();
  }
  function next() {
    if (!isOpen || end) return;
    if (step < lastStep()) step += 1;
    else end = true;
    render(1);
  }
  function back() {
    if (!isOpen) return;
    if (end) {
      end = false;
      step = lastStep();
    } else if (step > 1) step -= 1;
    else return;
    render(-1);
  }

  /* ---------- Open and close ---------- */
  function open(btn: HTMLElement | null, hashed = false) {
    if (isOpen) return;
    opener = btn;
    fromHash = hashed;
    step = 1;
    end = false;
    isOpen = true;
    root.classList.add('lg-story-open');
    try {
      if (typeof dlg.showModal === 'function') dlg.showModal();
      else dlg.setAttribute('open', '');
    } catch {
      dlg.setAttribute('open', '');
    }
    render(0);
  }
  function close() {
    if (!isOpen) return;
    isOpen = false;
    hold!.appendChild(stage);
    stopTimers();
    unmount();
    col!.textContent = '';
    root.classList.remove('lg-story-open');
    try {
      if (dlg.open && dlg.close) dlg.close();
    } catch {
      /* fall through */
    }
    if (dlg.hasAttribute('open')) dlg.removeAttribute('open');
    if (fromHash) {
      try {
        history.replaceState(history.state, '', location.pathname + location.search);
      } catch {
        /* the host may not allow it */
      }
    }
    if (opener && doc.contains(opener)) focusEl(opener);
    else focusEl($('.lg-scene [data-walk]'));
  }

  dlg.addEventListener('close', () => {
    if (isOpen) close();
  });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === 'Tab') {
      trap(e);
      return;
    }
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const t = e.target as Element | null;
    if (t && t.closest && t.closest('input, textarea, select, .seg')) return;
    e.preventDefault();
    if (e.key === 'ArrowRight') next();
    else back();
  });
  function focusables() {
    return $$('button, a[href], input, select, textarea, [tabindex]', dlg).filter((n) => {
      if (
        (n as HTMLButtonElement).disabled ||
        n.getAttribute('tabindex') === '-1' ||
        n.closest('[hidden]')
      )
        return false;
      return n.getClientRects().length > 0 && getComputedStyle(n).visibility !== 'hidden';
    });
  }
  function trap(e: KeyboardEvent) {
    const f = focusables();
    if (!f.length) return;
    const first = f[0];
    const lastF = f[f.length - 1];
    const a = doc.activeElement;
    if (e.shiftKey && (a === first || !dlg.contains(a))) {
      e.preventDefault();
      focusEl(lastF);
    } else if (!e.shiftKey && (a === lastF || !dlg.contains(a))) {
      e.preventDefault();
      focusEl(first);
    }
  }

  /* Swipe left or right on touch screens to move between steps. */
  let sw: { id: number; x: number; y: number; t: number } | null = null;
  body.addEventListener('pointerdown', (e) => {
    sw = null;
    if (e.pointerType === 'mouse' || e.isPrimary === false) return;
    const t = e.target as Element | null;
    if (t && t.closest && t.closest('input, textarea, select, .st-drag')) return;
    sw = { id: e.pointerId, x: e.clientX, y: e.clientY, t: Date.now() };
  });
  body.addEventListener('pointerup', (e) => {
    if (!sw || e.pointerId !== sw.id) return;
    const dx = e.clientX - sw.x;
    const dy = e.clientY - sw.y;
    const dt = Date.now() - sw.t;
    sw = null;
    if (Math.abs(dx) >= 56 && Math.abs(dx) > Math.abs(dy) * 1.4 && dt < 1000) {
      if (dx < 0) next();
      else back();
    }
  });
  body.addEventListener('pointercancel', () => {
    sw = null;
  });

  stage.addEventListener('input', (e) => {
    if (!cur || kindNow() !== 'try') return;
    const t = e.target as Element | null;
    if (t && t.closest && t.closest('.controls')) cur.touched = true;
    if (cur.spots && $('.is-passive', cur.spots)) cur.spots.hidden = true;
    check();
  });
  stage.addEventListener('click', () => {
    if (cur && kindNow() === 'try') {
      cur.tapped = true;
      check();
    }
  });
  nextBtn.addEventListener('click', next);
  backBtn.addEventListener('click', back);
  $$('[data-story-close]', dlg).forEach((b) => b.addEventListener('click', close));
  $$('.lg-scene [data-walk]').forEach((b) => b.addEventListener('click', () => open(b)));
  const fromLocation = () => {
    const h = location.hash || '';
    if (!isOpen && (h === '#walk' || h === '#walk-' + idea.id)) open(null, true);
  };
  window.addEventListener('hashchange', fromLocation);
  window.setTimeout(fromLocation, 0);
  window.addEventListener('beforeprint', () => {
    if (isOpen) close();
  });
}

/** Set up every legacy scene on the page, and the walkthrough when the page has one. */
export function initLegacy(): void {
  if (reduce) root.classList.add('lg-reduce');
  blocks = $$<HTMLElement>('.lg-scene .scene-block');
  blocks.forEach(initBlock);
  safe(() => {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            st(en.target as HTMLElement).vis = en.isIntersecting;
          });
          kick();
        },
        { rootMargin: '60px 0px' },
      );
      blocks.forEach((b) => {
        st(b).vis = false;
        io.observe(b);
      });
    } else {
      blocks.forEach((b) => {
        st(b).vis = true;
      });
    }
    doc.addEventListener('visibilitychange', () => {
      if (!doc.hidden) kick();
    });
    kick();
  });
  const dlg = $<HTMLDialogElement>('dialog.lg-story');
  if (dlg) safe(() => initStory(dlg));
}
