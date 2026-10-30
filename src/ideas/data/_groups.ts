import type { GroupId } from '../types';

/** The six groups, in page order, with the one-line summary each shows. */
export const GROUP_INFO: { id: GroupId; name: string; summary: string; teams: string[] }[] = [
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

/** The three ideas to start with when short on time. */
export const SHORT_ON_TIME = ['alert-timing', 'police-undivided', 'mosques'];
