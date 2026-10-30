/** Walkthrough data for the legacy scenes: what each idea asks the visitor to try, and the line icons for its later steps. */

export interface Spot {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label?: string;
  icon?: string;
  lit?: string;
  passive?: boolean;
}
export interface StoryEntry {
  try: string;
  done: string;
  hint?: string;
  spots?: Spot[];
  icons: { uses?: string[]; elsewhere?: string[]; questions?: string[]; why?: string[] };
}

export const STORY: Record<string, StoryEntry> = {
  'cabin-comfort': {
    try: 'Slide towards Smoothest.',
    done: 'That’s it: Waze takes the smoother road for a few extra minutes.',
    icons: {
      uses: ['gauge', 'warning', 'pin-check'],
      elsewhere: ['pothole', 'phone-waves', 'route', 'not-found'],
      questions: ['chart', 'road-bump', 'barrier', 'shield'],
      why: ['chart', 'ratio-bar', 'pothole'],
    },
  },
  'why-this-route': {
    try: 'Tap the turn to see why.',
    done: 'That’s it: the reason and the time saved show before the turn.',
    icons: {
      elsewhere: ['route', 'document'],
      why: ['crash', 'clock'],
    },
    spots: [
      {
        x: 112,
        y: 82,
        label: 'The turn at Makindu',
      },
    ],
  },
  'bump-speed': {
    try: 'Tap the bend to see the warning.',
    done: 'That’s it: the warning says how slow most drivers go.',
    icons: {
      elsewhere: ['warning', 'road-bump'],
      why: ['pin-check', 'globe', 'crash'],
    },
    spots: [
      {
        x: 108,
        y: 76,
        label: 'The sharp bend',
      },
    ],
  },
  'roundabout-lanes': {
    try: 'Tap the lanes at the entry.',
    done: 'That’s it: the instruction names the lanes.',
    icons: {
      elsewhere: ['lanes'],
      why: ['document'],
    },
    spots: [
      {
        x: 206,
        y: 151,
        label: 'The lanes into the roundabout',
      },
    ],
  },
  'police-junctions': {
    try: 'Tap the officer at the junction.',
    done: 'That’s it: the report explains the wait, and the ETA moves.',
    icons: {
      elsewhere: ['not-found'],
      why: ['government'],
    },
    spots: [
      {
        x: 160,
        y: 78,
        label: 'The officer directing traffic',
      },
    ],
  },
  'alert-timing': {
    try: 'Drag the car past the report.',
    done: 'That’s it: the question comes just after you pass.',
    icons: {
      elsewhere: ['bell', 'globe'],
      why: ['clock', 'police-cap'],
    },
  },
  'police-undivided': {
    try: 'Tap the car coming the other way.',
    done: 'That’s it: drivers in both directions get the alert.',
    icons: {
      elsewhere: ['lanes', 'police-cap'],
    },
    spots: [
      {
        x: 262,
        y: 112,
        label: 'The car coming the other way',
      },
    ],
  },
  checkpoints: {
    try: 'Drive into the stretch.',
    done: 'That’s it: an early, calm note and a gentle slowdown.',
    icons: {
      elsewhere: ['warning', 'chart'],
      questions: ['police-cap', 'government', 'globe', 'document'],
      why: ['police-cap'],
    },
  },
  'lane-followups': {
    try: 'Tap the lanes that are blocked.',
    done: 'That’s it: the route moves to the free lane.',
    icons: {
      elsewhere: ['lanes', 'not-found'],
      why: ['barrier'],
    },
    hint: 'Look for the crashed cars: two lanes are blocked.',
  },
  'closure-in-view': {
    try: 'Pick the direction that’s closed.',
    done: 'That’s it: the closure is sent for the road you can see.',
    icons: {
      elsewhere: ['pin-check'],
      why: ['barrier', 'police-cap', 'chat'],
    },
  },
  vendors: {
    try: 'Tap a vendor between the cars.',
    done: 'That’s it: drivers are warned that people are on the road.',
    icons: {
      elsewhere: ['crossing', 'not-found'],
      why: ['walker'],
    },
    spots: [
      {
        x: 146,
        y: 68,
        label: 'A vendor between the cars',
      },
    ],
  },
  mosques: {
    try: 'Set a time, or switch to distance.',
    done: 'That’s it: the stop is picked to fit your time or distance.',
    icons: {
      elsewhere: ['fuel', 'clock'],
      questions: ['shield', 'fuel'],
      why: ['globe', 'place-pin'],
    },
    hint: 'Nothing on the route fits that time yet. Try a later one.',
  },
  'black-spots': {
    try: 'Tap the curve ahead.',
    done: 'That’s it: the crash-prone stretch is marked before you reach it.',
    icons: {
      elsewhere: ['warning'],
      why: ['chart', 'crash'],
    },
    spots: [
      {
        x: 160,
        y: 70,
        label: 'The curve ahead',
      },
    ],
  },
  parking: {
    try: 'Tap your destination.',
    done: 'That’s it: the price shows before you park.',
    icons: {
      elsewhere: ['parking', 'coin'],
      why: ['coin', 'parking'],
    },
    spots: [
      {
        x: 210,
        y: 58,
        label: 'Your destination',
      },
    ],
  },
  'estate-bumps': {
    try: 'Tap the dark road ahead.',
    done: 'That’s it: the bumps and the drain are marked before you reach them.',
    icons: {
      elsewhere: ['warning'],
      why: ['streetlight'],
    },
    spots: [
      {
        x: 124,
        y: 134,
        label: 'The dark road ahead',
      },
    ],
  },
  'auto-map-issues': {
    try: 'Tap the map issue to confirm the new road.',
    done: 'That’s it: the old road that drivers stopped using is flagged, and an editor confirms the new one.',
    icons: {
      elsewhere: ['dashcam', 'satellite'],
      why: ['cone'],
    },
    spots: [
      {
        x: 160,
        y: 92,
        label: 'The map issue',
        icon: '!',
      },
    ],
  },
  'matatu-dashcam': {
    try: 'Tap each step of the loop.',
    done: 'That’s it: a change one matatu spots reaches every driver, once an editor confirms it.',
    icons: {
      elsewhere: ['dashcam', 'coin', 'globe', 'not-found', 'satellite'],
      questions: ['shield', 'signal', 'globe', 'coin', 'document'],
      why: ['government', 'matatu'],
    },
  },
  notifications: {
    try: 'Move the clock forward.',
    done: 'That’s it: old reminders clear themselves.',
    icons: {
      elsewhere: ['clock', 'lockscreen'],
    },
  },
  'quick-asks': {
    try: 'Tap Proposed.',
    done: 'That’s it: three small features to try in a Kenya beta.',
    icons: {
      elsewhere: ['people', 'lockscreen', 'chat'],
    },
  },
  'partners-reach': {
    try: 'Light up urban and rural roads.',
    done: 'That’s it: with KURA and KeRRA, every kind of road would have a partner.',
    icons: {
      elsewhere: ['government', 'signal'],
      why: ['chart', 'people'],
    },
    hint: 'One more to light up.',
    spots: [
      {
        x: 174,
        y: 76,
        w: 142,
        h: 58,
        lit: 'urban',
        label: 'Light up urban roads with KURA',
      },
      {
        x: 174,
        y: 140,
        w: 142,
        h: 58,
        lit: 'rural',
        label: 'Light up rural roads with KeRRA',
      },
    ],
  },
};

/** Animated line icons, drawn in a 48 by 48 box. */
export const ICONS: Record<string, string> = {
  'phone-waves':
    '<rect x="13" y="7" width="16" height="32" rx="3"/><path d="M18.5 34h5"/><path class="a k-wave" d="M33 18.5c2 2.5 2 7.5 0 10"/><path class="a k-wave k-d2" d="M37.5 14.5c4 4.5 4 13.5 0 18"/>',
  gauge:
    '<path d="M7 33a17 17 0 0 1 34 0"/><path d="M10 33h1M37 33h1M24 16v1.5M14.5 20.5l1 1M33.5 20.5l-1 1"/><path class="a k-swing" d="M24 33l8-9"/><circle class="f" cx="24" cy="33" r="2.6"/>',
  warning:
    '<g class="k-pulse"><path class="a" d="M24 7.5 42 39H6z"/><path d="M24 19v10"/><circle class="fi" cx="24" cy="34" r="1.5"/></g>',
  'pin-check':
    '<path d="M24 42s-12-12.6-12-21.5a12 12 0 0 1 24 0C36 29.4 24 42 24 42z"/><path class="a k-draw" pathLength="100" d="M18.5 21l4 4 7.5-8.5"/>',
  'road-bump':
    '<path d="M4 36h11c3.5 0 4.5-7 9-7s5.5 7 9 7h11"/><g class="k-hop"><path class="a" d="M19 21.5h10l2.5 4h-15z"/><path class="a" d="M15 25.5h18v3.5H15z"/><circle cx="19" cy="30" r="1.8"/><circle cx="29" cy="30" r="1.8"/></g>',
  dashcam:
    '<path d="M22 13V8h9"/><rect x="8" y="13" width="26" height="19" rx="3.5"/><circle cx="21" cy="22.5" r="5.5"/><circle cx="21" cy="22.5" r="2"/><path d="M34 18.5l6-3v14l-6-3"/><circle class="f k-blink" cx="12.5" cy="17.5" r="1.8"/>',
  matatu:
    '<g class="k-bob"><path d="M5 31V15.5A3.5 3.5 0 0 1 8.5 12H33l8 8v11z"/><path d="M9 16h7v5H9zM19 16h7v5h-7zM29 16h4l4 5h-8z"/><path class="a" d="M5 26.5h36"/></g><circle cx="13" cy="33" r="3.2"/><circle cx="33" cy="33" r="3.2"/>',
  satellite:
    '<g class="k-orbit"><rect x="20" y="10" width="8" height="10" rx="1.5"/><path d="M20 15h-9M28 15h9"/><rect x="5" y="12" width="6" height="6" rx="1"/><rect x="37" y="12" width="6" height="6" rx="1"/><path d="M24 20v3"/></g><path class="a k-wave" d="M18 29c3.5 2.5 8.5 2.5 12 0"/><path class="a k-wave k-d2" d="M14 34c5.5 4 14.5 4 20 0"/><path d="M8 42h32"/>',
  chart:
    '<path d="M8 7v33h33"/><path class="a k-draw" pathLength="100" d="M12 33l7-8 6 4 8-13 7 3"/>',
  people:
    '<circle cx="14" cy="17" r="4"/><path d="M7 31c0-4.5 3-7.5 7-7.5s7 3 7 7.5"/><circle cx="34" cy="17" r="4"/><path d="M27 31c0-4.5 3-7.5 7-7.5s7 3 7 7.5"/><g class="k-pop"><circle class="a" cx="24" cy="21" r="4.5"/><path class="a" d="M16 38c0-5 3.5-8.5 8-8.5s8 3.5 8 8.5"/></g>',
  shield:
    '<path d="M24 6l14 5v11c0 9.5-6 15.5-14 19.5C16 37.5 10 31.5 10 22V11z"/><path class="a k-draw" pathLength="100" d="M17.5 23.5l5 5 8.5-9.5"/>',
  battery:
    '<rect x="7" y="15" width="30" height="18" rx="3.5"/><path d="M40 21v6"/><rect class="f k-grow" x="10.5" y="18.5" width="23" height="11" rx="1.5"/>',
  globe:
    '<circle cx="24" cy="24" r="16"/><path d="M8 24h32M10.5 16h27M10.5 32h27"/><ellipse class="a k-turn" cx="24" cy="24" rx="7" ry="16"/>',
  government:
    '<path d="M24 9.5V3"/><path class="a k-flag" d="M24 3h7.5l-2.2 2.2 2.2 2.2H24"/><path d="M7 18 24 9.5 41 18z"/><path d="M11 21.5v12.5M18 21.5v12.5M30 21.5v12.5M37 21.5v12.5"/><path d="M8 37h32M6 41.5h36"/>',
  document:
    '<path d="M12 6h17l8 8v28H12z"/><path d="M29 6v8h8"/><path class="a k-draw" pathLength="100" d="M17 22h14M17 28h14M17 34h9"/>',
  lockscreen:
    '<rect x="13" y="4.5" width="22" height="39" rx="4"/><path d="M20.5 11h7"/><rect class="a k-slide" x="16.5" y="16" width="15" height="7" rx="2"/><rect x="16.5" y="26" width="15" height="7" rx="2" opacity=".45"/>',
  clock:
    '<circle cx="24" cy="24" r="16"/><path class="k-spin" d="M24 24V13"/><path class="a" d="M24 24l6.5 4"/><circle class="fi" cx="24" cy="24" r="1.6"/>',
  'place-pin':
    '<g class="k-drop"><path d="M24 43s-13-13.3-13-22.8a13 13 0 0 1 26 0C37 29.7 24 43 24 43z"/><path class="a" d="M18.5 26v-5.5a5.5 5.5 0 0 1 11 0V26zM17 26h14M24 13.5v1.5"/></g>',
  fuel: '<rect x="9" y="9" width="17" height="31" rx="2.5"/><rect x="12.5" y="13" width="10" height="7" rx="1"/><path d="M26 18h4l4 4v12.5a2 2 0 0 1-4 0V29h-4"/><path d="M7 40h21"/><path class="a k-drip" d="M17.5 26.5c-2 2.8-2 4.6 0 5.5 2-.9 2-2.7 0-5.5z"/>',
  parking:
    '<g class="k-pulse"><rect x="10" y="6" width="28" height="28" rx="4.5"/><path class="a" d="M20 28V13h6.5a4.5 4.5 0 0 1 0 9H20"/></g><path d="M24 34v8"/>',
  lanes:
    '<path d="M9 42 16 6M39 42 32 6"/><path class="d" d="M20.5 42l2.5-14M27.5 42 25 28"/><path class="a k-shift" d="M24 31V17m-4 4l4-4 4 4"/>',
  'police-cap':
    '<g class="k-tilt"><path d="M7 23c5-9.5 29-9.5 34 0l-3.5 6.5h-27z"/><path d="M10.5 29.5c4.5 3.5 22.5 3.5 27 0"/><path class="a" d="M24 14.5l2.4 3.3-2.4 3.3-2.4-3.3z"/></g>',
  chat: '<path d="M7 11h34v21H22l-8.5 7v-7H7z"/><circle class="f k-dot" cx="17" cy="21.5" r="2.2"/><circle class="f k-dot k-d2" cx="24" cy="21.5" r="2.2"/><circle class="f k-dot k-d3" cx="31" cy="21.5" r="2.2"/>',
  'phone-call':
    '<path class="k-tilt" d="M15 8h5.5l3 8-4 3c2 4.2 5.5 7.8 9.7 9.8l3-4 8 3v5.7c0 2.2-1.8 4-4 4C20.3 37.5 10.5 27.7 10.5 12.4c0-2.4 2-4.4 4.5-4.4z"/><path class="a k-wave" d="M30 8.5a9 9 0 0 1 9 9"/><path class="a k-wave k-d2" d="M30.5 3a14.5 14.5 0 0 1 14.5 14.5"/>',
  'not-found':
    '<rect class="d" x="6" y="15" width="25" height="25" rx="3.5"/><g class="k-sweep"><circle class="a" cx="30" cy="19" r="7.5"/><path class="a" d="M35.5 24.5 42 31"/></g>',
  route:
    '<circle cx="9.5" cy="37" r="3"/><circle cx="38.5" cy="11" r="3"/><path class="d" d="M12 35 36 13.5"/><path class="a k-draw" pathLength="100" d="M12 38.5c8 2 14-2 16.5-10S33 15 36 13"/>',
  crash:
    '<g class="k-left"><path d="M5 28V23a3 3 0 0 1 3-3h7l4 4v4z"/><circle cx="9" cy="29.5" r="2"/><circle cx="16" cy="29.5" r="2"/></g><g class="k-right"><path d="M43 28V23a3 3 0 0 0-3-3h-7l-4 4v4z"/><circle cx="39" cy="29.5" r="2"/><circle cx="32" cy="29.5" r="2"/></g><path class="a k-pulse" d="M24 9v6M18.5 12l3 4M29.5 12l-3 4"/><path d="M4 36h40"/>',
  barrier:
    '<path d="M11 27v14M37 27v14"/><rect class="a" x="5" y="18" width="38" height="9" rx="1.5"/><path d="M11 18l5 9M20 18l5 9M29 18l5 9"/><g class="k-blink"><circle class="f" cx="11" cy="13" r="2.2"/><circle class="f" cx="37" cy="13" r="2.2"/></g>',
  coin: '<ellipse cx="24" cy="33" rx="13" ry="5"/><path d="M11 33v-6c0 2.8 5.8 5 13 5s13-2.2 13-5v6"/><g class="k-drop"><ellipse class="a" cx="24" cy="15" rx="9" ry="4"/><path class="a" d="M15 15v4c0 2.2 4 4 9 4s9-1.8 9-4v-4"/></g>',
  bell: '<g class="k-ring"><path d="M14 31V21.5a10 10 0 0 1 20 0V31l3.5 4h-27z"/><path d="M21 38.5a3 3 0 0 0 6 0"/></g><path class="a k-wave" d="M36.5 12.5c2 1.5 3 3.5 3.5 6"/><path class="a k-wave k-d2" d="M11.5 12.5c-2 1.5-3 3.5-3.5 6"/>',
  cone: '<g class="k-pulse"><path class="a" d="M19.5 9h9l7.5 29h-24z"/><path d="M16.5 22h15M14.5 30h19"/></g><path d="M8 38.5h32"/>',
  walker:
    '<g class="k-walk"><circle cx="25" cy="8.5" r="3.2"/><path d="M24.5 13.5l-2.5 12 5 5.5 1.5 10M22 25.5l-5 6.5-1.5 9M23.5 16.5l-6.5 5M24.5 16.5l6 4"/></g><path d="M6 42.5h36"/>',
  streetlight:
    '<path d="M15 43V13a7 7 0 0 1 7-7h9"/><path d="M31 6v3.5"/><path class="a" d="M26.5 9.5h9l-4.5 5z"/><path class="a k-glow" d="M27 19l-3 6M31 19.5v7M35 19l3 6"/><path d="M10 43h10"/>',
  signal:
    '<path class="a k-rise" d="M9 38v-4"/><path class="a k-rise k-d2" d="M16 38v-9"/><path class="a k-rise k-d3" d="M23 38v-14"/><path class="a k-rise k-d4" d="M30 38v-19"/><path class="a k-rise k-d5" d="M37 38V14"/><path d="M6 42h36"/>',
  pothole:
    '<path d="M5 13h38M5 41h38"/><path class="d" d="M5 27h7M36 27h7"/><g class="k-pulse"><ellipse class="a" cx="24" cy="27" rx="9.5" ry="4.5"/><path class="a" d="M15.5 25.5l-3.5-3M32.5 25.5l4-3.5M24 31.5l1 4.5"/></g>',
  crossing:
    '<path d="M5 11h38M5 37h38"/><rect class="f k-rise" x="9" y="15" width="4" height="18" rx="1"/><rect class="f k-rise k-d2" x="17" y="15" width="4" height="18" rx="1"/><rect class="f k-rise k-d3" x="25" y="15" width="4" height="18" rx="1"/><rect class="f k-rise k-d4" x="33" y="15" width="4" height="18" rx="1"/><path d="M40 42l3-3-3-3"/>',
  'ratio-bar':
    '<rect class="f k-pop" x="6.0" y="17" width="2.6" height="14" rx="0.8"/><rect x="9.7" y="17" width="2.6" height="14" rx="0.8"/><rect x="13.4" y="17" width="2.6" height="14" rx="0.8"/><rect x="17.1" y="17" width="2.6" height="14" rx="0.8"/><rect x="20.8" y="17" width="2.6" height="14" rx="0.8"/><rect x="24.5" y="17" width="2.6" height="14" rx="0.8"/><rect x="28.2" y="17" width="2.6" height="14" rx="0.8"/><rect x="31.9" y="17" width="2.6" height="14" rx="0.8"/><rect x="35.6" y="17" width="2.6" height="14" rx="0.8"/><rect x="39.3" y="17" width="2.6" height="14" rx="0.8"/><path d="M6 37h36"/>',
};
