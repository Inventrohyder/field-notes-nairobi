import type { Idea } from '../types';

export const idea: Idea = {
  id: 'lane-followups',
  num: '09',
  group: 'reports',
  title: 'Which lanes are blocked?',
  short: 'Blocked lanes',
  hook: 'Ask the next drivers which lanes are blocked, with one tap.',
  teams: ['Crisis Response & Traffic Events', 'App Product'],
  problem:
    'After a crash or roadworks report, later drivers can’t say which lanes are blocked or whether it has cleared.',
  moment: {
    text: 'Mombasa Road at Cabanas, 17 September to 22 October 2026: KeNHA has partly closed the airport-bound side for drain works, with a diversion lane and marshals.<sup class="fn"><a href="#src-lane-followups-1" aria-label="Source 1">1</a></sup>',
  },
  known:
    'A blocked-lane report can name one lane: Left, Center or Right.<sup class="fn"><a href="#src-lane-followups-2" aria-label="Source 2">2</a></sup>',
  today:
    'Later drivers can only tap “Not there”; they can’t say which lanes are blocked.<sup class="fn"><a href="#src-lane-followups-2" aria-label="Source 2">2</a></sup>',
  proposed: 'The next drivers tap which lanes are blocked, and the route moves to a free lane.',
  howToday:
    'Later drivers can only tap “Not there”; they can’t say which lanes are blocked.<sup class="fn"><a href="#src-lane-followups-2" aria-label="Source 2">2</a></sup>',
  howProposed:
    'The next drivers get a one-tap, multi-select question: shoulder, left, middle, right, and “Still there?”. The route moves to a free lane.',
  elsewhere: [
    {
      text: 'TomTom Traffic Incidents detects incidents at lane level, such as lanes closed for roadworks (2024).<sup class="fn"><a href="#src-lane-followups-5" aria-label="Source 5">5</a></sup>',
    },
    {
      text: 'I found no consumer app that asks later drivers which lanes are blocked.',
      gap: true,
    },
  ],
  why: [
    'Partner feeds can already say which lanes are closed, lane by lane; drivers in the app cannot. Editors may not use a road closure for a lane closure.<sup class="fn"><a href="#src-lane-followups-3" aria-label="Source 3">3</a>,<a href="#src-lane-followups-4" aria-label="Source 4">4</a></sup>',
  ],
  ask: 'After a “Blocked lane” or crash report, show the next few drivers a one-tap lane picker. Start on Mombasa Road and Thika Road.',
  sources: [
    {
      n: 1,
      label: 'Citizen Digital: Mombasa Road Cabanas section temporarily closed (11 Sep 2026)',
      url: 'https://citizen.digital/article/traffic-disruption-on-mombasa-road-as-cabanas-section-temporarily-closed-n389980',
    },
    {
      n: 2,
      label: 'Waze Help: Report a blocked lane',
      url: 'https://support.google.com/waze/answer/13811250',
    },
    {
      n: 3,
      label: 'Waze data feed: CIFS specification (Google for Developers)',
      url: 'https://developers.google.com/waze/data-feed/cifs-specification',
    },
    {
      n: 4,
      label: 'Wazeopedia, USA: Real-time closures (RTC)',
      url: 'https://www.waze.com/discuss/t/real-time-closures-rtc/377964',
    },
    {
      n: 5,
      label: 'TomTom newsroom: Discover TomTom Traffic Incidents (13 Sep 2024)',
      url: 'https://www.tomtom.com/newsroom/product-focus/discover-tomtom-traffic-incidents',
    },
  ],
};
