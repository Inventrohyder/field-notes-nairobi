import type { Idea } from '../types';

export const idea: Idea = {
  id: 'estate-bumps',
  num: '16',
  group: 'map',
  title: 'Map the bumps inside estates',
  short: 'Estate bumps',
  hook: 'Map bumps and drains on estate roads for night and floods.',
  teams: ['Hyperlocal', 'WME & Geo Collaboration'],
  problem:
    'In floods and on unlit estate roads, bumps and drainage channels disappear. Drivers find them the hard way.',
  moment: {
    text: '6–7 March 2026: floods killed 23 people across more than ten Nairobi estates and caught at least 71 vehicles.<sup class="fn"><a href="#src-estate-bumps-1" aria-label="Source 1">1</a>,<a href="#src-estate-bumps-2" aria-label="Source 2">2</a></sup>',
  },
  known:
    'Editors map speed bumps as permanent hazards, and the app warns drivers before them.<sup class="fn"><a href="#src-estate-bumps-3" aria-label="Source 3">3</a></sup>',
  today:
    'Permanent hazards need rank 4+, and in Kenya only the first bump in 500 m alerts.<sup class="fn"><a href="#src-estate-bumps-3" aria-label="Source 3">3</a></sup>',
  proposed:
    'Local editors map bumps and drains on estate roads, and the app warns of them when a street is unlit or flooded.',
  howToday:
    'Permanent hazards need rank 4+, and in Kenya only the first bump in 500 m alerts.<sup class="fn"><a href="#src-estate-bumps-3" aria-label="Source 3">3</a></sup> Roads inside closed estates are mapped as private roads, mainly to stop through-routing, and some countries’ rules keep permanent hazards off private roads altogether.<sup class="fn"><a href="#src-estate-bumps-4" aria-label="Source 4">4</a>,<a href="#src-estate-bumps-5" aria-label="Source 5">5</a></sup>',
  howProposed:
    'Local editors map bumps and drains on estate roads, and the app warns of them when a street is unlit or flooded.',
  elsewhere: [
    {
      text: 'Waze’s own Hyperlocal Permanent Alerts (June 2026) list unlit streets and flood-prone roads as future phases, with weather alerts shown only when conditions call for them. This idea fits that plan.<sup class="fn"><a href="#src-estate-bumps-7" aria-label="Source 7">7</a></sup>',
    },
  ],
  why: [
    'Nairobi and the national government plan to revive 40,000 existing street lights and add 10,000 new ones (April 2026).<sup class="fn"><a href="#src-estate-bumps-6" aria-label="Source 6">6</a></sup>',
  ],
  knownShort: 'Editors map speed bumps, and the app warns before them.',
  ask: 'When the unlit-street and flooding phases reach Kenya, include estate roads, and let local editors map their bumps and drains.',
  sources: [
    {
      n: 1,
      label: 'People Daily: Nairobi flood death toll hits 23 (7 Mar 2026)',
      url: 'https://peopledaily.digital/news/death-toll-from-nairobi-flooding-hits-23-as-over-10-estates-are-affected/amp',
    },
    {
      n: 2,
      label: 'Kenyans.co.ke: 71 cars caught in Nairobi floods, police confirm (7 Mar 2026)',
      url: 'https://www.kenyans.co.ke/news/121454-10-killed-71-cars-destroyed-nairobi-floods-police-confirm',
    },
    {
      n: 3,
      label: 'Wazeopedia, East African Community: Permanent Hazards (Mar 2025)',
      url: 'https://www.waze.com/discuss/t/permanent-hazards/379766',
    },
    {
      n: 4,
      label: 'Wazeopedia, East African Community: Roads',
      url: 'https://www.waze.com/discuss/t/roads/379772',
    },
    {
      n: 5,
      label: 'Wazeopedia, Australia: Permanent hazard types (Sep 2026)',
      url: 'https://www.waze.com/discuss/t/permanent-hazards/375473',
    },
    {
      n: 6,
      label: 'Citizen Digital: plan to make Nairobi brighter within six months (9 Apr 2026)',
      url: 'https://citizen.digital/article/ruto-promises-to-make-nairobi-brighter-safer-more-secure-within-six-months-n380456',
    },
    {
      n: 7,
      label:
        'Waze Discuss (Portuguese): Hyperlocal Permanent Alerts now in WME production (Jun 2026)',
      url: 'https://www.waze.com/discuss/t/novos-alertas-permanentes-hiperlocais-ja-estao-disponiveis-no-wme-producao/406466',
    },
  ],
};
