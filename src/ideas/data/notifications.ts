import type { Idea } from '../types';

export const idea: Idea = {
  id: 'notifications',
  num: '19',
  group: 'quick',
  title: 'Notifications that clear themselves',
  short: 'Self-clearing notifications',
  hook: 'Reminders that clear themselves once their leave-by time has passed.',
  teams: ['App Product'],
  problem:
    'Reminders stay after they stop being useful, so the lock screen fills with stale alerts and the next real one is easier to miss.',
  moment: {
    text: 'Early on a Sunday my lock screen still showed Wednesday’s Waze reminders: “Time to go!” and “Plan to leave” for drives long past, and “You helped … drivers” summaries.',
  },
  known: 'You swipe away old notifications by hand.',
  today: 'Planned-drive reminders stay on the lock screen days after their leave-by time.',
  proposed: 'Each reminder clears itself once its leave-by time passes or the drive starts.',
  howToday:
    'For a planned drive, Waze sends reminders based on live traffic, such as one an hour and a half before it’s time to leave and another 10 minutes before.<sup class="fn"><a href="#src-notifications-1" aria-label="Source 1">1</a></sup> On my lock screen these reminders, “Plan to leave by…” and “Time to go!”, stayed until I cleared them, days after their leave-by times.',
  howProposed:
    'Each reminder clears itself once its leave-by time has passed or the drive has started. The daily “You helped…” summary clears the next day.',
  elsewhere: [
    {
      text: 'Android lets an app give a notification a timeout, after which it goes away: setTimeoutAfter().<sup class="fn"><a href="#src-notifications-2" aria-label="Source 2">2</a></sup>',
    },
    {
      text: 'iOS lets an app remove its own delivered notifications from Notification Center: removeDeliveredNotifications(withIdentifiers:).<sup class="fn"><a href="#src-notifications-3" aria-label="Source 3">3</a></sup>',
    },
  ],
  why: [],
  ask: 'Clear planned-drive reminders automatically once the leave-by time passes or the drive starts, and clear daily summaries the next day.',
  sources: [
    {
      n: 1,
      label: 'Waze Help: Get a reminder when it’s time to leave',
      url: 'https://support.google.com/waze/answer/7502125',
    },
    {
      n: 2,
      label: 'Android Developers: Create a notification (setTimeoutAfter)',
      url: 'https://developer.android.com/develop/ui/views/notifications/build-notification',
    },
    {
      n: 3,
      label: 'Apple Developer: removeDeliveredNotifications(withIdentifiers:)',
      url: 'https://developer.apple.com/documentation/usernotifications/unusernotificationcenter/removedeliverednotifications(withidentifiers:)',
    },
  ],
};
