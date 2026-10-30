import type { Idea } from '../types';

/** Page text for idea 10. Its guided scenarios live in followup-content.ts. */
export const idea: Idea = {
  id: 'report-followup',
  num: '10',
  group: 'reports',
  title: 'A quick follow-up after the drive',
  short: 'Follow-up after the drive',
  hook: 'After parking, an opt-in AI call fills in reports and update requests.',
  teams: ['App Product', 'Crisis Response & Traffic Events'],
  problem:
    'Reports made at the wheel are short, and editors’ questions on map issues often go unanswered, so reports lose detail.',
  moment: {
    text: 'On 9 April 2026 police restricted roads around Parliament “until the activities are over”. A report of that closure carries no end time, and the editor has to ask.<sup class="fn"><a href="#src-report-followup-1" aria-label="Source 1">1</a></sup>',
  },
  known: 'After a ride-hailing trip, the ride app asks you to rate it once you’ve arrived.',
  today:
    'Waze already asks follow-ups while you report by voice, and asks for details on map issues sent without a description. Editors’ questions often go unanswered.<sup class="fn"><a href="#src-report-followup-4" aria-label="Source 4">4</a></sup>',
  proposed:
    'For drivers who opt in, Waze’s AI assistant calls after the trip with two quick questions, and the answers go to local editors.',
  howToday:
    'Waze already asks follow-ups while you report by voice, such as “Can you describe what you see?”<sup class="fn"><a href="#src-report-followup-2" aria-label="Source 2">2</a></sup> Since July 2026 a spoken “The road is closed here” goes to local map editors.<sup class="fn"><a href="#src-report-followup-3" aria-label="Source 3">3</a></sup> Since May 2026 a map issue sent without a description gets an automatic comment asking the driver for details.<sup class="fn"><a href="#src-report-followup-7" aria-label="Source 7">7</a>,<a href="#src-report-followup-8" aria-label="Source 8">8</a></sup> When an editor needs more, the Australian guidance is to send a reminder after 4 days and close the request 2 days later.<sup class="fn"><a href="#src-report-followup-4" aria-label="Source 4">4</a></sup>',
  howProposed:
    'For drivers who opt in, Waze’s AI assistant follows up after the trip, before they forget: “You reported a closure on Uhuru Highway. Two quick questions: which direction, and until when?” It covers high-value reports only, such as closures, new or changed roads and map issues, within a couple of hours of parking and at most once a day. Editors’ questions count too: when a local editor asks something on a driver’s update request, which today often goes unanswered, the assistant calls after the drive to get the answer and attaches it to the request.<sup class="fn"><a href="#src-report-followup-4" aria-label="Source 4">4</a></sup> It calls by voice first, in a natural local voice in English or Swahili, always says it is Waze’s AI assistant, and falls back to text. The answers go into the report or map issue for local editors.',
  elsewhere: [
    {
      text: 'Waze asks its follow-up during the report; I have not seen a navigation app follow up after the drive.',
      gap: true,
    },
  ],
  questions: [
    {
      q: 'Consent.',
      a: 'Only drivers who opt in get a follow-up, and they can stop at any time. Kenya’s Data Protection Act 2019 requires consent that is “express, unequivocal, free, specific and informed”, and lets people withdraw it at any time.<sup class="fn"><a href="#src-report-followup-5" aria-label="Source 5">5</a></sup>',
    },
    {
      q: 'AI disclosure.',
      a: 'The assistant always says it is Waze’s AI. In the EU, the AI Act’s Article 50 duty to tell people they are talking to an AI applies from 2 August 2026.<sup class="fn"><a href="#src-report-followup-6" aria-label="Source 6">6</a></sup>',
    },
    {
      q: 'Cost.',
      a: 'Only high-value reports and opted-in reporters, and at most one follow-up a day.',
    },
    {
      q: 'Never while driving.',
      a: 'The follow-up waits until the car is parked.',
    },
  ],
  why: [
    'Reporters rarely answer: the Australian editing guidance notes that “most URs do not return with a reply”.<sup class="fn"><a href="#src-report-followup-4" aria-label="Source 4">4</a></sup>',
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
      label: 'McCann FitzGerald: One month to go, EU AI Act transparency compliance (2 Jul 2026)',
      url: 'https://www.mccannfitzgerald.com/knowledge/technology-and-innovation/one-month-to-go-eu-ai-act-transparency-compliance',
    },
    {
      n: 7,
      label: 'Waze Discuss: Unexpected Map_Team comment on a French update request (May 2026)',
      url: 'https://www.waze.com/discuss/t/unexpected-map-team-6-comment-on-french-ur-from-unknown-zero-edit-account/403830',
    },
    {
      n: 8,
      label:
        'Waze Discuss: Some URs without a user’s description don’t get the automatic update request (Jun 2026)',
      url: 'https://www.waze.com/discuss/t/some-urs-w-o-a-users-description-dont-get-the-automatic-update-request/406260',
    },
  ],
};
