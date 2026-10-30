import { describe, expect, it } from 'vitest';
import { IDEAS } from '../src/ideas/index';
import type { Scenario, Step } from '../src/scenario/types';

const withScenarios = IDEAS.filter((i) => i.scenarios && i.scenarios.length > 0);

/** Placeholders used in a step's text: {{key}} or {{key|default}}. */
function placeholders(step: Step): { key: string; optional: boolean }[] {
  const text = [
    step.narrator,
    step.action ?? '',
    step.say ?? '',
    step.clock ?? '',
    step.changed ?? '',
    ...step.choices.map((c) => c.label),
  ].join(' ');
  return [...text.matchAll(/\{\{(\w+)(\|[^}]*)?\}\}/g)].map((m) => ({
    key: m[1],
    optional: m[2] !== undefined,
  }));
}

function enabled(step: Step) {
  return step.choices.filter((c) => !c.disabled);
}

function canReachEnd(sc: Scenario): Set<string> {
  const ok = new Set<string>();
  let changed = true;
  while (changed) {
    changed = false;
    for (const s of Object.values(sc.steps)) {
      if (ok.has(s.id)) continue;
      if (s.end || enabled(s).some((c) => ok.has(c.to))) {
        ok.add(s.id);
        changed = true;
      }
    }
  }
  return ok;
}

describe('guided scenarios', () => {
  it('report-followup has its two scenarios', () => {
    const idea = IDEAS.find((i) => i.id === 'report-followup');
    expect(idea?.scenarios?.map((s) => s.id)).toEqual(['hazard', 'map-issue']);
  });

  for (const idea of withScenarios) {
    for (const sc of idea.scenarios ?? []) {
      describe(`${idea.id} / ${sc.id}`, () => {
        const steps = sc.steps;

        it('has a start step and keys that match step ids', () => {
          expect(steps[sc.start], `start "${sc.start}"`).toBeDefined();
          for (const [key, s] of Object.entries(steps)) expect(s.id).toBe(key);
        });

        it('sends every enabled choice to a step that exists', () => {
          for (const s of Object.values(steps)) {
            for (const c of enabled(s)) {
              expect(steps[c.to], `${s.id} -> ${c.id} -> "${c.to}"`).toBeDefined();
            }
          }
        });

        it('keeps choice ids unique within a step', () => {
          for (const s of Object.values(steps)) {
            const ids = s.choices.map((c) => c.id);
            expect(new Set(ids).size, s.id).toBe(ids.length);
          }
        });

        it('reaches every step from the start', () => {
          const seen = new Set<string>([sc.start]);
          const queue = [sc.start];
          while (queue.length) {
            const s = steps[queue.shift() as string];
            for (const c of enabled(s)) {
              if (!seen.has(c.to)) {
                seen.add(c.to);
                queue.push(c.to);
              }
            }
          }
          const unreachable = Object.keys(steps).filter((k) => !seen.has(k));
          expect(unreachable).toEqual([]);
        });

        it('lets every step reach an ending', () => {
          const ok = canReachEnd(sc);
          const stuck = Object.keys(steps).filter((k) => !ok.has(k));
          expect(stuck).toEqual([]);
        });

        it('gives end steps no enabled choices and other steps at least one', () => {
          for (const s of Object.values(steps)) {
            if (s.end) expect(enabled(s), s.id).toEqual([]);
            else expect(enabled(s).length, s.id).toBeGreaterThan(0);
          }
        });

        it('only asks for widget input on steps that show the widget', () => {
          for (const s of Object.values(steps)) {
            for (const c of s.choices) {
              if (c.needs) expect(s.widget, `${s.id} -> ${c.id}`).toBe(c.needs);
            }
          }
        });

        it('walks every path to an ending, with every placeholder filled', () => {
          let paths = 0;
          const walk = (id: string, vars: Set<string>, trail: string[]) => {
            expect(trail.includes(id), `cycle: ${[...trail, id].join(' > ')}`).toBe(false);
            expect(trail.length).toBeLessThan(60);
            const s = steps[id];
            for (const p of placeholders(s)) {
              if (!p.optional) {
                expect(vars.has(p.key), `${s.id} uses {{${p.key}}} before it is set`).toBe(true);
              }
            }
            if (s.end) {
              paths++;
              return;
            }
            for (const c of enabled(s)) {
              const next = new Set(vars);
              Object.keys(c.set ?? {}).forEach((k) => next.add(k));
              if (c.needs) next.add(c.needs);
              walk(c.to, next, [...trail, id]);
            }
          };
          walk(sc.start, new Set(), []);
          expect(paths).toBeGreaterThan(0);
        });

        it('uses no em-dashes in any copy', () => {
          for (const s of Object.values(steps)) {
            const text = JSON.stringify(s);
            expect(text.includes('—'), s.id).toBe(false);
          }
          expect(sc.title + sc.who).not.toContain('—');
        });
      });
    }
  }
});

describe('report-followup page copy', () => {
  const idea = IDEAS.find((i) => i.id === 'report-followup');
  it('has no em-dashes and footnotes that match its sources', () => {
    const text = JSON.stringify(idea);
    expect(text.includes('—')).toBe(false);
    const cited = new Set([...text.matchAll(/#src-report-followup-(\d+)/g)].map((m) => +m[1]));
    const listed = new Set(idea?.sources.map((s) => s.n));
    for (const n of cited) expect(listed.has(n), `source ${n}`).toBe(true);
  });
});
