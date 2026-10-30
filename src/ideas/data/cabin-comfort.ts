import type { Idea } from '../types';

export const idea: Idea = {
  id: 'cabin-comfort',
  num: '01',
  group: 'ride',
  title: 'Smoothest ride',
  short: 'Smoothest ride',
  hook: 'Score every road for comfort from phone sensors, then route on it.',
  teams: ['In-car & Routing', 'Data'],
  problem:
    'In Nairobi a broken tarmac road can ride worse than a smooth murram one. The map knows paved, unpaved and, for the worst roads, “Off-road / Not maintained”; nothing grades the roads in between.<sup class="fn"><a href="#src-cabin-comfort-1" aria-label="Source 1">1</a></sup>',
  moment: {
    text: 'On many Nairobi roads the shortest route shakes the car hard, and a slightly longer road would be the smoother ride. Waze can’t offer that choice.',
  },
  known:
    'Ghana’s editors leave “unpaved” unused and “let the route speed statistics handle road quality”.<sup class="fn"><a href="#src-cabin-comfort-2" aria-label="Source 2">2</a></sup>',
  today:
    'Roads are paved, unpaved or “Off-road / Not maintained”; nothing grades the roads in between.<sup class="fn"><a href="#src-cabin-comfort-1" aria-label="Source 1">1</a></sup>',
  proposed:
    'Each road gets a comfort score from phones’ motion sensors, and an opt-in slider trades minutes for comfort.',
  howToday:
    'The only surface setting is “Unpaved roads”: Don’t allow, Allow or Avoid long ones.<sup class="fn"><a href="#src-cabin-comfort-3" aria-label="Source 3">3</a></sup> Editors mark a road unpaved with a yes/no box, or give a road “in a very bad state” the type “Off-road / Not maintained”, which carries a bigger routing penalty.<sup class="fn"><a href="#src-cabin-comfort-1" aria-label="Source 1">1</a></sup>',
  howProposed:
    'Phones already feel every jolt. Pooled over many trips, each road gets a comfort score: a graded version of the “Off-road / Not maintained” penalty, for every road. An opt-in slider then trades minutes for comfort, like a finer “Unpaved roads” setting.',
  also: [
    'Show a comfort score on each road.',
    'Warn before a rough stretch.',
    'Show editors the spots where jolts repeat, a likely new bump or pothole, and show when a repair stops them.',
  ],
  elsewhere: [
    {
      text: 'Since April 2026 Waymo’s cars detect potholes in five US metros and share them through Waze for Cities; Waze drivers are alerted as they approach and can verify them.<sup class="fn"><a href="#src-cabin-comfort-7" aria-label="Source 7">7</a></sup>',
    },
    {
      text: 'World Bank RoadLab (2015) estimates road roughness from a phone’s accelerometer, gyroscope and GPS, for road agencies.<sup class="fn"><a href="#src-cabin-comfort-8" aria-label="Source 8">8</a></sup>',
    },
    {
      text: 'Google Maps already routes on phone-sensor data: since 2021 it prefers the route with fewer hard-braking moments when ETAs are close.<sup class="fn"><a href="#src-cabin-comfort-9" aria-label="Source 9">9</a></sup>',
    },
    {
      text: 'I found no mainstream car navigation app with a smoothest-route option yet.',
      gap: true,
    },
  ],
  questions: [
    {
      q: 'Single readings are noisy.',
      a: 'Score each road from many trips, normalised for speed, phone mount and vehicle. Iowa DOT’s smartphone study calibrated for the same three.<sup class="fn"><a href="#src-cabin-comfort-10" aria-label="Source 10">10</a></sup>',
    },
    {
      q: 'Speed bumps are meant to be there.',
      a: 'Mapped bumps and other traffic calming don’t count against a road.',
    },
    {
      q: 'Drivers will cut through smooth estate roads.',
      a: 'Comfort is weighed against time and is opt-in. Private-road penalties, which exist to stop through-routing, still apply.<sup class="fn"><a href="#src-cabin-comfort-11" aria-label="Source 11">11</a></sup>',
    },
    {
      q: 'Privacy and battery.',
      a: 'Measure only while navigating, send scores rather than raw traces, and let drivers opt out.',
    },
  ],
  why: [
    '27% of Kenya’s 239,105 km road network was in poor condition in 2023.<sup class="fn"><a href="#src-cabin-comfort-4" aria-label="Source 4">4</a></sup>',
    'About a tenth of it is paved: 24,868 km in 2024.<sup class="fn"><a href="#src-cabin-comfort-5" aria-label="Source 5">5</a></sup>',
    'Nairobi potholes made the news again in 2026: craters 15–17 cm deep on Wood Avenue in April, then on Tom Mboya and Ronald Ngala streets, both busy matatu routes, in August.<sup class="fn"><a href="#src-cabin-comfort-6" aria-label="Source 6">6</a></sup>',
  ],
  ask: 'Score Nairobi’s roads from navigating phones for one month and show local editors the roughest spots. Kenyan editors can check them on the ground before anyone builds a route option.',
  sources: [
    {
      n: 1,
      label: 'Wazeopedia, East African Community: Roads',
      url: 'https://www.waze.com/discuss/t/roads/379772',
    },
    {
      n: 2,
      label: 'Ghana Wazeopedia: Welcome to the Ghana Wazeopedia (Oct 2025)',
      url: 'https://www.waze.com/discuss/t/welcome-to-the-ghana-wazeopedia/392802',
    },
    {
      n: 3,
      label: 'Waze Help: Avoid unpaved roads',
      url: 'https://support.google.com/waze/answer/14600080',
    },
    {
      n: 4,
      label: 'Kenya Roads Board: Annual Public Roads Programme 2024/25 (PDF)',
      url: 'https://krb.go.ke/our-downloads/aprp24-25.pdf',
    },
    {
      n: 5,
      label: 'Africa Check: fact-check on Kenya’s paved road length (23 Apr 2026)',
      url: 'https://africacheck.org/fact-checks/reports/price-middle-income-economy-fact-checking-kenyan-president-fuel-price-pain',
    },
    {
      n: 6,
      label: 'Kenyans.co.ke: Massive potholes trigger outcry in Nairobi CBD (27 Aug 2026)',
      url: 'https://www.kenyans.co.ke/news/126540-massive-potholes-trigger-outcry-over-deteriorating-roads-nairobi-cbd',
    },
    {
      n: 7,
      label: 'Waymo blog: Partnering with Waze to help cities patch their potholes (9 Apr 2026)',
      url: 'https://waymo.com/blog/2026/04/partnering-with-waze-to-help-cities-patch-their-potholes/',
    },
    {
      n: 8,
      label: 'Newswire: Road Lab by the World Bank (23 Jul 2015)',
      url: 'https://www.newswire.com/news/road-lab-by-the-world-bank',
    },
    {
      n: 9,
      label: 'Google blog: Five Maps updates from I/O 2021 (18 May 2021)',
      url: 'https://blog.google/products/maps/five-maps-updates-io-2021',
    },
    {
      n: 10,
      label: 'Iowa DOT research brief TR-777: smartphones to assess road conditions (2023, PDF)',
      url: 'https://publications.iowa.gov/49435/1/Research_Solutions_Brief_TR-777_Using_Smartphones_to_Efficiently_Assess_Road_Conditions.pdf',
    },
    {
      n: 11,
      label: 'Wazeopedia, USA Southeast: Private Roads',
      url: 'https://www.waze.com/discuss/t/southeast-privateroads/378813',
    },
  ],
};
