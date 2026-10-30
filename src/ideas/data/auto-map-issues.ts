import type { Idea } from '../types';

export const idea: Idea = {
  id: 'auto-map-issues',
  num: '17',
  group: 'collect',
  title: 'Map issues that catch roadworks',
  short: 'Map issues that catch roadworks',
  hook: 'Flag mapped roads drivers stop using, and dash-cam changes, for editors.',
  teams: ['Data', 'WME & Geo Collaboration'],
  problem:
    'In Nairobi, roadworks change a road’s layout for weeks at a time, and the map lags behind.',
  moment: {
    text: 'From 8 to 20 September 2026, the Nairobi Expressway’s Westlands exit was diverted to the lower A8 on Waiyaki Way for works on the overpass deck.<sup class="fn"><a href="#src-auto-map-issues-1" aria-label="Source 1">1</a></sup>',
  },
  known:
    'Waze flags a Missing Road when drivers’ traces leave the map.<sup class="fn"><a href="#src-auto-map-issues-2" aria-label="Source 2">2</a></sup>',
  today:
    'Map Problems catch traces that leave the map; nothing flags a mapped road that drivers stop using.<sup class="fn"><a href="#src-auto-map-issues-2" aria-label="Source 2">2</a></sup>',
  proposed:
    'A mapped road drivers stop using, or a dash-cam change, raises a map issue in WME for an editor to confirm.',
  howToday:
    'Waze already raises Map Problems when what drivers do doesn’t match the map, such as Missing Road, Driving Direction Mismatch or Suggested Route Frequently Ignored, and editors mark each one solved or not identified.<sup class="fn"><a href="#src-auto-map-issues-2" aria-label="Source 2">2</a></sup> I could not confirm how often they appear on Kenyan roads. Waze also detects some closures automatically, from aggregated data.<sup class="fn"><a href="#src-auto-map-issues-3" aria-label="Source 3">3</a></sup>',
  howProposed:
    'Missing Road already covers traces that leave the map. Two more triggers would raise a map issue in WME: a lasting drop in use on a mapped road, as at roadworks, so an editor can confirm a permanent change; and dash-cam change detections from <a href="../matatu-dashcam/">idea 18</a>. An editor always confirms, as with today’s Map Problems. Dense multi-level junctions are harder, so start on single-carriageway roads outside the city.',
  elsewhere: [
    {
      text: 'Bee Maps flags map features that aren’t seen again on later passes for review, and catches changes such as a traffic light removed during construction.<sup class="fn"><a href="#src-auto-map-issues-5" aria-label="Source 5">5</a></sup>',
    },
    {
      text: 'Mapillary’s AI-detected signs reach volunteer editors in HERE Map Creator and the OpenStreetMap editors.<sup class="fn"><a href="#src-auto-map-issues-6" aria-label="Source 6">6</a>,<a href="#src-auto-map-issues-7" aria-label="Source 7">7</a></sup>',
    },
  ],
  why: [
    'KeNHA partly closed Mombasa Road at Cabanas for drain works from 17 September to 22 October 2026, with a diversion lane and marshals.<sup class="fn"><a href="#src-auto-map-issues-4" aria-label="Source 4">4</a></sup>',
  ],
  ask: 'For a three-month trial in Kenya, raise GPS-trace mismatches as WME map issues, including a mapped road that drivers have stopped using for weeks, starting on single-carriageway roads outside Nairobi.',
  sources: [
    {
      n: 1,
      label:
        'The Kenya Times: 12-day closure of the Westlands exit on the Nairobi Expressway (7 Sep 2026)',
      url: 'https://thekenyatimes.com/latest-kenya-times-news/motorists-face-12-day-closure-of-westlands-exit-on-nairobi-expressway/',
    },
    {
      n: 2,
      label: 'Wazeopedia, Malaysia: Map Problem (MP) in Waze Map Editor',
      url: 'https://wazeopedia.waze.com/wiki/Malaysia/Map_Problem_(MP)_In_Waze_Map_Editor',
    },
    {
      n: 3,
      label: 'Waze Discuss: April 2023 Office Hours, WME and closures (23 Apr 2023)',
      url: 'https://www.waze.com/discuss/t/april-2023-office-hours-wme-and-closures/322459',
    },
    {
      n: 4,
      label: 'Citizen Digital: Mombasa Road Cabanas section temporarily closed (11 Sep 2026)',
      url: 'https://citizen.digital/article/traffic-disruption-on-mombasa-road-as-cabanas-section-temporarily-closed-n389980',
    },
    {
      n: 5,
      label: 'Bee Maps blog: How Bee Maps gets its coverage (12 Feb 2026)',
      url: 'https://beemaps.com/blog/how-bee-maps-gets-its-coverage',
    },
    {
      n: 6,
      label: 'HERE Map Creator help: Mapillary information',
      url: 'https://mapcreator.here.com/2023.11.01/help/mapillary-information.html',
    },
    {
      n: 7,
      label: 'Mapillary blog: map features available globally in OpenStreetMap (24 Aug 2020)',
      url: 'https://blog.mapillary.com/update/2020/08/24/global-map-features-openstreetmap.html',
    },
  ],
};
