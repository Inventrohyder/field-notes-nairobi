/**
 * Idea ids in page order, with numbers and titles, for client scripts. BaseLayout writes them into
 * a JSON block at build time, so the scripts don't carry the ideas' full text.
 */
export interface IdeaMeta {
  id: string;
  num: string;
  title: string;
  short: string;
}

function read(): IdeaMeta[] {
  try {
    const el = document.getElementById('idea-meta');
    const data = JSON.parse(el?.textContent || '[]') as unknown;
    return Array.isArray(data) ? (data as IdeaMeta[]) : [];
  } catch {
    return [];
  }
}

const LIST = read();
export const IDEA_IDS: string[] = LIST.map((i) => i.id);
export const IDEA_META: Record<string, IdeaMeta> = Object.fromEntries(LIST.map((i) => [i.id, i]));
