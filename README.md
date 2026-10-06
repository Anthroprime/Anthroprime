# AnthroPrime

Redesigned website for AnthroPrime Technology: AI, data, cloud, cybersecurity, AI infrastructure, and strategic growth advisory. The design retains the original ivory, navy, blue, and warm gold palette, uses the supplied AP handshake logo, and pairs Cormorant Garamond with DM Sans.

## Run locally

```powershell
npm install
npm run build
npm run dev
```

Open http://127.0.0.1:4173. The development server stays in the foreground; stop it with Ctrl+C. Forms display a local-preview message and do not submit data.

## Edit

- `content/site.json`: business content, service scopes, checklists, and source-text record.
- `tools/build.mjs`: static page templates and metadata.
- `tools/brand-components.mjs`: observatory, capability showcase, project brief builder, and guided walkthrough templates.
- `web/assets/site.css`: shared design system and responsive layouts.
- `web/assets/brand.css`: original brand palette, editorial typography, and animated visual systems.
- `web/assets/immersive.css`: embedded hero, orbital lighting, pointer depth, and responsive terminal presentation.
- `tools/terminal-component.mjs` and `web/assets/terminal.js`: command interface, completion/history, and narrated architecture simulations.
- `tools/domain-components.mjs`: dedicated AI, Data, Cybersecurity, Cloud, and Infrastructure page content, service scopes, and visual templates.
- `web/assets/pages.css` and `pages.js`: readable terminal controls, discipline visuals, system selection, loading feedback, and page transitions.
- `web/assets/photos/`: locally hosted free photography and source/license credits.
- `tools/learning-components.mjs`: researched educational diagrams, why-it-matters copy, scenario definitions, and interactive editorial sections.
- `web/assets/learning.js` and `learning.css`: connected SVG paths, component inspection, scenario consequences, guided/manual stepping, and responsive diagram layouts.
- `tools/finishing-components.mjs` and `web/assets/finishing.css` / `finishing.js`: blended header photographs, theme-aware discipline strip, animated branded robot, and greeting interaction.
- `web/assets/site.js`: diagrams, navigation, themes, filters, checklists, and forms.
- `web/assets/experience.js`: morphing canvas observatory, showcase tabs, project brief handoff, guided workflows, motion preferences, and scroll feedback.
- `web/assets/company-logo.jpg`: the exact company logo supplied by the user.
- `original/`: preserved source from the supplied ZIP, excluded from deployment.
- `DEVELOPMENT-PLAN.md`: audit, design direction, implementation phases, and launch considerations.

After changes, rebuild with `npm run build`. Generated `dist/` files are disposable build outputs.

## Verify

```powershell
npm test
```

Checks use installed Chrome in headless mode. On a machine without Chrome, install Playwright Chromium (`npx playwright install chromium`) and change the test launch option to omit `channel: 'chrome'`.

The tests cover all ten main pages at 320, 390, 768, and 1440 pixels, dark/light theme accessibility, mobile menus, diagram keyboard controls and node bounds, search/filtering, complete service scopes, checklist persistence, local form behavior, mocked submission responses, tentative ICS timezone conversion, and static fallbacks. They also verify logo usage, hero scene changes, capability keyboard controls, walkthrough start/pause behavior, project brief handoff, motion preferences, discipline system controls, photo loading, canonicals, and navigation recovery. Reports and screenshots are written to `artifacts/`.

## Deploy to Netlify

The included `netlify.toml` uses Node 22, runs `npm run build`, and publishes only `dist/`. Existing `.html` links and clean `/services`, `/practices`, `/growth-advisor`, and `/contact` routes are supported, along with `/artificial-intelligence`, `/data`, `/cybersecurity`, `/cloud`, and `/infrastructure`. No client-side router fallback is needed.

For a manual deploy, build locally and upload the **contents of `dist/`**. Netlify Forms must be enabled, with form detection and notification recipients configured for `contact` and `schedule-request`. Validate actual form receipt on a staging deployment before replacing production.

No production deployment has been performed. Calendar reminders are tentative requests, not confirmed reservations.

Fonts are bundled locally under their SIL Open Font Licenses. Font vendor and template migration scripts are one-time asset-preparation utilities; normal builds do not contact Google Fonts or the live company website.

The “Pause visual effects” control in the footer applies across pages. The observatory suspends its canvas animation when offscreen or in an inactive tab; reduced-motion preferences are respected. Architecture walkthroughs are explicitly illustrative and do not report business metrics.

Dedicated pages include a “Why it matters” interactive explainer. Data demonstrates a quality gate; Cloud models a prepared alternative route; Cybersecurity connects the six concurrent NIST CSF 2.0 functions; Infrastructure highlights storage, network, and facility constraints; AI compares review with an action path that bypasses review. Sources from NIST, Microsoft, AWS, and NVIDIA are linked on the relevant pages. These are educational design models, not live infrastructure, assessment results, or benchmark measurements.

`npm test` also runs the educational interaction and motion suites. They check scenario changes, blocked/rerouted paths, constraints, reset behavior, keyboard interaction, component bounds, timer cancellation, editorial photo loading, and no-JavaScript descriptions. With reduced motion, educational walkthroughs advance one connection per click.

Expertise, Our Practice, and Contact have photographs blended into their headers with theme-aware fades. The AI page uses an original SVG robot with the supplied logo, subtle hover/blink/wave motion, and a “Say hello” interaction. Robot motion pauses offscreen, follows the global effects preference, and is disabled for reduced motion. The finishing checks include the dark discipline strip, hero imagery, robot interactions, and layouts at 320, 390, 900, and 1024px.

The homepage has a clean background behind its headline. “People” reveals once on entry with a typewriter caret; its full width stays reserved and screen readers receive the whole word. Reduced-motion and paused-effects users see the complete word immediately. Light-mode header photographs retain full opacity and natural contrast, with fading confined to the edges. The growth diagram uses a consistently dark center in both themes.

The homepage terminal accepts `help`, `explore data`, `simulate security`, `services cloud`, `about`, `theme dark`, `contact`, `stop`, and `clear`. Arrow keys recall commands; Tab completes them. Commands run only in the local architecture sandbox, synchronize the site's diagrams, and never execute shell code or scan remote systems. Verification includes plaintext input handling, simulation cancellation/completion, keyboard history, theme commands, and removal of the hero card treatment. The current revision passed 1,923 checks and 109 accessibility scans.

Professional refinement adds /trust and /data-notice, sensitive-information guidance beside both forms, selective browser-preference clearing, a branded 404, and explicit CSP object/base restrictions. See PROFESSIONAL-REVIEW.md for findings, research, validation, and the remaining business-owner launch checks.
