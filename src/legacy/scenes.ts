import type { Idea } from '../ideas/types';

const SCENES = import.meta.glob<string>('./scenes/*.svg.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const THUMBS = import.meta.glob<string>('./scenes/*.thumb.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const DATA = import.meta.glob<{ idea?: Idea }>('../ideas/data/*.ts', { eager: true });

/** The scene block markup for an idea, or undefined when it has no legacy scene. */
export function sceneHtml(id: string): string | undefined {
  return SCENES[`./scenes/${id}.svg.html`];
}

/** The idea's page text, from src/ideas/data. */
export function ideaData(id: string): Idea | undefined {
  return DATA[`../ideas/data/${id}.ts`]?.idea;
}

/** Just the drawings of a scene (one, or three for Quick asks), for static pictures. */
export function sceneSvgs(id: string): string[] {
  const html = sceneHtml(id) ?? THUMBS[`./scenes/${id}.thumb.svg`] ?? '';
  return (
    html.match(/<svg class="sv"[\s\S]*?<\/svg>(?=<\/div>)/g) ??
    (html.startsWith('<svg') ? [html.trim()] : [])
  );
}
