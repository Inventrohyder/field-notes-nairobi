import type { Idea } from '../types';

/** Screenshot paths are relative to the site base. */
export const idea: Idea = {
  id: 'alert-timing',
  num: '06',
  group: 'reports',
  title: 'Ask at the right moment',
  short: 'Ask at the right moment',
  hook: 'Ask “Still there?” just after drivers pass a report.',
  teams: ['Crisis Response & Traffic Events', 'App Product'],
  problem:
    'The app asks me to rate reports I can’t see yet, so confirmations mean little and old reports linger.',
  moment: {
    text: 'On Uhuru Highway the app showed me a police report 10.2 km away, on Mombasa Road, with a thumbs-up button. On the A8, a police report 230 m ahead was 5 hours old.',
    shots: [
      {
        src: 'screenshots/06-uhuru-police-report.jpg',
        alt: 'Screenshot on Uhuru Highway: a police report 10.2 km away on Mombasa Road, with a thumbs-up button.',
        caption: 'My screenshot: Uhuru Highway. Another user’s name blurred.',
      },
      {
        src: 'screenshots/06-a8-police-report.jpg',
        alt: 'Screenshot on the A8: a police report 230 m away, reported 5 hours ago by anonymous.',
        caption: 'My screenshot: the A8.',
      },
    ],
  },
  known:
    '“Not there” shortens how long a report shows, and how long it stays depends on how many drivers react.<sup class="fn"><a href="#src-alert-timing-1" aria-label="Source 1">1</a></sup>',
  today: 'The app can ask you to confirm a report long before you reach it.',
  proposed: '“Still there?” comes just after you pass the spot, for every report type.',
  howToday:
    'Waze Help documents one reaction, “Not there”, which shortens how long a report shows.<sup class="fn"><a href="#src-alert-timing-1" aria-label="Source 1">1</a></sup> I found no published rule for when the app asks.',
  howProposed:
    'Ask “Still there?” only after I pass the spot, for every report type. Confirmations then come from people who just saw it, and stale reports expire.',
  elsewhere: [
    {
      text: 'Google Maps: when you reach the alert, “a prompt will appear to ask if the traffic incident is still there”.<sup class="fn"><a href="#src-alert-timing-4" aria-label="Source 4">4</a></sup>',
    },
    {
      text: 'In a pilot in five countries since March 2026, a matching Google Maps report counts as a second confirmation of a Waze alert.<sup class="fn"><a href="#src-alert-timing-5" aria-label="Source 5">5</a></sup>',
    },
  ],
  why: [
    'Removing a report takes several “Not there” taps, and notifications can take several minutes to arrive.<sup class="fn"><a href="#src-alert-timing-2" aria-label="Source 2">2</a></sup>',
    'In August 2026 drivers complained that police warnings arrived late, one with three or four seconds’ notice.<sup class="fn"><a href="#src-alert-timing-3" aria-label="Source 3">3</a></sup>',
  ],
  knownShort: '“Not there” shortens how long a report stays on the map.',
  ask: 'Move the confirm prompt to just after the driver passes a report, and test it on police reports in Nairobi.',
  sources: [
    {
      n: 1,
      label: 'Waze Help: Report police sightings',
      url: 'https://support.google.com/waze/answer/13739289',
    },
    {
      n: 2,
      label: 'BGR: The biggest issues with Waze’s police sighting feature (20 Sep 2026)',
      url: 'https://www.bgr.com/2259383/biggest-issues-with-waze-police-sighting-feature/',
    },
    {
      n: 3,
      label: 'Android Authority: Waze police alerts missing or delayed (11 Aug 2026)',
      url: 'https://androidauthority.com/waze-police-alerts-missing-delayed-3697365',
    },
    {
      n: 4,
      label: 'Android Auto Help: Driving with Google Maps',
      url: 'https://support.google.com/androidauto/answer/6348166',
    },
    {
      n: 5,
      label: 'Waze Discuss: New pilot, Google Maps alerts on the Waze map (8 Mar 2026)',
      url: 'https://www.waze.com/discuss/t/new-pilot-real-time-insights-supplementing-the-waze-map-with-google-maps-alerts/400676',
    },
  ],
  shortOnTime: true,
};
