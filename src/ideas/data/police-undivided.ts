import type { Idea } from '../types';

export const idea: Idea = {
  id: 'police-undivided',
  num: '07',
  group: 'reports',
  title: 'Police on undivided roads',
  short: 'Police on undivided roads',
  hook: 'On undivided roads, warn drivers in both directions about police.',
  teams: ['Crisis Response & Traffic Events'],
  problem:
    'On a road without a median, police reported on one side are really on both sides, but the report alerts one direction only.',
  moment: {
    text: 'On roads that aren’t split, officers can stop traffic coming either way, and they can cross over.',
  },
  known:
    'Permanent hazards on a two-way street alert both directions,<sup class="fn"><a href="#src-police-undivided-1" aria-label="Source 1">1</a></sup> and partner feeds can mark a police report BOTH_DIRECTIONS.<sup class="fn"><a href="#src-police-undivided-2" aria-label="Source 2">2</a></sup>',
  today:
    'A police report alerts one direction only; “Other side” is the only direction control.<sup class="fn"><a href="#src-police-undivided-3" aria-label="Source 3">3</a></sup>',
  proposed:
    'On undivided two-way roads a police report alerts both directions, with honest wording: “Police reported on this road, either side.”',
  howToday:
    'Police reports offer Police, Mobile camera, Hidden and Other side. “Other side” is the only direction control, and Help doesn’t define it.<sup class="fn"><a href="#src-police-undivided-3" aria-label="Source 3">3</a></sup> Drivers have asked for reports that cover both directions since 2010, and in 2013 a Waze user in South Africa asked for “an option to indicate both lanes”.<sup class="fn"><a href="#src-police-undivided-4" aria-label="Source 4">4</a>,<a href="#src-police-undivided-5" aria-label="Source 5">5</a></sup>',
  howProposed:
    'On undivided two-way roads a police report alerts both directions, with honest wording: “Police reported on this road, either side.”',
  elsewhere: [
    {
      text: 'Inside Waze, permanent hazards on two-way streets already apply to both directions.<sup class="fn"><a href="#src-police-undivided-1" aria-label="Source 1">1</a></sup>',
    },
    {
      text: 'Waze’s partner feed carries BOTH_DIRECTIONS for police reports such as POLICE_VISIBLE and POLICE_HIDING.<sup class="fn"><a href="#src-police-undivided-2" aria-label="Source 2">2</a></sup>',
    },
  ],
  why: [],
  knownShort: 'Permanent hazards on a two-way street alert both directions.',
  ask: 'On segments with no median, show police reports to both directions, worded “either side”. Pilot it on Kenyan single-carriageway roads.',
  sources: [
    {
      n: 1,
      label: 'Wazeopedia: Adding Permanent Hazards in the WME',
      url: 'https://www.waze.com/discuss/t/adding-permanent-hazards-in-the-wme/379692',
    },
    {
      n: 2,
      label: 'Waze data feed: CIFS specification (Google for Developers)',
      url: 'https://developers.google.com/waze/data-feed/cifs-specification',
    },
    {
      n: 3,
      label: 'Waze Help: Report police sightings',
      url: 'https://support.google.com/waze/answer/13739289',
    },
    {
      n: 4,
      label: 'Waze Discuss: How about “both directions” (Mar 2010)',
      url: 'https://www.waze.com/discuss/t/how-about-both-directions/87365',
    },
    {
      n: 5,
      label: 'Waze Discuss: Feature request, police and traffic cam both directions (Mar 2013)',
      url: 'https://www.waze.com/discuss/t/feature-req-police-traffic-cam-bi-direction/110666',
    },
  ],
  shortOnTime: true,
};
