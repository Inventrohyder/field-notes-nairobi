import type { Idea } from '../types';

/** Screenshot paths are relative to the site base. */
export const idea: Idea = {
  id: 'police-junctions',
  num: '05',
  group: 'ride',
  title: 'Junctions run by traffic police',
  short: 'Police-run junctions',
  hook: 'Let drivers report officers directing traffic, so ETAs stop drifting.',
  teams: ['In-car & Routing', 'Data'],
  problem:
    'At many Nairobi junctions officers direct traffic in place of the signals, so delays don’t follow the signal timings and ETAs drift.',
  moment: {
    text: 'When an officer controls a junction, traffic follows the officer instead of the lights, so the wait is often longer than Waze expects.',
    shots: [
      {
        src: 'screenshots/05-flyover-queue.jpg',
        alt: 'Evening traffic queued under a flyover in Nairobi, with number plates blurred.',
        caption: 'Evening traffic under a flyover in Nairobi. Still from my video; plates blurred.',
      },
    ],
  },
  known:
    'Waze times each route out of a junction separately, from drivers’ real speeds.<sup class="fn"><a href="#src-police-junctions-1" aria-label="Source 1">1</a></sup>',
  today:
    'No report says an officer is directing traffic, so routing sees the delay only through slower drives.<sup class="fn"><a href="#src-police-junctions-1" aria-label="Source 1">1</a></sup>',
  proposed:
    'Drivers tap “Officer directing traffic”, routing learns the delay faster, and the map shows why the ETA moved.',
  howToday:
    'There is no “officer directing traffic” report. Police reports are Police, Mobile camera, Hidden or Other side, and traffic reports give no reason.<sup class="fn"><a href="#src-police-junctions-2" aria-label="Source 2">2</a>,<a href="#src-police-junctions-3" aria-label="Source 3">3</a></sup> Routing sees a slow junction only through slower drives.<sup class="fn"><a href="#src-police-junctions-1" aria-label="Source 1">1</a></sup>',
  howProposed:
    'Drivers tap “Officer directing traffic” at the junction. Routing learns the extra delay faster, and the map shows why the ETA moved.',
  elsewhere: [
    {
      text: 'Not found elsewhere: I found no app with a report for an officer directing traffic.',
      gap: true,
    },
  ],
  why: [
    'KURA plans to link 125 Nairobi junctions to a control centre, replacing manual control and reducing the officers stationed at intersections.<sup class="fn"><a href="#src-police-junctions-4" aria-label="Source 4">4</a></sup>',
  ],
  ask: 'Add “Officer directing traffic” as a report in Kenya, and use it to explain and speed up delay learning at those junctions.',
  sources: [
    {
      n: 1,
      label: 'Wazeopedia, USA: Turn delays',
      url: 'https://waze.com/wiki/USA/Turn_delays',
    },
    {
      n: 2,
      label: 'Waze Help: Report police sightings',
      url: 'https://support.google.com/waze/answer/13739289',
    },
    {
      n: 3,
      label: 'Waze Help: Report traffic',
      url: 'https://support.google.com/waze/answer/13740207',
    },
    {
      n: 4,
      label: 'Eastleigh Voice: AI-powered traffic lights at 125 Nairobi junctions (12 May 2026)',
      url: 'https://eastleighvoice.co.ke/city-affairs/348540/government-to-roll-out-ai-powered-traffic-lights-at-125-nairobi-junctions',
    },
  ],
};
