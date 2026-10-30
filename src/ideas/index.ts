import type { GroupId, Idea } from './types';
import type { Scenario } from '../scenario/types';
import { followupIdea, followupScenarios, FOLLOWUP_INTRO } from './followup-content';

export type { GroupId, Idea, Source } from './types';

export interface IdeaEntry extends Idea {
  scenarios?: Scenario[];
  /** One sentence above the scenario picker. */
  scenarioIntro?: string;
}

type DataModule = { idea?: Idea; scenarios?: Scenario[] };

const modules = import.meta.glob<DataModule>('./data/*.ts', { eager: true });

function collect(): IdeaEntry[] {
  const byId = new Map<string, IdeaEntry>();
  for (const mod of Object.values(modules)) {
    if (mod.idea) byId.set(mod.idea.id, { ...mod.idea, scenarios: mod.scenarios?.length ? mod.scenarios : undefined });
  }
  // Idea 10 is rebuilt as guided scenarios. Its page text and sources live with the scenarios
  // in followup-content.ts, because the scenario narration cites the same numbered sources.
  byId.set(followupIdea.id, {
    ...followupIdea,
    scenarios: followupScenarios,
    scenarioIntro: FOLLOWUP_INTRO,
  });
  return [...byId.values()].sort((a, b) => Number(a.num) - Number(b.num));
}

export const IDEAS: IdeaEntry[] = collect();

export function ideaById(id: string): IdeaEntry | undefined {
  return IDEAS.find((i) => i.id === id);
}

export interface Group {
  id: GroupId;
  name: string;
  summary: string;
  teams: string[];
}

export const GROUPS: Group[] = [
  {
    id: 'ride',
    name: 'Ride & route',
    summary: 'Comfort, route reasons, bumps and bends, roundabouts and junctions.',
    teams: ['In-car & Routing', 'Data'],
  },
  {
    id: 'reports',
    name: 'Reports that fit Kenyan roads',
    summary: 'Report prompts, police alerts, blocked lanes, closures and vendors.',
    teams: ['Crisis Response & Traffic Events', 'App Product'],
  },
  {
    id: 'map',
    name: 'What’s on the map',
    summary: 'Stops by time or distance, black spots, parking and estate bumps.',
    teams: ['WME & Geo Collaboration', 'Hyperlocal', 'Partners & Feeds'],
  },
  {
    id: 'collect',
    name: 'Collecting at scale',
    summary: 'Finding road changes from drivers’ traces and dash cams.',
    teams: ['Partners & Feeds', 'Data', 'WME & Geo Collaboration'],
  },
  {
    id: 'quick',
    name: 'Quick asks',
    summary: 'Reminders that clear themselves, plus three small features.',
    teams: ['App Product'],
  },
  {
    id: 'growing',
    name: 'Growing Waze in Kenya',
    summary: 'Bringing Kenya’s urban and rural road authorities on board, like KeNHA.',
    teams: ['Partners & Feeds', 'Go-to-market'],
  },
];

export interface Team {
  team: string;
  ideas: { id: string; reason: string }[];
}

/** Suggestions by team. Teams only: no people. */
export const TEAMS: Team[] = [
  {
    team: 'Routing & in-car',
    ideas: [
      { id: 'why-this-route', reason: 'One line that says why the route leaves the main road.' },
      { id: 'cabin-comfort', reason: 'A comfort score from phone sensors that routing can use.' },
      {
        id: 'police-junctions',
        reason: 'ETAs that stop drifting at junctions run by traffic police.',
      },
    ],
  },
  {
    team: 'Data',
    ideas: [
      { id: 'auto-map-issues', reason: 'Drivers’ traces show which mapped roads they stop using.' },
      { id: 'cabin-comfort', reason: 'Phone motion sensors give every road a comfort score.' },
      {
        id: 'bump-speed',
        reason: 'Real driving speeds show the speed most drivers take at each bump and bend.',
      },
    ],
  },
  {
    team: 'Map editing (WME)',
    ideas: [
      {
        id: 'auto-map-issues',
        reason: 'Map issues from roads drivers stop using and from dash-cam changes.',
      },
      {
        id: 'estate-bumps',
        reason: 'Bumps and drains mapped on estate roads, for night and floods.',
      },
      { id: 'roundabout-lanes', reason: 'Lane guidance for Nairobi’s multi-lane roundabouts.' },
    ],
  },
  {
    team: 'Traffic events & crisis',
    ideas: [
      { id: 'lane-followups', reason: 'The next drivers say which lanes are blocked, with one tap.' },
      {
        id: 'closure-in-view',
        reason: 'Trusted editors close a road they can see, with a direction.',
      },
      {
        id: 'report-followup',
        reason: 'An opt-in follow-up after the drive asks for a closure’s direction and end time.',
      },
    ],
  },
  {
    team: 'Hyperlocal & places',
    ideas: [
      { id: 'mosques', reason: 'Find a stop by a time or within a distance.' },
      {
        id: 'parking',
        reason: 'What parking costs, starting with Nairobi’s off-street car parks.',
      },
      { id: 'estate-bumps', reason: 'Estate bumps and drains, for unlit streets and floods.' },
    ],
  },
  {
    team: 'Partnerships & cities',
    ideas: [
      {
        id: 'partners-reach',
        reason: 'Kenya’s urban and rural road authorities on board, like KeNHA.',
      },
      { id: 'black-spots', reason: 'NTSA’s black-spot list loaded through the KeNHA partnership.' },
      { id: 'matatu-dashcam', reason: 'A dash-cam pilot with one matatu SACCO.' },
    ],
  },
  {
    team: 'Go-to-market',
    ideas: [
      {
        id: 'partners-reach',
        reason: 'Road authority partners whose own posts could point Kenyan drivers to Waze.',
      },
      { id: 'mosques', reason: 'A Kenya pilot of stops by arrival time or distance.' },
      {
        id: 'notifications',
        reason: 'Reminders that clear themselves once their leave-by time has passed.',
      },
    ],
  },
  {
    team: 'Community & localization',
    ideas: [
      { id: 'report-followup', reason: 'Drivers’ answers attached to their reports for local editors.' },
      {
        id: 'mosques',
        reason: 'Mosque sub-categories and congregation times added by local editors.',
      },
      {
        id: 'partners-reach',
        reason: 'Kenyan editors as the local contact for road authority partners.',
      },
    ],
  },
  {
    team: 'App & AI companion',
    ideas: [
      {
        id: 'report-followup',
        reason: 'Waze’s AI assistant follows up reports after the drive, for drivers who opt in.',
      },
      { id: 'notifications', reason: 'Planned-drive reminders that clear themselves.' },
      { id: 'alert-timing', reason: '“Still there?” asked just after drivers pass a report.' },
    ],
  },
  {
    team: 'Editor or volunteer',
    ideas: [
      {
        id: 'auto-map-issues',
        reason: 'Map issues from roads drivers stop using, for you to confirm.',
      },
      { id: 'closure-in-view', reason: 'Close a road you can see, with a direction.' },
      { id: 'estate-bumps', reason: 'Map the bumps and drains on estate roads.' },
    ],
  },
  {
    team: 'Leadership',
    ideas: [
      {
        id: 'partners-reach',
        reason: 'Kenya’s urban and rural road authorities on board, like KeNHA.',
      },
      {
        id: 'cabin-comfort',
        reason: 'Routing on how smooth a road is, scored from phone sensors.',
      },
      {
        id: 'report-followup',
        reason: 'An opt-in AI follow-up that adds detail to reports after the drive.',
      },
    ],
  },
];
