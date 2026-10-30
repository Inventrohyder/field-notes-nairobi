import type { Idea } from '../types';

export const idea: Idea = {
  id: 'checkpoints',
  num: '08',
  group: 'reports',
  title: 'Where checks are frequent',
  short: 'Frequent checkpoints',
  hook: 'A calm, early safety note where police checks often happen.',
  teams: ['Crisis Response & Traffic Events', 'Partners & Feeds'],
  problem:
    'On some Kenyan roads, traffic police checks recur at the same stretches. Live police reports come and go, so a driver can meet a check suddenly and brake hard.',
  moment: {
    text: 'On 6 April 2026, after Easter, NTSA and the National Police Service ran compliance checks at Uthiru on the Nairobi–Nakuru Highway as motorists drove back to the city.<sup class="fn"><a href="#src-checkpoints-1" aria-label="Source 1">1</a></sup>',
  },
  known:
    'Waze warns about crash-prone roads from history.<sup class="fn"><a href="#src-checkpoints-2" aria-label="Source 2">2</a></sup>',
  today:
    'Police reports are live only; nothing marks a stretch where checks recur.<sup class="fn"><a href="#src-checkpoints-3" aria-label="Source 3">3</a></sup>',
  proposed:
    'Where checks recur on a stretch, a calm note shows well ahead: “Frequent checks on this stretch. Slow down and keep your documents ready.”',
  howToday:
    'Drivers report police live, as Police, Mobile camera, Hidden or Other side, and later drivers can tap “Not there”.<sup class="fn"><a href="#src-checkpoints-3" aria-label="Source 3">3</a></sup> Crash history alerts already learn crash-prone roads from history.<sup class="fn"><a href="#src-checkpoints-2" aria-label="Source 2">2</a></sup> Nothing gives context for checks that recur on the same stretch.',
  howProposed:
    'Where police share planned checks through a partnership, or where police reports recur on a stretch, learned from report history, a calm note shows well ahead: “Frequent checks on this stretch. Slow down and keep your documents ready.” It never shows a live location from history, never reroutes around checks, and authorities can switch it off for an area. The same history helps <a href="../alert-timing/">idea 06</a>: prompts can be timed better, and stale reports expire faster.',
  elsewhere: [
    {
      text: 'Google Maps India (2025) gives accident-prone area alerts “based on authoritative data from city authorities”.<sup class="fn"><a href="#src-checkpoints-5" aria-label="Source 5">5</a></sup>',
    },
    {
      text: 'With the US Department of Transportation’s Volpe Center, the Tennessee Highway Patrol fed Waze crash and hazard reports into a model that predicts high-risk crash windows on interstates, and sends patrols to those corridors before crashes happen.<sup class="fn"><a href="#src-checkpoints-6" aria-label="Source 6">6</a></sup>',
    },
  ],
  questions: [
    {
      q: 'Doesn’t this help drivers avoid police?',
      a: 'It asks drivers to slow down and be ready. It never routes around checks and never shows a live location from history.',
    },
    {
      q: 'Will police object?',
      a: 'Offer it to police and road-agency partners first, and let authorities turn it off by area. Waze already partners with KeNHA in Kenya.<sup class="fn"><a href="#src-checkpoints-7" aria-label="Source 7">7</a></sup>',
    },
    {
      q: 'Laws differ by country.',
      a: 'Launch only where local rules allow. In France, a 2019 law lets the prefect order navigation services to hide messages near some police checks, for up to two hours for alcohol and drug tests and twelve hours for other checks.<sup class="fn"><a href="#src-checkpoints-8" aria-label="Source 8">8</a></sup>',
    },
    {
      q: 'Wasn’t a checkpoint hazard turned down?',
      a: 'A 2024 suggestion to show fixed checkpoints as permanent hazards was marked “Not Planned” in 2025.<sup class="fn"><a href="#src-checkpoints-9" aria-label="Source 9">9</a></sup> Kenya’s editing guide never adds mobile police controls as map hazards either.<sup class="fn"><a href="#src-checkpoints-10" aria-label="Source 10">10</a></sup> This is different: a safety note, fed first by partners, that never shows a live location and never reroutes.',
    },
  ],
  why: [
    'NTSA already announces planned checks: before Easter 2026 it said traffic officers, speed cameras and sobriety checkpoints would be deployed at strategic points with the National Police Service, to reduce fatal crashes.<sup class="fn"><a href="#src-checkpoints-4" aria-label="Source 4">4</a></sup>',
  ],
  ask: 'Pilot a “frequent checks” safety note in Kenya, fed first by police or KeNHA data through a partnership, and worded to encourage compliance.',
  sources: [
    {
      n: 1,
      label: 'The Star: NTSA sets up compliance checkpoints at Uthiru (6 Apr 2026)',
      url: 'https://www.the-star.co.ke/news/2026-04-06-ntsa-sets-up-compliance-checkpoints-at-uthiru',
    },
    {
      n: 2,
      label: 'Waze blog: Crash history alerts arrive to the Waze map (7 Nov 2023)',
      url: 'https://blog.google/waze/crash-history-alerts-arrive-to-the-waze-map/',
    },
    {
      n: 3,
      label: 'Waze Help: Report police sightings',
      url: 'https://support.google.com/waze/answer/13739289',
    },
    {
      n: 4,
      label:
        'Citizen Digital: NTSA to deploy speed cameras and sobriety checkpoints during Easter (2 Apr 2026)',
      url: 'https://citizen.digital/article/ntsa-to-deploy-speed-cameras-sobriety-checkpoints-during-easter-holiday-n380105',
    },
    {
      n: 5,
      label: 'Google India blog: new safety and disruption alerts in Maps (6 Nov 2025)',
      url: 'https://blog.google/intl/en-in/products/explore-communicate/google-maps-in-india-keeping-you-informed-with-new-safety-disruption-alerts/',
    },
    {
      n: 6,
      label: 'Waze case study: Using data to prevent crashes (Tennessee Highway Patrol)',
      url: 'https://www.waze.com/wazeforcities/casestudies/using-data-to-prevent-crashes',
    },
    {
      n: 7,
      label: 'Capital FM: KeNHA partners with Waze (14 Apr 2026)',
      url: 'https://capitalfm.africa/kenha-partners-with-waze-to-transform-road-navigation-for-kenyan-motorists/',
    },
    {
      n: 8,
      label:
        'Conseil d’État: decision no. 453763 on police-check messages in navigation services (6 Mar 2024)',
      url: 'https://www.conseil-etat.fr/fr/arianeweb/CE/decision/2024-03-06/453763',
    },
    {
      n: 9,
      label: 'Waze Suggestion Box: New permanent hazard, check-point (Not Planned, May 2025)',
      url: 'https://waze.uservoice.com/forums/59225-map-editor-suggestions/suggestions/48395462-new-permanent-hazard-check-point',
    },
    {
      n: 10,
      label: 'Wazeopedia, East African Community: Permanent Hazards (Mar 2025)',
      url: 'https://www.waze.com/discuss/t/permanent-hazards/379766',
    },
  ],
};
