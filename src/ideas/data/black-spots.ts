import type { Idea } from '../types';

export const idea: Idea = {
  id: 'black-spots',
  num: '14',
  group: 'map',
  title: 'Warn at known black spots',
  short: 'Black spots',
  hook: 'Seed crash history alerts with NTSA’s black-spot list through KeNHA.',
  teams: ['Partners & Feeds', 'Hyperlocal'],
  problem:
    'Kenya’s road-safety agency knows where crashes cluster. A gentle warning on those stretches would help drivers.',
  moment: {
    text: 'NTSA counts more than 270 crash black spots. 199 of them are on the Mombasa–Malaba Northern Corridor, which includes the A8 I drive to Mombasa.<sup class="fn"><a href="#src-black-spots-1" aria-label="Source 1">1</a></sup>',
  },
  known:
    'NTSA keeps a list of black spots, and Waze shows crash history alerts.<sup class="fn"><a href="#src-black-spots-1" aria-label="Source 1">1</a>,<a href="#src-black-spots-2" aria-label="Source 2">2</a></sup>',
  today:
    'Crash history alerts come from what drivers report, and I could not find which countries have them.<sup class="fn"><a href="#src-black-spots-4" aria-label="Source 4">4</a></sup>',
  proposed:
    'Kenya’s crash history alerts are seeded with NTSA and KeNHA black-spot data through the KeNHA partnership.',
  howToday:
    'Waze has shown crash history alerts since November 2023.<sup class="fn"><a href="#src-black-spots-2" aria-label="Source 2">2</a>,<a href="#src-black-spots-3" aria-label="Source 3">3</a></sup> Waze Help says the crash history “is based on user reports”, so a crash nobody reported may be missing, and alerts may not appear on roads you drive often.<sup class="fn"><a href="#src-black-spots-4" aria-label="Source 4">4</a></sup> I could not find which countries have them.',
  howProposed:
    'Kenya’s crash history alerts seeded with NTSA and KeNHA black-spot data, adding the official record to what drivers report, through the KeNHA partnership announced in April 2026.<sup class="fn"><a href="#src-black-spots-5" aria-label="Source 5">5</a></sup>',
  elsewhere: [
    {
      text: 'Google Maps India (2025) gives accident-prone area alerts “based on authoritative data from city authorities”.<sup class="fn"><a href="#src-black-spots-9" aria-label="Source 9">9</a></sup>',
    },
  ],
  why: [
    'NTSA counted 4,458 road deaths in 2025; the NCAJ report presented at State House gives 5,009.<sup class="fn"><a href="#src-black-spots-6" aria-label="Source 6">6</a>,<a href="#src-black-spots-7" aria-label="Source 7">7</a></sup>',
    'The World Bank turned Ma3Route reports into 31,064 geolocated Nairobi crashes; about 14% of crash clusters hold half of them.<sup class="fn"><a href="#src-black-spots-8" aria-label="Source 8">8</a></sup>',
  ],
  knownShort: 'NTSA lists black spots; Waze warns from crashes drivers report.',
  ask: 'Use the KeNHA partnership to load NTSA’s black-spot list into crash history alerts, starting with the A8.',
  sources: [
    {
      n: 1,
      label: 'Citizen Digital: Over 270 black spots identified, NTSA (5 Oct 2026)',
      url: 'https://citizen.digital/article/over-270-black-spots-identified-as-ntsa-explains-rising-road-deaths-n391479',
    },
    {
      n: 2,
      label: 'Waze blog: Crash history alerts arrive to the Waze map (7 Nov 2023)',
      url: 'https://blog.google/waze/crash-history-alerts-arrive-to-the-waze-map/',
    },
    {
      n: 3,
      label: 'FOX 35: Waze crash history alerts (8 Nov 2023)',
      url: 'https://www.fox35orlando.com/news/waze-crash-history-alerts',
    },
    {
      n: 4,
      label: 'Waze Help: Get alerts on roads with a history of crashes',
      url: 'https://support.google.com/waze/answer/13014546',
    },
    {
      n: 5,
      label: 'Capital FM: KeNHA partners with Waze (14 Apr 2026)',
      url: 'https://capitalfm.africa/kenha-partners-with-waze-to-transform-road-navigation-for-kenyan-motorists/',
    },
    {
      n: 6,
      label: 'The Standard: Road deaths rise 3.4% in 2025, NTSA (26 Dec 2025)',
      url: 'https://www.thestandard.ke/business/amp/national/article/2001537222/road-accident-related-deaths-rise-by-34pc-in-2025',
    },
    {
      n: 7,
      label: 'State House Kenya: speech on the NCAJ report on traffic accidents (2 Mar 2026, PDF)',
      url: 'https://www.president.go.ke/wp-content/uploads/DURING-THE-PRESENTATION-OF-A-REPORT-BY-THE-BATIONAL-COUNCIL-ON-THE-ADMINISTRATION-OF-JUSTICE-ON-TRAFFIC-ACCIDENTS-AND-DEATHS.pdf',
    },
    {
      n: 8,
      label: 'World Bank Data Blog: dataset maps 30,000 road crashes in Nairobi (4 Sep 2024)',
      url: 'https://blogs.worldbank.org/en/opendata/newly-released-dataset-maps-30-000-road-crashes-in-nairobi-using',
    },
    {
      n: 9,
      label: 'Google India blog: new safety and disruption alerts in Maps (6 Nov 2025)',
      url: 'https://blog.google/intl/en-in/products/explore-communicate/google-maps-in-india-keeping-you-informed-with-new-safety-disruption-alerts/',
    },
  ],
};
