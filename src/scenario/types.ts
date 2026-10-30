/**
 * A choice in a scenario step.
 * disabled: shown greyed out with "Not in this demo" (or `note`).
 * set: values the choice records, used to fill {{key}} placeholders later in the story.
 * needs: a widget key on the screen that must hold a value before the choice is enabled.
 */
export interface Choice {
  id: string;
  label: string;
  to: string;
  disabled?: boolean;
  note?: string;
  set?: Record<string, string>;
  needs?: string;
}

/**
 * One step of a guided scenario.
 * screen: which stage screen to show (an element with data-screen="<screen>").
 * clock: the time on the phone from this step on ("{{key}}" placeholders allowed).
 * tag: marks the step as today's app or as the proposed idea.
 * Text fields may use {{key}} placeholders filled from values that earlier choices set.
 */
export interface Step {
  id: string;
  narrator: string;
  action?: string;
  screen: string;
  choices: Choice[];
  end?: boolean;
  clock?: string;
  tag?: 'today' | 'proposed';
  /** A line the assistant says in the conversation at this step. */
  say?: string;
  /** An interactive widget the screen shows at this step. */
  widget?: 'lanes' | 'turns';
  /** End steps: what changed, in one or two lines, for the ending block. */
  changed?: string;
}

export interface Scenario {
  id: string;
  title: string;
  who: string;
  start: string;
  steps: Record<string, Step>;
}
