import type { Idea } from './types';
import type { Scenario } from '../scenario/types';

const ID = 'report-followup';

/** Footnote markup that links to the numbered source list on the idea page. */
export function fn(n: number): string {
  return `<sup class="fn"><a href="#src-${ID}-${n}" aria-label="Source ${n}">${n}</a></sup>`;
}

export const FOLLOWUP_INTRO =
  'You can get a follow-up call about two kinds of report. Which do you want to play?';

export const followupIdea: Idea = {
  id: ID,
  num: '10',
  group: 'reports',
  title: 'A quick follow-up after the drive',
  short: 'Follow-up after the drive',
  hook: 'After parking, an opt-in AI call fills in reports and update requests.',
  teams: ['App Product', 'Crisis Response & Traffic Events'],
  problem:
    'Reports made at the wheel are short, and editors’ questions on map issues often go unanswered, so reports lose detail.',
  moment: {
    text: `On 9 April 2026 police restricted roads around Parliament “until the activities are over”. A report of that closure carries no end time, and the editor has to ask.${fn(1)}`,
  },
  known: 'After a ride-hailing trip, the ride app asks you to rate it once you’ve arrived.',
  today: `Waze already asks follow-ups while you report by voice, and asks for details on map issues sent without a description. The answers often never come.${fn(4)}`,
  proposed:
    'For drivers who opt in, Waze’s AI assistant calls once the car is parked, asks up to three questions that fit the report, and attaches the answers for local editors.',
  howToday: `<p>Waze already asks follow-ups while you report by voice, such as “Can you describe what you see?”${fn(2)} Since July 2026 a spoken “The road is closed here” goes to local map editors.${fn(3)}</p>
<p>Since May 2026, a map issue sent without a description gets an automatic comment asking the driver for details.${fn(7)}${fn(8)} Replies to map issues arrive later in the app’s Inbox.${fn(9)} When an editor needs more, the Australian guidance is to send a reminder after 4 days and close the request 2 days later.${fn(4)}</p>`,
  howProposed: `<p>For drivers who opt in, Waze’s AI assistant follows up after the trip, before they forget: “You reported roadworks on Uhuru Highway. Three quick questions: which lanes, which direction, and for how long?” It covers high-value reports only, such as closures, roadworks, new or changed roads and map issues, within a couple of hours of parking and at most once a day.</p>
<p>It calls only once the car is parked, never while moving or waiting in traffic. The driver can answer, ask for a text, or ask for a call later; the callback comes once. Every follow-up opens with a replay of the drive up to the spot. For a map issue such as Turn not allowed, the driver taps the turn on the replay and says why.</p>
<p>Editors’ questions count too: when a local editor asks something on a driver’s update request, the assistant can ask it after the drive and attach the answer to the request.${fn(4)} It calls by voice first, in a natural local voice in English or Swahili, always says it is Waze’s AI assistant, and falls back to text.</p>`,
  elsewhere: [
    {
      text: 'Waze asks its follow-up during the report; I have not seen a navigation app follow up after the drive.',
      gap: true,
    },
  ],
  questions: [
    {
      q: 'Consent',
      a: `Only drivers who opt in get a follow-up, and they can stop at any time. Kenya’s Data Protection Act 2019 requires consent that is “express, unequivocal, free, specific and informed”, and lets people withdraw it at any time.${fn(5)}`,
    },
    {
      q: 'AI disclosure',
      a: `The assistant always says it is Waze’s AI. In the EU, the AI Act’s Article 50 duty to tell people they are talking to an AI applies from 2 August 2026.${fn(6)}`,
    },
    {
      q: 'Cost',
      a: 'Only high-value reports and opted-in reporters, and at most one follow-up a day.',
    },
    {
      q: 'Never while driving',
      a: 'The follow-up waits until the car is parked. At a red light or in a jam, it stays quiet.',
    },
  ],
  why: [
    `Reporters rarely answer: the Australian editing guidance notes that “most URs do not return with a reply” (URs are update requests, the map issues drivers send).${fn(4)}`,
    `Waze already asks for details on map issues sent without a description; the reply depends on the driver opening the Inbox later.${fn(7)}${fn(8)}${fn(9)}`,
  ],
  ask: 'Pilot an opt-in voice follow-up for closure reports and map issues with Nairobi reporters, with answers attached for local editors.',
  sources: [
    {
      n: 1,
      label: 'Citizen Digital: Key CBD roads closed for presidential visit (9 Apr 2026)',
      url: 'https://citizen.digital/article/key-roads-closed-in-nairobi-cbd-as-ruto-visits-kicc-county-assembly-n380429',
    },
    {
      n: 2,
      label: 'Waze blog: New road reporting features coming to Waze (31 Oct 2024)',
      url: 'https://blog.google/waze/conversational-reporting-waze/',
    },
    {
      n: 3,
      label: 'Waze blog: Gemini, motorcycle mode and more (13 Jul 2026)',
      url: 'https://blog.google/waze/waze-updates-gemini-motorcycle-mode/',
    },
    {
      n: 4,
      label: 'Wazeopedia, Australia: Update Reports',
      url: 'https://wazeopedia.waze.com/wiki/Australia/Update_Reports',
    },
    {
      n: 5,
      label: 'Kenya: The Data Protection Act, No. 24 of 2019 (ODPC, PDF)',
      url: 'https://www.odpc.go.ke/wp-content/uploads/2024/02/TheDataProtectionAct__No24of2019.pdf',
    },
    {
      n: 6,
      label: 'McCann FitzGerald: One month to go, EU AI Act transparency compliance',
      url: 'https://www.mccannfitzgerald.com/knowledge/technology-and-innovation/one-month-to-go-eu-ai-act-transparency-compliance',
    },
    {
      n: 7,
      label: 'Waze Discuss: Unexpected Map_Team comment on a French update request (May 2026)',
      url: 'https://www.waze.com/discuss/t/unexpected-map-team-6-comment-on-french-ur-from-unknown-zero-edit-account/403830',
    },
    {
      n: 8,
      label: 'Waze Discuss: May 2026 newsletter for map editors (Portuguese, 27 May 2026)',
      url: 'https://www.waze.com/discuss/t/ajude-a-moldar-o-futuro-do-waze-newsletter-de-maio-para-editores/405054',
    },
    {
      n: 9,
      label: 'Waze Help: Report a map issue',
      url: 'https://support.google.com/waze/answer/7101380',
    },
  ],
};

const NOT_IN_DEMO = 'Not in this demo';

function off(id: string, label: string, note = NOT_IN_DEMO) {
  return { id, label, to: '', disabled: true, note };
}

/** Scenario A: roadworks reported as a hazard. */
const hazard: Scenario = {
  id: 'hazard',
  title: 'A hazard you reported',
  who: 'You’re driving up Uhuru Highway when roadworks close some lanes. You report it with one tap.',
  start: 'a-drive',
  steps: {
    'a-drive': {
      id: 'a-drive',
      tag: 'today',
      clock: '4:11',
      screen: 'drive-a',
      narrator:
        '4:11 pm. You’re driving up Uhuru Highway towards Westlands with Waze on. Cones ahead: roadworks are closing lanes.',
      action: 'Tap the yellow Report button.',
      choices: [{ id: 'report', label: 'Report', to: 'a-menu' }],
    },
    'a-menu': {
      id: 'a-menu',
      tag: 'today',
      screen: 'menu',
      narrator: 'These are the first rows of today’s report menu. Roadworks come under Hazard.',
      action: 'Tap Hazard.',
      choices: [
        off('traffic', 'Traffic'),
        off('police', 'Police'),
        off('crash', 'Crash'),
        { id: 'hazard', label: 'Hazard', to: 'a-hazard' },
        off('weather', 'Bad weather'),
        off('blocked', 'Blocked lane'),
        off('mapissue', 'Map issue'),
        off('closure', 'Closure'),
      ],
    },
    'a-hazard': {
      id: 'a-hazard',
      tag: 'today',
      screen: 'hazard',
      narrator: 'Waze calls roadworks Construction.',
      action: 'Tap Construction, then Report.',
      choices: [
        off('hazard-default', 'Hazard', 'Roadworks go under Construction'),
        { id: 'construction', label: 'Construction', to: 'a-hazard-picked' },
        off('car-shoulder', 'Car on shoulder'),
        off('traffic-light', 'Broken traffic light'),
        off('pothole', 'Pothole'),
        off('object', 'Object'),
        off('cancel', 'Cancel'),
      ],
    },
    'a-hazard-picked': {
      id: 'a-hazard-picked',
      tag: 'today',
      screen: 'hazard',
      narrator: 'Construction is selected.',
      action: 'Tap Report.',
      choices: [
        off('hazard-default', 'Hazard', 'Roadworks go under Construction'),
        off('construction', 'Construction', 'Selected'),
        off('car-shoulder', 'Car on shoulder'),
        off('traffic-light', 'Broken traffic light'),
        off('pothole', 'Pothole'),
        off('object', 'Object'),
        off('cancel', 'Cancel'),
        { id: 'send', label: 'Report', to: 'a-reported' },
      ],
    },
    'a-reported': {
      id: 'a-reported',
      tag: 'proposed',
      screen: 'reported-a',
      narrator:
        'Reported. That’s all a report takes while driving. Waze doesn’t know yet which lanes are closed or for how long. The assistant will ask, but not now.',
      action: 'Keep driving.',
      choices: [{ id: 'drive', label: 'Keep driving', to: 'a-red' }],
    },
    'a-red': {
      id: 'a-red',
      tag: 'proposed',
      clock: '4:19',
      screen: 'red-a',
      narrator:
        '4:19 pm. A red light in Westlands. No call. You’re in traffic and could move any second.',
      action: 'Keep driving.',
      choices: [{ id: 'drive', label: 'Keep driving', to: 'a-parked' }],
    },
    'a-parked': {
      id: 'a-parked',
      tag: 'proposed',
      clock: '4:31',
      screen: 'parked',
      narrator: 'Skip ahead: 4:31 pm, you’ve parked at Sarit Centre. The engine is off.',
      action: 'Wait for the call.',
      choices: [{ id: 'wait', label: 'Wait a moment', to: 'a-incoming' }],
    },
    'a-incoming': {
      id: 'a-incoming',
      tag: 'proposed',
      screen: 'incoming',
      narrator:
        'Waze’s AI assistant calls about your report. Someone else in the car? You can ask for a text, or for a call later. Say it, or tap it.',
      action: 'Choose Answer, Text me or Call me later.',
      choices: [
        { id: 'answer', label: 'Answer', to: 'a-call', set: { mode: 'call' } },
        { id: 'text', label: 'Text me', to: 'a-text', set: { mode: 'text' } },
        { id: 'later', label: 'Call me later', to: 'a-later' },
      ],
    },
    'a-later': {
      id: 'a-later',
      detour: true,
      tag: 'proposed',
      screen: 'later',
      narrator: 'The assistant asks when to call back. It will call once.',
      action: 'Pick a time, or say it.',
      choices: [
        {
          id: 'in30',
          label: 'In 30 minutes',
          to: 'a-later-set',
          set: { later: '5:01', laterText: 'in 30 minutes, at 5:01 pm' },
        },
        {
          id: 'evening',
          label: 'This evening',
          to: 'a-later-set',
          set: { later: '7:30', laterText: 'this evening, at 7:30 pm' },
        },
        off('nextpark', 'Next time I park'),
      ],
    },
    'a-later-set': {
      id: 'a-later-set',
      detour: true,
      tag: 'proposed',
      screen: 'later-set',
      narrator: 'The assistant will call back {{laterText}}. One callback only.',
      action: 'Skip ahead to the callback.',
      choices: [{ id: 'skip', label: 'Skip ahead to {{later}} pm', to: 'a-callback' }],
    },
    'a-callback': {
      id: 'a-callback',
      detour: true,
      tag: 'proposed',
      clock: '{{later}}',
      screen: 'incoming',
      narrator:
        'Skip ahead: {{later}} pm. The assistant calls back once, as you asked. If you say “Not now”, it won’t call about this again.',
      action: 'Choose Answer, Text me or Not now.',
      choices: [
        {
          id: 'answer',
          label: 'Answer',
          to: 'a-call',
          set: { mode: 'call', hello: ', calling back as you asked' },
        },
        { id: 'text', label: 'Text me', to: 'a-text', set: { mode: 'text' } },
        { id: 'notnow', label: 'Not now', to: 'a-notnow' },
      ],
    },
    'a-notnow': {
      id: 'a-notnow',
      changed:
        'One callback at most. “Not now” ends the follow-up, and the report keeps working as it does today.',
      tag: 'proposed',
      screen: 'notnow',
      end: true,
      narrator:
        'That ends it for good: no more calls about this report. Your report stays on the map as it is, and the next driver who passes the spot is asked “Still there?” That prompt is <a href="../alert-timing/">idea 06, Ask at the right moment</a>.',
      choices: [],
    },
    'a-call': {
      id: 'a-call',
      widget: 'lanes',
      say: 'Hi, this is Waze’s AI assistant{{hello|}}. You reported roadworks on Uhuru Highway at 4:11 pm. On your screen is your drive up to that spot. Three quick questions, under a minute. Which lanes were closed?',
      tag: 'proposed',
      screen: 'convo',
      narrator:
        'The call opens with “This is Waze’s AI assistant.” Your drive replays up to the spot you reported. First question: which lanes were closed?',
      action: 'Tap every closed lane, then Done.',
      choices: [
        { id: 'lanes-done', label: 'Done', to: 'a-q2', needs: 'lanes' },
        { id: 'lanes-unsure', label: 'Couldn’t tell', to: 'a-q2', set: { lanes: 'Not known' } },
      ],
    },
    'a-text': {
      id: 'a-text',
      widget: 'lanes',
      say: 'This is Waze’s AI assistant, texting as you asked. Above is your drive at 4:11 pm, up to the roadworks you reported on Uhuru Highway. Three quick questions. Which lanes were closed?',
      tag: 'proposed',
      screen: 'convo',
      narrator:
        'The text opens with “This is Waze’s AI assistant.” The same replay shows the spot. First question: which lanes were closed?',
      action: 'Tap every closed lane, then Done.',
      choices: [
        { id: 'lanes-done', label: 'Done', to: 'a-q2', needs: 'lanes' },
        { id: 'lanes-unsure', label: 'Couldn’t tell', to: 'a-q2', set: { lanes: 'Not known' } },
      ],
    },
    'a-q2': {
      id: 'a-q2',
      say: 'Got it. Closed in which direction?',
      tag: 'proposed',
      screen: 'convo',
      narrator: 'Second question: which direction is closed?',
      action: 'Pick one.',
      choices: [
        { id: 'dir-w', label: 'Towards Westlands', to: 'a-q3', set: { dir: 'Towards Westlands' } },
        {
          id: 'dir-m',
          label: 'Towards Mombasa Road',
          to: 'a-q3',
          set: { dir: 'Towards Mombasa Road' },
        },
        { id: 'dir-b', label: 'Both directions', to: 'a-q3', set: { dir: 'Both directions' } },
      ],
    },
    'a-q3': {
      id: 'a-q3',
      say: 'Last one. Did it look like it would be there a while?',
      tag: 'proposed',
      screen: 'convo',
      narrator: 'Last question: how long did it look like it would be there?',
      action: 'Pick one.',
      choices: [
        {
          id: 'dur-today',
          label: 'Just today',
          to: 'a-end',
          set: { dur: 'Expected to clear today' },
        },
        { id: 'dur-days', label: 'A few days', to: 'a-end', set: { dur: 'Likely a few days' } },
        { id: 'dur-weeks', label: 'Weeks or more', to: 'a-end', set: { dur: 'Weeks or more' } },
        { id: 'dur-unsure', label: 'Couldn’t tell', to: 'a-end', set: { dur: 'Not known' } },
      ],
    },
    'a-end': {
      id: 'a-end',
      say: 'Thanks. Drivers approaching now see what’s closed. I’ll ask the next driver who passes whether it’s still there.',
      changed:
        'Drivers approaching now see the closed lanes, the direction and how long. The next driver is asked “Still there?” just after passing the spot, as proposed in idea 06.',
      tag: 'proposed',
      screen: 'summary-a',
      end: true,
      narrator:
        'Three answers, under a minute. Drivers approaching now see which lanes are closed and in which direction. The next driver is asked “Still there?” just after passing the spot. That prompt is <a href="../alert-timing/">idea 06, Ask at the right moment</a>.',
      choices: [],
    },
  },
};

/** Scenario B: a map issue, Turn not allowed. */
const mapIssue: Scenario = {
  id: 'map-issue',
  title: 'A map issue you reported',
  who: 'Waze tells you to turn right, but a sign says you can’t. You report a map issue.',
  start: 'b-drive',
  steps: {
    'b-drive': {
      id: 'b-drive',
      tag: 'today',
      clock: '4:11',
      screen: 'drive-b',
      narrator: '4:11 pm. Waze says: “Turn right onto Kenyatta Avenue.”',
      action: 'Drive up to the junction.',
      choices: [{ id: 'drive', label: 'Drive to the junction', to: 'b-sign' }],
    },
    'b-sign': {
      id: 'b-sign',
      tag: 'today',
      screen: 'junction-b',
      narrator: 'At the junction, a sign says no right turn.',
      action: 'Go straight on.',
      choices: [{ id: 'straight', label: 'Go straight on', to: 'b-recalc' }],
    },
    'b-recalc': {
      id: 'b-recalc',
      tag: 'today',
      screen: 'recalc-b',
      narrator:
        'Waze recalculates and finds another way. The map still allows that turn, so the next driver gets the same instruction. Map editors can fix it if someone tells them.',
      action: 'Tap Report.',
      choices: [{ id: 'report', label: 'Report', to: 'b-menu' }],
    },
    'b-menu': {
      id: 'b-menu',
      tag: 'today',
      screen: 'menu',
      narrator: 'The first rows of today’s report menu. Wrong turns on the map go under Map issue.',
      action: 'Tap Map issue.',
      choices: [
        off('traffic', 'Traffic'),
        off('police', 'Police'),
        off('crash', 'Crash'),
        off('hazard', 'Hazard'),
        off('weather', 'Bad weather'),
        off('blocked', 'Blocked lane'),
        { id: 'mapissue', label: 'Map issue', to: 'b-mapissue' },
        off('closure', 'Closure'),
      ],
    },
    'b-mapissue': {
      id: 'b-mapissue',
      tag: 'today',
      screen: 'mapissue',
      narrator: 'These are the map issue types in today’s app.',
      action: 'Tap Turn not allowed.',
      choices: [
        off('general', 'General map error'),
        { id: 'turn', label: 'Turn not allowed', to: 'b-comment' },
        off('junction', 'Wrong junction'),
        off('address', 'Wrong address'),
        off('bridge', 'Missing bridge or overpass'),
        off('directions', 'Wrong driving directions'),
        off('exit', 'Missing exit'),
        off('road', 'Missing road'),
        off('cancel', 'Cancel'),
      ],
    },
    'b-comment': {
      id: 'b-comment',
      tag: 'today',
      screen: 'comment',
      narrator:
        'Waze offers a comment box. At the wheel there’s no time to type, so you send it without one.',
      action: 'Tap Send.',
      choices: [
        off('comment', 'Add a comment', 'Not while driving'),
        { id: 'send', label: 'Send', to: 'b-today' },
      ],
    },
    'b-today': {
      id: 'b-today',
      tag: 'today',
      screen: 'today-b',
      narrator: `How it works today. Waze already asks for details: since May 2026, a map issue sent without a description gets an automatic comment asking for more.${fn(7)}${fn(8)} Since July 2026 you can also describe a map problem by voice, and it reaches local editors.${fn(3)}`,
      action: 'See where the question lands.',
      choices: [{ id: 'next', label: 'Next', to: 'b-inbox' }],
    },
    'b-inbox': {
      id: 'b-inbox',
      tag: 'today',
      screen: 'inbox',
      narrator: `The comment arrives later in the app’s Inbox.${fn(9)} Many drivers never reply: Australian editing guidance notes that “most URs do not return with a reply”, URs being update requests.${fn(4)} The request can close unanswered.`,
      action: 'Now try the idea.',
      choices: [{ id: 'next', label: 'Try the idea', to: 'b-parked' }],
    },
    'b-parked': {
      id: 'b-parked',
      tag: 'proposed',
      clock: '4:31',
      screen: 'parked',
      narrator: 'Skip ahead: 4:31 pm, you’ve parked at Sarit Centre. The engine is off.',
      action: 'Wait for the call.',
      choices: [{ id: 'wait', label: 'Wait a moment', to: 'b-incoming' }],
    },
    'b-incoming': {
      id: 'b-incoming',
      tag: 'proposed',
      screen: 'incoming',
      narrator:
        'Waze’s AI assistant calls about the map issue. Someone else in the car? You can ask for a text, or for a call later. Say it, or tap it.',
      action: 'Choose Answer, Text me or Call me later.',
      choices: [
        { id: 'answer', label: 'Answer', to: 'b-call', set: { mode: 'call' } },
        { id: 'text', label: 'Text me', to: 'b-text', set: { mode: 'text' } },
        { id: 'later', label: 'Call me later', to: 'b-later' },
      ],
    },
    'b-later': {
      id: 'b-later',
      detour: true,
      tag: 'proposed',
      screen: 'later',
      narrator: 'The assistant asks when to call back. It will call once.',
      action: 'Pick a time, or say it.',
      choices: [
        {
          id: 'in30',
          label: 'In 30 minutes',
          to: 'b-later-set',
          set: { later: '5:01', laterText: 'in 30 minutes, at 5:01 pm' },
        },
        {
          id: 'evening',
          label: 'This evening',
          to: 'b-later-set',
          set: { later: '7:30', laterText: 'this evening, at 7:30 pm' },
        },
        off('nextpark', 'Next time I park'),
      ],
    },
    'b-later-set': {
      id: 'b-later-set',
      detour: true,
      tag: 'proposed',
      screen: 'later-set',
      narrator: 'The assistant will call back {{laterText}}. One callback only.',
      action: 'Skip ahead to the callback.',
      choices: [{ id: 'skip', label: 'Skip ahead to {{later}} pm', to: 'b-callback' }],
    },
    'b-callback': {
      id: 'b-callback',
      detour: true,
      tag: 'proposed',
      clock: '{{later}}',
      screen: 'incoming',
      narrator:
        'Skip ahead: {{later}} pm. The assistant calls back once, as you asked. If you say “Not now”, it won’t call about this again.',
      action: 'Choose Answer, Text me or Not now.',
      choices: [
        {
          id: 'answer',
          label: 'Answer',
          to: 'b-call',
          set: { mode: 'call', hello: ', calling back as you asked' },
        },
        { id: 'text', label: 'Text me', to: 'b-text', set: { mode: 'text' } },
        { id: 'notnow', label: 'Not now', to: 'b-notnow' },
      ],
    },
    'b-notnow': {
      id: 'b-notnow',
      changed:
        'One callback at most. “Not now” ends the follow-up, and the map issue stays as it is today.',
      tag: 'proposed',
      screen: 'notnow',
      end: true,
      narrator:
        'That ends it for good: no more calls about this map issue. It stays open for the editors, with today’s comment waiting in your Inbox.',
      choices: [],
    },
    'b-call': {
      id: 'b-call',
      widget: 'turns',
      say: 'Hi, this is Waze’s AI assistant{{hello|}}. Map editors want to fix the turn you reported at 4:11 pm. On your screen is your drive up to that junction. Which turn wasn’t allowed? Tap it on the map.',
      tag: 'proposed',
      screen: 'convo',
      narrator:
        'The call opens with “This is Waze’s AI assistant.” Your drive replays up to the junction. The assistant asks which turn wasn’t allowed.',
      choices: [
        off('turn-left', 'Left'),
        off('turn-straight', 'Straight on'),
        {
          id: 'turn-right',
          label: 'Right onto Kenyatta Avenue',
          to: 'b-why',
          set: { turn: 'Right onto Kenyatta Avenue' },
        },
      ],
    },
    'b-text': {
      id: 'b-text',
      widget: 'turns',
      say: 'This is Waze’s AI assistant, texting as you asked. Map editors want to fix the turn you reported at 4:11 pm. Above is your drive up to that junction. Which turn wasn’t allowed? Tap it on the map.',
      tag: 'proposed',
      screen: 'convo',
      narrator:
        'The text opens with “This is Waze’s AI assistant.” The same replay drives up to the junction. Which turn wasn’t allowed?',
      choices: [
        off('turn-left', 'Left'),
        off('turn-straight', 'Straight on'),
        {
          id: 'turn-right',
          label: 'Right onto Kenyatta Avenue',
          to: 'b-why',
          set: { turn: 'Right onto Kenyatta Avenue' },
        },
      ],
    },
    'b-why': {
      id: 'b-why',
      say: 'Thanks. What stopped you?',
      tag: 'proposed',
      screen: 'convo',
      narrator: 'Second question: what stopped you? In this drive, it was a sign.',
      action: 'Tap No-turn sign.',
      choices: [
        { id: 'why-sign', label: 'No-turn sign', to: 'b-when', set: { why: 'No-turn sign' } },
        off('why-barrier', 'Barrier'),
        off('why-oneway', 'One-way'),
        off('why-police', 'Police'),
        off('why-works', 'Roadworks'),
        off('why-unsure', 'Not sure'),
      ],
    },
    'b-when': {
      id: 'b-when',
      say: 'Last one. Does it apply all the time?',
      tag: 'proposed',
      screen: 'convo',
      narrator: 'Last question: does it always apply?',
      action: 'Pick one.',
      choices: [
        { id: 'when-all', label: 'All the time', to: 'b-end', set: { when: 'All the time' } },
        {
          id: 'when-hours',
          label: 'Only at certain hours',
          to: 'b-end',
          set: { when: 'Only at certain hours' },
        },
        { id: 'when-unsure', label: 'Not sure', to: 'b-end', set: { when: 'Not sure' } },
      ],
    },
    'b-end': {
      id: 'b-end',
      say: 'Thanks. Your answers and the drive go to the local map editors.',
      changed:
        'The editors get the turn, the reason and when it applies, with the drive replay attached, while the driver still remembers.',
      tag: 'proposed',
      screen: 'wme',
      end: true,
      narrator:
        'The map editors see your answers in the update request, with the drive replay attached: the route Waze gave in purple, the way you drove in green. They can fix the turn without waiting for a reply.',
      choices: [],
    },
  },
};

export const followupScenarios: Scenario[] = [hazard, mapIssue];
