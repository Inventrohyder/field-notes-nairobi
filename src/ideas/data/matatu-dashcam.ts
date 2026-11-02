import type { Idea } from '../types';

export const idea: Idea = {
  id: 'matatu-dashcam',
  num: '18',
  group: 'collect',
  title: 'Dash cams for matatus',
  short: 'Matatu dash cams',
  hook: 'Matatu dash cams spot road changes; local editors confirm them.',
  teams: ['Partners & Feeds', 'Data'],
  problem:
    'Matatus drive the same routes all day. They are the first to meet a new bump or a closure.',
  moment: {
    text: 'Kenya licensed 67,569 public service vehicles in 2025, 41,699 of them 8 to 18-seat matatus.<sup class="fn"><a href="#src-matatu-dashcam-1" aria-label="Source 1">1</a></sup>',
  },
  known:
    'Waymo’s cars send the potholes they detect to Waze, where drivers can verify them (April 2026).<sup class="fn"><a href="#src-matatu-dashcam-2" aria-label="Source 2">2</a></sup>',
  today:
    'Partners can send automated reports; nothing yet turns a matatu’s daily drive into reports.<sup class="fn"><a href="#src-matatu-dashcam-3" aria-label="Source 3">3</a></sup>',
  proposed:
    'Dash cams on matatus catch road changes on repeat passes and send them to WME as map issues for Nairobi editors to confirm.',
  howToday:
    'Approved partners already send automated reports, each with a direction, through the partner feed.<sup class="fn"><a href="#src-matatu-dashcam-3" aria-label="Source 3">3</a>,<a href="#src-matatu-dashcam-4" aria-label="Source 4">4</a></sup> Since July 2026 a spoken “The road is closed here” goes to local map editors.<sup class="fn"><a href="#src-matatu-dashcam-5" aria-label="Source 5">5</a></sup> Nothing yet turns a matatu’s daily drive into reports.',
  howProposed:
    'Matatus carry Bee Maps-style dash cams. Repeat passes catch changes, such as a changed speed limit or a traffic light removed during construction, and send them to WME as map issues for Nairobi editors to confirm, as in <a href="../auto-map-issues/">idea 17</a>.<sup class="fn"><a href="#src-matatu-dashcam-6" aria-label="Source 6">6</a></sup> A dash cam’s motion sensors could also flag harsh braking and swerving, feeding the comfort score in <a href="../cabin-comfort/">idea 01</a>. Bee Maps contributors already earn rewards for mapping as they drive.<sup class="fn"><a href="#src-matatu-dashcam-7" aria-label="Source 7">7</a>,<a href="#src-matatu-dashcam-8" aria-label="Source 8">8</a></sup>',
  elsewhere: [
    {
      text: 'Bee Maps, powered by the Hivemapper network, runs fleet dash cams that map every road they drive, every day, automatically. Each detection carries a confidence score and a GPS position, and features not seen again on later passes are flagged for review.<sup class="fn"><a href="#src-matatu-dashcam-6" aria-label="Source 6">6</a>,<a href="#src-matatu-dashcam-8" aria-label="Source 8">8</a></sup>',
    },
    {
      text: 'Bee Maps raised US$32 million in October 2025 and has announced customers including Volkswagen’s robotaxi programme, Lyft, Mapbox and NBC.<sup class="fn"><a href="#src-matatu-dashcam-8" aria-label="Source 8">8</a></sup>',
    },
    {
      text: 'In April 2023 Hivemapper listed Kenya among the places “lighting up the map” that month.<sup class="fn"><a href="#src-matatu-dashcam-7" aria-label="Source 7">7</a></sup>',
    },
    {
      text: 'I could not confirm Bee Maps activity in Kenya in 2026.',
      gap: true,
    },
    {
      text: 'Mapillary’s crowd imagery feeds AI-detected signs to volunteer editors in HERE Map Creator and the OpenStreetMap editors.<sup class="fn"><a href="#src-matatu-dashcam-11" aria-label="Source 11">11</a>,<a href="#src-matatu-dashcam-12" aria-label="Source 12">12</a></sup>',
    },
  ],
  questions: [
    {
      q: 'Privacy and consent.',
      a: 'Send each detection with one cropped frame instead of video. Bee Maps already blurs every keyframe on the device before it leaves the camera.<sup class="fn"><a href="#src-matatu-dashcam-6" aria-label="Source 6">6</a></sup> Matatu owners and drivers opt in, and Kenya’s Data Protection Act applies.',
    },
    {
      q: 'Mobile data is expensive.',
      a: 'Upload only the detected events, never continuous video.',
    },
    {
      q: 'Detectors trained elsewhere.',
      a: 'Most detection models learned on roads in the US, Europe and East Asia, so their accuracy on unmarked Kenyan bumps is unproven. Editors confirm every detection, and the pilot measures the miss rate.',
    },
    {
      q: 'Crypto rewards.',
      a: 'Rewards come in a crypto token, HONEY, which may not suit every operator; the fleet owner decides how to split them between managers and drivers.<sup class="fn"><a href="#src-matatu-dashcam-7" aria-label="Source 7">7</a></sup>',
    },
    {
      q: 'No dash-cam partner yet.',
      a: 'The nearest is Waymo: since April 2026 its cars have sent the potholes they detect to Waze.<sup class="fn"><a href="#src-matatu-dashcam-2" aria-label="Source 2">2</a></sup> The partner feed already accepts automated reports with a direction, so a pilot can start as an ordinary partner feed.<sup class="fn"><a href="#src-matatu-dashcam-3" aria-label="Source 3">3</a>,<a href="#src-matatu-dashcam-4" aria-label="Source 4">4</a></sup>',
    },
  ],
  why: [
    'In March 2026 NTSA announced plans for real-time monitoring of drivers through telematics, dash cams and GPS.<sup class="fn"><a href="#src-matatu-dashcam-9" aria-label="Source 9">9</a></sup>',
    'In a Nairobi trial of trackers on 255 matatus, owners who saw the data had about 45% lower repair costs, and 98% of drivers said they preferred being monitored.<sup class="fn"><a href="#src-matatu-dashcam-10" aria-label="Source 10">10</a></sup>',
  ],
  knownShort: 'Waymo’s cars send potholes they detect to Waze.',
  askShort:
    'Pilot dash cams with one matatu SACCO, so detected changes reach WME as map issues for Nairobi editors to confirm.',
  ask: 'Pilot with one matatu SACCO using fleet dash cams that detect changes on repeat passes, as Bee Maps does. Change detections flow into WME as map issues for Nairobi editors to confirm.',
  sources: [
    {
      n: 1,
      label: 'Kenyans.co.ke: PSV numbers rise sharply in 2025 (7 May 2026)',
      url: 'https://www.kenyans.co.ke/news/123210-ntsa-driving-licences-hit-nearly-2-million-psv-numbers-rise-sharply-2025',
    },
    {
      n: 2,
      label: 'Waymo blog: Partnering with Waze to help cities patch their potholes (9 Apr 2026)',
      url: 'https://waymo.com/blog/2026/04/partnering-with-waze-to-help-cities-patch-their-potholes/',
    },
    {
      n: 3,
      label: 'Waze data feed: overview (Google for Developers)',
      url: 'https://developers.google.com/waze/data-feed/overview?hl=en',
    },
    {
      n: 4,
      label: 'Waze data feed: CIFS specification (Google for Developers)',
      url: 'https://developers.google.com/waze/data-feed/cifs-specification',
    },
    {
      n: 5,
      label: 'Waze blog: Gemini, motorcycle mode and more (13 Jul 2026)',
      url: 'https://blog.google/waze/waze-updates-gemini-motorcycle-mode/',
    },
    {
      n: 6,
      label: 'Bee Maps blog: How Bee Maps gets its coverage (12 Feb 2026)',
      url: 'https://beemaps.com/blog/how-bee-maps-gets-its-coverage',
    },
    {
      n: 7,
      label: 'Hivemapper blog: 2 million km mapped by contributors (28 Apr 2023)',
      url: 'https://beemaps.com/blog/2M-kilometers-closer-to-beating-Google-Maps',
    },
    {
      n: 8,
      label:
        'Bee Maps press release via Yahoo Finance: Bee Maps, powered by Hivemapper, raises $32M (6 Oct 2025)',
      url: 'https://finance.yahoo.com/news/bee-maps-powered-hivemapper-raises-130000855.html',
    },
    {
      n: 9,
      label: 'Kenyans.co.ke: NTSA announces digital monitoring of drivers (31 Mar 2026)',
      url: 'https://www.kenyans.co.ke/news/122134-ntsa-announces-mandatory-medical-checks-drivers-digital-monitoring-curb-road-accidents',
    },
    {
      n: 10,
      label: 'UC Santa Cruz News: monitoring technology in Kenya’s matatus (29 Oct 2024)',
      url: 'https://news.ucsc.edu/2024/10/worker-monitoring-technology-kenya-transit-systems/',
    },
    {
      n: 11,
      label: 'HERE Map Creator help: Mapillary information',
      url: 'https://mapcreator.here.com/2023.11.01/help/mapillary-information.html',
    },
    {
      n: 12,
      label: 'Mapillary blog: map features available globally in OpenStreetMap (24 Aug 2020)',
      url: 'https://blog.mapillary.com/update/2020/08/24/global-map-features-openstreetmap.html',
    },
  ],
};
