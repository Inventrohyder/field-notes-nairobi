import type { Idea } from '../types';

export const idea: Idea = {
  id: 'mosques',
  num: '13',
  group: 'map',
  title: 'Stops that fit your time and distance',
  short: 'Stops by time or distance',
  hook: 'Find a stop by a time or within a distance.',
  teams: ['App Product', 'WME & Geo Collaboration'],
  problem:
    'On long drives, people need to stop by a certain time or within a certain distance: to pray, eat, refuel or rest. Waze can add a stop, but it can’t find one along the route for a given time or distance.',
  moment: {
    text: 'On a long drive I want to reach a mosque along the way by 13:15 for Dhuhr. The app has no way to take that time into account.',
  },
  known:
    'You plan a drive to arrive somewhere on time, and Waze tells you when to leave.<sup class="fn"><a href="#src-mosques-1" aria-label="Source 1">1</a></sup>',
  today:
    '“Add a stop” has no arrival time or distance to aim for.<sup class="fn"><a href="#src-mosques-2" aria-label="Source 2">2</a></sup>',
  proposed:
    'Ask for “a mosque by 13:30” or a stop within a distance, and Waze picks the smallest detour.',
  howToday:
    '“Add a stop” suggests stops such as food, gas and parking, one stop per route, with no arrival time to aim for.<sup class="fn"><a href="#src-mosques-2" aria-label="Source 2">2</a></sup> Gemini destination search (“Find me a coffee shop that’s open right now”) has been in global beta since July 2026, and personalised navigation suggests routes based on previous trips.<sup class="fn"><a href="#src-mosques-3" aria-label="Source 3">3</a></sup> Kenya’s editing guide has one religious category, Religious Center, with no mosque, church or temple sub-type.<sup class="fn"><a href="#src-mosques-4" aria-label="Source 4">4</a></sup>',
  howProposed:
    'Ask the way you would ask a person: “a mosque by 13:30”, “a restaurant by 14:00”, “a petrol station within the next 200 km”. Waze finds places along the route that meet the time or distance limit with the smallest detour, and re-plans if the drive runs late. Opt-in remembered preferences shape the suggestions, such as vegetarian, vegan or halal food, or stopping to pray; drivers see, edit and delete them, and nothing is guessed. For mosques, add Mosque, Church and Temple sub-categories under Religious Center, and let local editors add congregation and Friday prayer times to the place’s hours. Prayer start times can be calculated, but each mosque sets its own congregation time.<sup class="fn"><a href="#src-mosques-12" aria-label="Source 12">12</a></sup>',
  elsewhere: [
    {
      text: 'Google Maps can search for stops along a route by type of place, such as petrol stations, restaurants or a pharmacy; its help page does not mention places of worship.<sup class="fn"><a href="#src-mosques-7" aria-label="Source 7">7</a></sup>',
    },
    {
      text: 'Editors can already add opening hours to places in the Waze Map Editor, with different times for each day of the week.<sup class="fn"><a href="#src-mosques-8" aria-label="Source 8">8</a></sup>',
    },
  ],
  questions: [
    {
      q: 'Religion and diet are sensitive.',
      a: 'Remembered preferences are opt-in, visible and deletable, and never inferred. Kenya’s Data Protection Act counts data revealing a person’s “conscience, belief” as sensitive personal data.<sup class="fn"><a href="#src-mosques-9" aria-label="Source 9">9</a></sup> In the EU, GDPR Article 9 does the same for “religious or philosophical beliefs”, which may be processed with explicit consent.<sup class="fn"><a href="#src-mosques-10" aria-label="Source 10">10</a>,<a href="#src-mosques-11" aria-label="Source 11">11</a></sup>',
    },
    {
      q: 'Why distance as well as time?',
      a: 'On long highways fuel stations can be far apart, so a distance limit helps drivers plan the next stop.',
    },
  ],
  why: [
    'There were 2.0 billion Muslims in 2020, 25.6% of the world’s population.<sup class="fn"><a href="#src-mosques-5" aria-label="Source 5">5</a></sup>',
    '5.15 million Kenyans, 10.9%, are Muslim, including about 327,000 in Nairobi (2019 census).<sup class="fn"><a href="#src-mosques-6" aria-label="Source 6">6</a></sup>',
  ],
  knownShort: 'Plan a drive to arrive on time, and Waze says when to leave.',
  askShort:
    'Pilot stops by arrival time or distance in Kenya, with mosque congregation times added by local editors.',
  ask: 'Pilot stops by arrival time or distance for Religious Center, fuel and food in Kenya, with mosque sub-categories and congregation times added by local editors.',
  sources: [
    {
      n: 1,
      label: 'Waze Help: Get a reminder when it’s time to leave',
      url: 'https://support.google.com/waze/answer/7502125',
    },
    {
      n: 2,
      label: 'Waze Help: Add a stop to your route',
      url: 'https://support.google.com/waze/answer/6262564?hl=en',
    },
    {
      n: 3,
      label: 'Waze blog: Gemini, motorcycle mode and more (13 Jul 2026)',
      url: 'https://blog.google/waze/waze-updates-gemini-motorcycle-mode/',
    },
    {
      n: 4,
      label: 'Wazeopedia, East African Community: Places (Mar 2025)',
      url: 'https://www.waze.com/discuss/t/places/379773',
    },
    {
      n: 5,
      label:
        'Pew Research Center: Islam was the world’s fastest-growing religion from 2010 to 2020 (10 Jun 2025)',
      url: 'https://www.pewresearch.org/short-reads/2025/06/10/islam-was-the-worlds-fastest-growing-religion-from-2010-to-2020/',
    },
    {
      n: 6,
      label:
        'KNBS 2019 Census, Vol. IV, Table 2.30: religious affiliation by county (PDF via Africa Check)',
      url: 'https://africacheck.org/sites/default/files/media/documents/2024-04/Kenya-Religion-%20Statistics-2019.pdf',
    },
    {
      n: 7,
      label: 'Google Maps Help: Search along your route',
      url: 'https://support.google.com/maps/answer/9432062?hl=en-IN',
    },
    {
      n: 8,
      label: 'Wazeopedia, Malaysia: Places (opening hours)',
      url: 'https://waze.com/wiki/Malaysia/Places/en',
    },
    {
      n: 9,
      label: 'Kenya: The Data Protection Act, No. 24 of 2019 (ODPC, PDF)',
      url: 'https://www.odpc.go.ke/wp-content/uploads/2024/02/TheDataProtectionAct__No24of2019.pdf',
    },
    {
      n: 10,
      label: 'EUR-Lex: Regulation (EU) 2016/679 (GDPR), official text, Article 9',
      url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng',
    },
    {
      n: 11,
      label: 'European Commission: What personal data is considered sensitive?',
      url: 'https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/legal-grounds-processing-data/sensitive-data/what-personal-data-considered-sensitive_en',
    },
    {
      n: 12,
      label: 'East London Mosque: Prayer times and calendar explained',
      url: 'https://www.eastlondonmosque.org.uk/prayer-times-and-calendar-explained',
    },
  ],
  shortOnTime: true,
};
