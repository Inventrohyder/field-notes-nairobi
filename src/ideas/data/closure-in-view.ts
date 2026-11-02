import type { Idea } from '../types';

/** Screenshot paths are relative to the site base. */
export const idea: Idea = {
  id: 'closure-in-view',
  num: '11',
  group: 'reports',
  title: 'Close a road you can see',
  short: 'Close a road you can see',
  hook: 'Let trusted editors close a road they can see, with a direction.',
  teams: ['Crisis Response & Traffic Events', 'App Product'],
  problem:
    'When I can see a closed road beside me, the app lets me close only roads within about 100 m of me, in my direction.',
  moment: {
    text: 'At Kenyatta Avenue roundabout on Uhuru Highway, the closure tool offered arrows only around my own position.',
    shots: [
      {
        src: 'screenshots/11-closure-tool.jpg',
        alt: 'Closure tool screenshot near Kenyatta Avenue roundabout on Uhuru Highway. Closure arrows appear only around the driver’s position.',
        caption: 'My screenshot: Uhuru Highway at Kenyatta Avenue roundabout.',
      },
    ],
  },
  known:
    'You can report a closure where you are; if you lose signal mid-report, Waze saves your location.<sup class="fn"><a href="#src-closure-in-view-1" aria-label="Source 1">1</a></sup>',
  today:
    'The app lets you close only roads within about 100 m, in your own direction.<sup class="fn"><a href="#src-closure-in-view-2" aria-label="Source 2">2</a></sup>',
  proposed: 'Tap a road in view, choose the direction that is closed, and send it.',
  howToday:
    'The East African Community wiki: any Wazer can report a closure “only on roads connecting in the immediate vicinity (around 100m)” and “only in the driving direction of the wazer”.<sup class="fn"><a href="#src-closure-in-view-2" aria-label="Source 2">2</a></sup> In WME, closures need a rank 4 editor in their editable area, or an editor who manages that area.<sup class="fn"><a href="#src-closure-in-view-2" aria-label="Source 2">2</a></sup>',
  howProposed:
    'Tap a road in view, choose the direction that is closed, and send it. In WME an editor can already close one direction of a two-way segment.<sup class="fn"><a href="#src-closure-in-view-3" aria-label="Source 3">3</a></sup>',
  elsewhere: [
    {
      text: 'In the USA, closures that rank 5+ editors make in the app take effect immediately.<sup class="fn"><a href="#src-closure-in-view-3" aria-label="Source 3">3</a></sup>',
    },
  ],
  why: [
    'Nairobi closes roads at short notice: for the Africa Forward Summit in May 2026, police closed City Hall Way, Parliament Road, Harambee Avenue and Taifa Road.<sup class="fn"><a href="#src-closure-in-view-4" aria-label="Source 4">4</a></sup>',
    'On 9 April 2026 police restricted the Parliament roundabout, part of Wabera Street and City Hall Way “until the activities are over”.<sup class="fn"><a href="#src-closure-in-view-5" aria-label="Source 5">5</a></sup>',
    'At Waze’s April 2023 Office Hours an editor called it “a pity to see closed streets live and not be able to report them”; staff planned work on it that year.<sup class="fn"><a href="#src-closure-in-view-6" aria-label="Source 6">6</a></sup>',
  ],
  knownShort: 'You can report a closure where you are.',
  ask: 'Let trusted editors mark a closure on a road in view, with a direction picker. Pilot it with EAC editors in Nairobi.',
  sources: [
    {
      n: 1,
      label: 'Waze Help: Report road closures',
      url: 'https://support.google.com/waze/answer/13753511',
    },
    {
      n: 2,
      label: 'Wazeopedia, East African Community: Road closures (2025)',
      url: 'https://www.waze.com/discuss/t/road-closures/379771',
    },
    {
      n: 3,
      label: 'Wazeopedia, USA: Real-time closures (RTC)',
      url: 'https://www.waze.com/discuss/t/real-time-closures-rtc/377964',
    },
    {
      n: 4,
      label: 'Citizen Digital: Nairobi roads closed for the Africa Forward Summit (9 May 2026)',
      url: 'https://www.citizen.digital/article/list-of-key-nairobi-roads-to-be-closed-ahead-of-africa-forward-summit-n382365',
    },
    {
      n: 5,
      label: 'Citizen Digital: Key CBD roads closed for presidential visit (9 Apr 2026)',
      url: 'https://citizen.digital/article/key-roads-closed-in-nairobi-cbd-as-ruto-visits-kicc-county-assembly-n380429',
    },
    {
      n: 6,
      label: 'Waze Discuss: April 2023 Office Hours, WME and closures (23 Apr 2023)',
      url: 'https://www.waze.com/discuss/t/april-2023-office-hours-wme-and-closures/322459',
    },
  ],
};
