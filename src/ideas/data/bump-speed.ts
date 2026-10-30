import type { Idea } from '../types';

/** Screenshot paths are relative to the site base. */
export const idea: Idea = {
  id: 'bump-speed',
  num: '03',
  group: 'ride',
  title: 'Safe speed for bumps and bends',
  short: 'Safe speed at bumps and bends',
  hook: 'Tell drivers the speed most people take at each bump and bend.',
  teams: ['In-car & Routing', 'Data'],
  problem: 'Waze can warn of a mapped bump or bend, but it never says how slow to go.',
  moment: {
    text: 'Arboretum Road into State House Road is a sharp bend. Nothing on this screen warns about it.',
    shots: [
      {
        src: 'screenshots/03-arboretum-bend.jpg',
        alt: 'Navigation screenshot at night on Arboretum Road, showing a sharp right turn onto State House Road.',
        caption: 'My screenshot: Arboretum Rd into State House Rd, Nairobi.',
      },
    ],
  },
  known:
    'Waze warns of speed bumps and sharp curves ahead.<sup class="fn"><a href="#src-bump-speed-1" aria-label="Source 1">1</a></sup>',
  today:
    'Waze warns 500 m before a mapped bump or bend, with no speed advice.<sup class="fn"><a href="#src-bump-speed-2" aria-label="Source 2">2</a></sup>',
  proposed: 'The warning says the speed most drivers take there, timed to my speed.',
  howToday:
    'Since 2024 Waze warns of speed bumps and sharp curves that editors map.<sup class="fn"><a href="#src-bump-speed-1" aria-label="Source 1">1</a></sup> The alert comes 500 m before, with no speed advice, and the same alert shows at most twice before it is hidden for 21 days.<sup class="fn"><a href="#src-bump-speed-2" aria-label="Source 2">2</a></sup> In Kenya only the first bump in 500 m alerts, and Dangerous Curve is kept for “accident-prone curves” and the first bend of a mountain road.<sup class="fn"><a href="#src-bump-speed-3" aria-label="Source 3">3</a></sup> I found nothing saying speed plays a part.',
  howProposed:
    'Waze already builds ETAs from real driving speeds.<sup class="fn"><a href="#src-bump-speed-4" aria-label="Source 4">4</a></sup> The same data can show the speed most drivers take at each mapped bump and bend, and time the warning to my speed.',
  elsewhere: [
    {
      text: 'India’s road ministry, IIT Madras and MapmyIndia launched a free app in 2021 with voice alerts for speed breakers, sharp curves and potholes.<sup class="fn"><a href="#src-bump-speed-7" aria-label="Source 7">7</a></sup>',
    },
    {
      text: 'Mercedes-Benz warns drivers of speed bumps detected by other Mercedes cars, about 10 seconds ahead (2021).<sup class="fn"><a href="#src-bump-speed-8" aria-label="Source 8">8</a></sup>',
    },
  ],
  why: [
    'Permanent hazards are locked to rank 4+ editors.<sup class="fn"><a href="#src-bump-speed-3" aria-label="Source 3">3</a></sup> Editors below rank 4 can only ask a rank 4 editor to map a bend like this one, through community channels.',
    'The “big or destructive speed bump” option exists in Mexico, India, Israel, Italy and other countries, but not in Kenya.<sup class="fn"><a href="#src-bump-speed-5" aria-label="Source 5">5</a></sup>',
    'KeNHA adds bumps after crashes, as on a Namanga Road black spot after at least 13 deaths in one month in 2025.<sup class="fn"><a href="#src-bump-speed-6" aria-label="Source 6">6</a></sup>',
  ],
  ask: 'In one pilot city, add “most drivers slow to X km/h” to mapped sharp curves, from speeds Waze already has. A question for the team: is distance the only trigger for these alerts, or does speed play a part?',
  sources: [
    {
      n: 1,
      label: 'Google Canada blog: 6 updates to Waze (5 Mar 2024)',
      url: 'https://blog.google/intl/en-ca/products/android-chrome-more/6-updates-to-waze',
    },
    {
      n: 2,
      label: 'Wazeopedia: Adding Permanent Hazards in the WME',
      url: 'https://www.waze.com/discuss/t/adding-permanent-hazards-in-the-wme/379692',
    },
    {
      n: 3,
      label: 'Wazeopedia, East African Community: Permanent Hazards (Mar 2025)',
      url: 'https://www.waze.com/discuss/t/permanent-hazards/379766',
    },
    {
      n: 4,
      label: 'Wazeopedia, Australia: Understanding ETAs, traffic models and types of days',
      url: 'https://wazeopedia.waze.com/wiki/Australia/Knowledge_Sharing/Understanding_ETAs_traffic_models_types_of_days',
    },
    {
      n: 5,
      label: 'Global Wazeopedia: Permanent Hazards Phase 1',
      url: 'https://wazeopedia.waze.com/wiki/Global/Permanent_Hazards_Phase_1',
    },
    {
      n: 6,
      label: 'Nation: KeNHA installs bumps at Namanga highway black spot (24 Aug 2025)',
      url: 'https://beta.nation.co.ke/kenya/counties/kajiado/kenha-installs-bumps-at-namanga-highway-black-spot-after-13-deaths-in-a-month-5165736',
    },
    {
      n: 7,
      label:
        'Mobility Outlook: MoRTH, IIT Madras and MapmyIndia launch navigation app (17 Dec 2021)',
      url: 'https://mobilityoutlook.com/news/morth-iit-madras-mapmyindia-sign-mou-launch-indigenous-navigation-app',
    },
    {
      n: 8,
      label: 'Automotive Fleet: Mercedes launches pothole and speed bump detection (16 Aug 2021)',
      url: 'https://www.automotive-fleet.com/news/mercedes-launches-pothole-speed-bump-detection-on-select-models',
    },
  ],
};
