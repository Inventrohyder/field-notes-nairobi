import type { Idea } from '../types';

export const idea: Idea = {
  id: 'quick-asks',
  num: '20',
  group: 'quick',
  title: 'Quick asks',
  short: 'Quick asks',
  hook: 'Convoy driving, iPhone lock-screen directions and an ETA-share prompt.',
  teams: ['App Product'],
  problem: 'Three small features from my notes.',
  known:
    'You can share your drive with a link so friends can follow it.<sup class="fn"><a href="#src-quick-asks-1" aria-label="Source 1">1</a></sup>',
  today: 'No convoy mode, no lock-screen directions on iPhone, and no prompt to share the ETA.',
  proposed:
    'Convoy driving with a leader car, next turn and ETA on the iPhone lock screen, and an offer to share the ETA as a drive starts.',
  howToday:
    '<p><b>Convoy with a leader car.</b> Share drive lets friends follow my drive through a link. There is no group or convoy mode.<sup class="fn"><a href="#src-quick-asks-1" aria-label="Source 1">1</a></sup></p><p><b>Lock-screen directions on iPhone.</b> Waze lock-screen navigation is Android only. Waze Help says it is not supported on iOS.<sup class="fn"><a href="#src-quick-asks-3" aria-label="Source 3">3</a></sup></p><p><b>Trip details, then share.</b> Waze sends time-to-leave reminders and can sync a calendar, but never prompts me to share my ETA.<sup class="fn"><a href="#src-quick-asks-6" aria-label="Source 6">6</a></sup></p>',
  howProposed:
    '<p><b>Convoy with a leader car.</b> Friends join a convoy, follow the leader’s route and see each other on the map.</p><p><b>Lock-screen directions on iPhone.</b> Next turn and ETA on the iPhone lock screen, as a Live Activity.</p><p><b>Trip details, then share.</b> At the start of a drive, ask who is waiting and offer to share the ETA with them.</p>',
  elsewhere: [
    {
      text: 'calimoto Group Rides show co-riders’ live locations during navigation.<sup class="fn"><a href="#src-quick-asks-2" aria-label="Source 2">2</a></sup>',
    },
    {
      text: 'Apple Maps shows directions as a Live Activity, and Google Maps brought glanceable directions to the iPhone lock screen in 2024.<sup class="fn"><a href="#src-quick-asks-4" aria-label="Source 4">4</a>,<a href="#src-quick-asks-5" aria-label="Source 5">5</a></sup>',
    },
    {
      text: 'Apple Maps Share ETA texts the recipient when the ETA changes.<sup class="fn"><a href="#src-quick-asks-7" aria-label="Source 7">7</a></sup>',
    },
  ],
  why: [],
  ask: 'Pick one of the three for a Kenya beta.',
  sources: [
    {
      n: 1,
      label: 'Waze Help: Share your drive',
      url: 'https://support.google.com/waze/answer/6273627',
    },
    {
      n: 2,
      label: 'calimoto blog: Group riding (2026)',
      url: 'https://calimoto.com/blog/article/group-riding',
    },
    {
      n: 3,
      label: 'Waze Help (iOS): Keep Waze visible when your phone is locked',
      url: 'https://support.google.com/waze/answer/15602293?co=GENIE.Platform%3DiOS&hl=en',
    },
    {
      n: 4,
      label: '9to5Mac: Dynamic Island supported apps (14 Sep 2022)',
      url: 'https://9to5mac.com/2022/09/14/dynamic-island-supported-apps/',
    },
    {
      n: 5,
      label: 'iMore: Google Maps glanceable directions on iPhone lock screens (28 Feb 2024)',
      url: 'https://www.imore.com/apps/navigation-apps/google-maps-just-got-way-more-useful-as-glanceable-directions-come-to-iphone-lock-screens-everywhere',
    },
    {
      n: 6,
      label: 'Waze Help: Get a reminder when it’s time to leave',
      url: 'https://support.google.com/waze/answer/7502125',
    },
    {
      n: 7,
      label: 'Popular Science: How to share your ETA in Google Maps and Apple Maps (14 Jun 2024)',
      url: 'https://www.popsci.com/diy/how-to-share-eta-google-maps-apple-maps/',
    },
  ],
};
