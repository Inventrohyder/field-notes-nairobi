import type { Idea } from '../types';

export const idea: Idea = {
  id: 'vendors',
  num: '12',
  group: 'reports',
  title: 'Vendors in traffic',
  short: 'Vendors in traffic',
  hook: 'Warn drivers when hawkers are walking between cars ahead.',
  teams: ['Crisis Response & Traffic Events', 'App Product'],
  problem:
    'Hawkers walk between cars at junctions and on highways. Drivers get no warning that people are working between the cars.',
  moment: {
    text: 'On Thika Road and Mombasa Road, vendors sell footballs, ice cream and maize between moving cars. One football seller had been hit by a boda boda.<sup class="fn"><a href="#src-vendors-1" aria-label="Source 1">1</a></sup>',
  },
  known:
    'You can report hazards such as a pothole or an object on the road.<sup class="fn"><a href="#src-vendors-2" aria-label="Source 2">2</a></sup>',
  today:
    'No hazard type covers people working between cars.<sup class="fn"><a href="#src-vendors-2" aria-label="Source 2">2</a></sup>',
  proposed:
    'A “People on the road” hazard sub-type that warns drivers approaching a stretch where vendors work.',
  howToday:
    'Hazard sub-types are Hazard, Construction, Car on shoulder, Broken traffic light, Pothole and Object. None covers people working between cars.<sup class="fn"><a href="#src-vendors-2" aria-label="Source 2">2</a></sup> The partner feed has no pedestrian type either.<sup class="fn"><a href="#src-vendors-3" aria-label="Source 3">3</a></sup>',
  howProposed:
    'A “People on the road” hazard sub-type that warns drivers approaching a stretch where vendors work.',
  elsewhere: [
    {
      text: 'Waze’s Hyperlocal alerts (June 2026) add a hazard for zebra crossings on high-speed roads, first in Latin America, Brazil and Asia-Pacific.<sup class="fn"><a href="#src-vendors-5" aria-label="Source 5">5</a></sup>',
    },
    {
      text: 'Not found: no report type for vendors or people walking between cars; Google Maps has none either.<sup class="fn"><a href="#src-vendors-6" aria-label="Source 6">6</a></sup>',
      gap: true,
    },
  ],
  why: [
    'Pedestrians were 1,685 of the 4,458 road deaths NTSA counted in 2025, about 38%.<sup class="fn"><a href="#src-vendors-4" aria-label="Source 4">4</a></sup>',
  ],
  ask: 'Add a “People on the road” hazard sub-type, starting in Kenya.',
  sources: [
    {
      n: 1,
      label: "Nation: 'Jam economy', how hawkers live off Nairobi’s traffic (2025)",
      url: 'https://nation.africa/kenya/news/-jam-economy-how-hawkers-live-off-nairobi-s-traffic--5247518',
    },
    {
      n: 2,
      label: 'Waze Help: Report road hazards',
      url: 'https://support.google.com/waze/answer/13739290?hl=en',
    },
    {
      n: 3,
      label: 'Waze data feed: CIFS specification (Google for Developers)',
      url: 'https://developers.google.com/waze/data-feed/cifs-specification',
    },
    {
      n: 4,
      label: 'The Standard: Road deaths rise 3.4% in 2025, NTSA (26 Dec 2025)',
      url: 'https://www.thestandard.ke/business/amp/national/article/2001537222/road-accident-related-deaths-rise-by-34pc-in-2025',
    },
    {
      n: 5,
      label:
        'Waze Discuss (Portuguese): Hyperlocal Permanent Alerts now in WME production (Jun 2026)',
      url: 'https://www.waze.com/discuss/t/novos-alertas-permanentes-hiperlocais-ja-estao-disponiveis-no-wme-producao/406466',
    },
    {
      n: 6,
      label: 'Android Auto Help: Driving with Google Maps',
      url: 'https://support.google.com/androidauto/answer/6348166',
    },
  ],
};
