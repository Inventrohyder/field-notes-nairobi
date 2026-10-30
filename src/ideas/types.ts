export type GroupId = 'ride' | 'reports' | 'map' | 'collect' | 'quick' | 'growing';
export interface Source {
  n: number;
  label: string;
  url: string;
}
export interface Idea {
  id: string; // e.g. 'report-followup' (slug = id; keep existing ids, including 'mosques')
  num: string; // '10'
  group: GroupId;
  title: string; // card heading
  short: string; // nav/tile label
  hook: string; // one-line tile hook
  teams: string[]; // "For:" teams
  problem: string; // HTML allowed (footnote <sup> markup)
  moment?: { text: string; shots?: { src: string; alt: string; caption: string }[] };
  known: string; // "You already know"
  today: string;
  proposed: string; // one-line captions
  howToday: string;
  howProposed: string; // long "How it works" (HTML)
  also?: string[];
  elsewhere: { text: string; gap?: boolean }[];
  questions?: { q: string; a: string }[];
  why: string[]; // facts (HTML with footnotes)
  ask: string;
  sources: Source[];
  shortOnTime?: boolean;
}
