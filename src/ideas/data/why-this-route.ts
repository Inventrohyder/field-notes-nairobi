import type { Idea } from '../types';

export const idea: Idea = {
  id: 'why-this-route',
  num: '02',
  group: 'ride',
  title: 'Tell me why this route',
  short: 'Why this route',
  hook: 'One line that says why the route leaves the main road.',
  teams: ['In-car & Routing'],
  problem:
    'On the Nairobi–Mombasa highway Waze sometimes turns me off the A8 onto a road that isn’t the main highway. Leaving the main highway to save time needs a really strong reason, and none shows on screen.',
  moment: {
    text: 'At Makindu, Waze has told me to take a right turn off the A8 with nothing on screen to say why. Drivers should be able to make that decision as informed as possible.',
  },
  known:
    'Waze’s trip preview shows “the why” behind a route before you start: traffic conditions and real-time reports.<sup class="fn"><a href="#src-why-this-route-1" aria-label="Source 1">1</a></sup>',
  today:
    'Trip preview explains a route before you start; the turn itself comes as a bare instruction.<sup class="fn"><a href="#src-why-this-route-1" aria-label="Source 1">1</a></sup>',
  proposed:
    'When the route leaves a trunk road, one line says why and what the main road would cost.',
  howToday:
    'Trip preview has shown “the why” behind a suggested route since 2021.<sup class="fn"><a href="#src-why-this-route-1" aria-label="Source 1">1</a></sup> In my drives, the turn itself arrives as a bare instruction.',
  howProposed:
    'When the route leaves a trunk road, or differs from my usual route, one line says why and what the main road would cost. Waze already learns my usual routes for personalised navigation (July 2026).<sup class="fn"><a href="#src-why-this-route-2" aria-label="Source 2">2</a></sup>',
  elsewhere: [
    {
      text: 'Google Maps eco-routing explains a trade-off on screen: when the greener route is slower, it shows the CO2 difference so drivers can choose (2021).<sup class="fn"><a href="#src-why-this-route-5" aria-label="Source 5">5</a></sup>',
    },
    {
      text: 'A University of Michigan simulator study found that explanations given before an automated car acts raise drivers’ trust; explanations after it acts do not.<sup class="fn"><a href="#src-why-this-route-6" aria-label="Source 6">6</a></sup>',
    },
  ],
  why: [
    '8 July 2025: a crash involving at least four trucks near KMTC Makindu caused queues several kilometres long on both sides, and some drivers looked for other routes.<sup class="fn"><a href="#src-why-this-route-3" aria-label="Source 3">3</a></sup>',
    '16 April 2024: a three-vehicle crash near Tsavo held motorists for over 7 hours.<sup class="fn"><a href="#src-why-this-route-4" aria-label="Source 4">4</a></sup>',
  ],
  knownShort: 'Trip preview shows why a route was picked, before you start.',
  askShort:
    'When a route leaves a trunk road such as the A8, show why and the time it saves, before the turn.',
  ask: 'When a route leaves a trunk road such as the A8, show the reason and the time it saves before the turn. Try it on the Nairobi–Mombasa highway first.',
  sources: [
    {
      n: 1,
      label: 'Waze blog: Your drives have never been smarter (27 Jul 2021)',
      url: 'https://blog.google/waze/your-drives-have-never-been-smarter/',
    },
    {
      n: 2,
      label: 'Waze blog: Gemini, motorcycle mode and more (13 Jul 2026)',
      url: 'https://blog.google/waze/waze-updates-gemini-motorcycle-mode/',
    },
    {
      n: 3,
      label: 'Kenyans.co.ke: Heavy traffic after multi-truck crash near Makindu (8 Jul 2025)',
      url: 'https://www.kenyans.co.ke/news/113927-heavy-traffic-nairobi-mombasa-highway-after-multi-truck-crash-near-makindu',
    },
    {
      n: 4,
      label: 'Kenyans.co.ke: Motorists stuck 7 hours on Nairobi-Mombasa highway (16 Apr 2024)',
      url: 'https://www.kenyans.co.ke/news/99741-motorist-stuck-7-hr-traffic-along-nairobi-mombasa-highway-after-accident',
    },
    {
      n: 5,
      label: 'Google blog: Redefining what a map can be (30 Mar 2021)',
      url: 'https://blog.google/products/maps/redefining-what-map-can-be-new-information-and-ai/',
    },
    {
      n: 6,
      label: 'Du et al., Transportation Research Part C (2019): explanation timing and trust (PDF)',
      url: 'https://deepblue.lib.umich.edu/bitstream/2027.42/149154/4/Du%20et%20al.%202019.pdf',
    },
  ],
};
