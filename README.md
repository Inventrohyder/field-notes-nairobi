# Field Notes from Nairobi

Twenty-one small proposals to make Waze fit Kenyan roads, from a volunteer map editor in Nairobi. Each idea has its own page: what Waze does today, the idea, a guided demo, the facts behind it with sources, and the ask.

Live site: https://inventrohyder.github.io/field-notes-nairobi/

A community member's proposal. Not affiliated with or endorsed by Waze or Google. The phone screens are drawn for this site and use no Waze artwork.

## Run it

You need Node.js 20.3 or later.

```sh
npm ci
npm run dev          # local site at http://localhost:4321/field-notes-nairobi/
npm run build        # static site in dist/
npm run preview      # serve dist/
```

## Checks

| Command                | What it does                                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `npm run check`        | Type check (Astro and TypeScript, strict)                                                                         |
| `npm run lint`         | ESLint                                                                                                            |
| `npm run format:check` | Prettier                                                                                                          |
| `npm test`             | Unit tests, including the scenario path walk                                                                      |
| `npm run test:e2e`     | Playwright: plays each guided scenario at phone and laptop width, light and dark, with an axe accessibility check |
| `npm run validate`     | HTML validation of `dist/`                                                                                        |
| `npm run linkcheck`    | Internal links and anchors in `dist/`                                                                             |
| `npm run pdf`          | Makes `dist/field-notes-nairobi.pdf` from the `/print/` page                                                      |

Locally, Playwright uses the Chrome at `/opt/google/chrome/chrome`. In CI it installs Chromium.

## How the guided demos are tested

Each guided demo is written as data: scenarios made of steps, and choices that lead from one step to the next (`src/scenario/types.ts`). Choices outside the story stay visible but greyed out and marked "Not in this demo".

`tests/scenarios.test.ts` walks every path of every scenario of every idea. The build fails if:

- a choice leads to a step that does not exist;
- a step cannot be reached from the start;
- a step cannot reach an ending, or a path loops;
- an ending still offers a choice;
- a step uses an answer the visitor has not given yet on that path.

The Playwright tests then play the main paths in a real browser.

## Personal links

A personal link carries a greeting and a short list of ideas after the `#`, for example `#for=<data>`. The part after `#` never leaves the browser, so nothing about the person reaches the server and nothing is stored on the site. The page reads it, shows the greeting and puts those ideas first. A damaged link opens the normal page.

## Presenter mode

Add `?presenter` to the address to open the presenter tools: make a personal link (name, up to three ideas, one line), keep a log of picks, and reset for the next person. A people list can be loaded from a local file. Everything in presenter mode stays in that browser's local storage on that device.

## Privacy

No analytics, no cookies, and no requests to other sites while you browse. Fonts are served from this site. The browser stores only your theme choice and, in presenter mode, the presenter's own data.

## Deploying

Every push to `main` runs the checks, builds the site, makes the PDF and publishes to GitHub Pages (`.github/workflows/deploy.yml`). Pull requests run the same checks (`.github/workflows/ci.yml`).

## Licence

Code under the MIT licence, see `LICENSE`. Fonts are under the SIL Open Font License.
