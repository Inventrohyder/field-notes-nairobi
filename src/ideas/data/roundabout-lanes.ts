import type { Idea } from '../types';

export const idea: Idea = {
  id: 'roundabout-lanes',
  num: '04',
  group: 'ride',
  title: 'Lanes at roundabouts',
  short: 'Roundabout lanes',
  hook: 'Bring roundabout lane guidance to Nairobi’s multi-lane roundabouts.',
  teams: ['WME & Geo Collaboration', 'In-car & Routing'],
  problem: 'Nairobi has many multi-lane roundabouts, and the right lane depends on the exit.',
  known:
    'Waze announced roundabout guidance in March 2024, including which lane to take.<sup class="fn"><a href="#src-roundabout-lanes-1" aria-label="Source 1">1</a></sup>',
  today:
    'Roundabout lane guidance needs a Junction Box, which only rank 4+ editors can add.<sup class="fn"><a href="#src-roundabout-lanes-3" aria-label="Source 3">3</a></sup>',
  proposed:
    'Nairobi’s busiest multi-lane roundabouts get lane guidance, so the instruction names the lanes.',
  howToday:
    'Waze announced roundabout guidance, including which lane to choose, in March 2024, and it was still rolling out in January 2026.<sup class="fn"><a href="#src-roundabout-lanes-1" aria-label="Source 1">1</a>,<a href="#src-roundabout-lanes-2" aria-label="Source 2">2</a></sup> In the editor this needs a Junction Box, which only rank 4+ editors can add, and it gives one instruction on entry.<sup class="fn"><a href="#src-roundabout-lanes-3" aria-label="Source 3">3</a></sup> East Africa’s community ladder lists lane guidance on Junction Boxes among the skills for rank 5.<sup class="fn"><a href="#src-roundabout-lanes-4" aria-label="Source 4">4</a></sup> Junction Boxes need a rank 4 editor, and I could not confirm whether any Kenyan roundabout has lane guidance.',
  howProposed:
    'Nairobi’s busiest multi-lane roundabouts mapped with lane guidance, so the instruction names the lanes.',
  elsewhere: [
    {
      text: 'HERE’s navigation SDK gives lane advice before roundabouts as well as junctions.<sup class="fn"><a href="#src-roundabout-lanes-6" aria-label="Source 6">6</a></sup>',
    },
  ],
  why: [
    'Editors get mixed signals: the UK lane guidance page says roundabouts “can be mapped with Lane Guidance” through a Junction Box, while the UK roundabouts page (March 2026) says gyratories allow lane guidance, “which roundabouts do not”.<sup class="fn"><a href="#src-roundabout-lanes-3" aria-label="Source 3">3</a>,<a href="#src-roundabout-lanes-5" aria-label="Source 5">5</a></sup>',
  ],
  knownShort: 'Waze has roundabout guidance, including which lane to take.',
  askShort: 'Tell us whether Kenyan roundabouts can get lane guidance today, and who can add it.',
  ask: 'Tell us whether Kenyan roundabouts can get lane guidance today, and who can add it. If it takes Junction Boxes, pair Nairobi editors with a rank 5 mentor, the level East Africa’s ladder sets for lanes on Junction Boxes, for the busiest roundabouts.',
  sources: [
    {
      n: 1,
      label: 'TechCrunch: Waze helps you navigate roundabouts, and more (5 Mar 2024)',
      url: 'https://techcrunch.com/2024/03/05/waze-now-helps-you-navigate-roundabouts-alerts-you-about-speed-limit-changes-and-more',
    },
    {
      n: 2,
      label: '9to5Google: Waze speed bump alerts and other features rolling out (22 Jan 2026)',
      url: 'https://9to5google.com/2026/01/22/waze-speed-bump-new-features-rolling-out/',
    },
    {
      n: 3,
      label: 'Wazeopedia (UK): Lane Guidance (Mar 2025)',
      url: 'https://www.waze.com/discuss/t/lane-guidance/379213',
    },
    {
      n: 4,
      label: 'Waze Discuss: Community Ladder for East Africa (Jul 2026)',
      url: 'https://www.waze.com/discuss/t/community-ladder-for-east-africa/408618',
    },
    {
      n: 5,
      label: 'Wazeopedia (UK): Junctions and roundabouts (Mar 2026)',
      url: 'https://www.waze.com/discuss/t/junctions-and-roundabouts/379217',
    },
    {
      n: 6,
      label: 'HERE SDK docs: Lane guidance',
      url: 'https://docs.here.com/here-sdk/docs/navigation-lane-guidance',
    },
  ],
};
