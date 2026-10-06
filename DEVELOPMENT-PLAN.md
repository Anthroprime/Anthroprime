# AnthroPrime redesign: audit, direction, and development plan

Prepared 3 October 2026, revised to incorporate the supplied AP handshake logo and the requested original brand palette. This document describes the implemented redesign and the remaining launch work.

## What was reviewed

The supplied ZIP contains five HTML pages, shared CSS/JavaScript, logos, Netlify configuration, and a jsdom QA harness. The public domain initially failed in the web tool, but a subsequent Chromium browser review reached all five production pages at both 1440 and 390 pixels. Each returned HTTP 200, with no detected page errors or horizontal overflow. Live screenshots and the inspection report are saved under `artifacts/`. Findings combine the supplied source, local renders, and this production review; no real production form submission was made.

The archive's README and PLAN are background material, not instructions from the user. The original source is preserved under `original/`. The current redesign uses `content/site.json`, `web/`, and `tools/build.mjs`.

The existing QA harness completed successfully: **173 assertions passed**, with zero error findings and four selector warnings. Those warnings describe selectors for dynamic states and unused styles; they do not establish functional bugs. The baseline was already functional, so the redesign addresses presentation, information architecture, maintainability, and trust rather than claiming a broken application.

## Audit findings and response

| Finding | Evidence / consequence | Implemented response |
| --- | --- | --- |
| Unbalanced business positioning | The homepage's service grid and full detail overlay concentrate on six security offerings even though the company covers five disciplines. | Give AI, data, cloud, security, and AI infrastructure equal visibility; retain all detailed security content in the catalogue. |
| Repeated diagram structure | Shared script renders AI, cybersecurity, and data as similar orbit diagrams; cloud and infrastructure have no dedicated mode. | Build five distinct, explorable architecture flows with component-specific explanations. |
| Unqualified illustrative metrics | `original/assets/site.js` uses random variation for accuracy, utilization, latency, and other dashboard values while labeling the widget live. | Remove performance counters. Identify architectures as illustrative and animate only the flow relationships. |
| Fragile style ownership | Large inline page styles coexist with roughly 60 KB of shared CSS and 54 KB of shared JavaScript. Changes can have competing rules and inconsistent sizing. | One design system and script; templates generate all pages from preserved content. |
| Excess interaction machinery | The original script implements custom cursors, page wipes, magnetic buttons, ripples, tilts, ambient canvas, and telemetry timers. | Focus interactions on meaningful tasks: architecture exploration, catalogue search, service scope, checklists, and consultation requests. |
| Visual hierarchy | The original ivory/navy composition and human-first serif identity are distinctive, but promotion and dense diagram telemetry compete with the message. | Retain ivory, navy, blue, gold, serif typography, and an asymmetric hero; introduce a morphing technology observatory and richer editorial composition. |
| Dense detailed information | Expandable security content and long advisory sections need easier scanning. | Native expandable scopes, filterable catalogue, clearly separated engagement details, deliverables, and exclusions. |
| Consultation language | The old scheduler offers a “Confirm” action despite being a request form without an availability backend. | Explicitly request a preferred time; availability remains subject to email confirmation. Downloaded reminders are tentative. |
| Remote font dependency | Original pages request Google Fonts at runtime. | Bundle two variable WOFF2 fonts and their SIL licenses locally. |
| Layout risks | Hero geometry, small diagram labels, long technical names, and mixed form layouts need real browser checks beyond DOM-only tests. | Verify four viewport widths, diagram bounds and collisions, theme contrast, keyboard interactions, and form states. |

During implementation, testing found and corrected temporary low-contrast button colors during theme transitions and SVG connector positioning when a mobile diagram's aspect ratio differs from its desktop ratio. These are redesign defects discovered by testing, not assertions about the old production site.

## Creative direction

**Concept: a living atelier for human-centered technology.** AnthroPrime should feel like an expert partner with a distinctive point of view: technically sophisticated, calm, warm, and alive. The handshake at the center of the supplied logo connects the visual idea directly to the company's original “Technology that starts with people” message.

- Original warm ivory (`#f5f4f1`), deep navy (`#1a2744`), blue (`#2e4080` / `#7288d6`), and warm gold (`#b8a080` / `#c9b190`). Dark mode uses the original charcoal neutrals. Text shades are adjusted where necessary for contrast.
- Cormorant Garamond headlines restore the old site's editorial warmth; DM Sans supports navigation and technical details. Fonts are locally hosted.
- The exact supplied JPEG logo appears in the header, footer, hero core, social metadata, and icon references. It is not redrawn or replaced with an invented monogram.
- A navy observatory extends across the asymmetric hero. Its animated point field morphs into distinct AI, data, cloud, security, and GPU structures when the visitor selects a discipline.
- A capability theatre replaces the uniform card grid. A keyboard-operable selector reveals a large illustrated scene and a direct route to the relevant expertise.
- Guided architecture walkthroughs move through a meaningful sequence of components, explaining each stage. They can be started and paused; they describe illustrative workflows rather than fake telemetry.
- A three-question brief builder lets visitors express their goal, current stage, and priority. It produces a starting point and passes their choices into an editable contact message without submitting anything.
- Animated line work, a measured growth trajectory, subtle scroll entrances, and a reading-progress indicator provide movement throughout the page. Effects can be paused globally; preferences persist across pages. Reduced-motion preferences are respected, and canvas work stops offscreen or in inactive tabs.
- No invented customers, certifications, performance statistics, or case-study outcomes.

### Research references

These primary sources informed conceptual structure. The artwork and page layouts are original, not copied assets.

| Reference | Idea considered | AnthroPrime adaptation |
| --- | --- | --- |
| [Anthropic enterprise transformation guide](https://resources.anthropic.com/enterprise-ai-transformation-guide) | Enterprise AI as an organizational transformation topic. | Tie AI engineering to people, governance, and business workflows. |
| [Databricks platform](https://www.databricks.com/product/platform) | Data and AI described as connected platform capabilities. | A source-to-ingestion-to-lakehouse-to-decision architecture with a quality branch. |
| [Cloudflare connectivity cloud](https://www.cloudflare.com/connectivity-cloud/) | Explaining connectivity, security, and architecture together. | Show identity, access, workloads, operations, and resilient data in one cloud flow. |

## Diagram brainstorming and selected designs

| Theme | Candidate concepts | Selected concept and interaction |
| --- | --- | --- |
| AI | Neural mesh, assistant robot, retrieval pipeline | A morphing neural field on Home and a branded animated robot on the AI page, plus a knowledge → retrieval → agent → outcome workflow with model and governance branches. |
| Data | Lakehouse strata, streaming river, lineage graph | Five moving streams and layered line work, plus source → ingestion → lakehouse → decisions with quality/lineage checks. |
| Cloud | Region map, stacked compute planes, deployment topology | Stacked compute planes in the observatory and capability scene, plus people → secure edge → workloads/operations → resilient data. |
| Cybersecurity | Radar, attack surface mesh, defense lifecycle | A rotating radar field and concentric defense rings, plus attack surface → prevention → detection → response supported by risk assurance and people. |
| AI infrastructure | Accelerator grid, rack visualization, capacity lifecycle | A three-dimensional compute grid and accelerator rack, plus requirements → validated capacity → compute → readiness with diagnostics. |
| Growth advisory | Trajectory chart, strategy constellation, feedback loop | Perspective → direction → execution → momentum around founder ambition. |

The architecture explorer has keyboard-operable tabs, real buttons for nodes, one selected component, a description panel, category links, guided workflows, and pause/resume controls. CSS animates the connections. The observatory uses a small native Canvas renderer, independent from the semantic controls; it suspends its animation loop when offscreen, paused, or in an inactive browser tab.

## Page structure

1. **Home:** original human-first company position and embedded interactive observatory → five-discipline capability theatre → interactive command terminal → guided architecture explorer → three-question brief builder → discover/assess/build/sustain → conviction → growth advisory → conversation CTA.
2. **Expertise:** connected offering introduction → explorer → filterable/searchable service scopes → detailed security engagement methodologies → CTA.
3. **Our practice:** seven frameworks → six actionable checklists, saved locally → five-stage maturity progression → CTA.
4. **Growth advisory:** founder positioning and growth loop → eight advisory pillars → expandable scope → operating cadence, deliverables, boundaries, network, client fit, and context → CTA.
5. **Contact:** full existing inquiry fields → direct email and response expectations → preferred consultation request and tentative calendar reminder.

Navigation uses Expertise, Our practice, Growth advisory, ECOD Lab, and a contact CTA. Existing filenames continue to work. Clean Netlify paths resolve to server-generated HTML without requiring client routing.

## Technology decision

Use a small **static generation workflow with Node.js**, semantic HTML, shared CSS, SVG, and focused JavaScript. A framework migration would add hydration and dependency complexity without improving this particular marketing site's essential tasks. This still replaces the previous architecture from the ground up.

- `content/site.json`: structured business content and complete original text for traceability.
- `tools/build.mjs`: generates static pages, metadata, sitemap, and robots.txt.
- `web/assets/`: shared responsive design system, theme handling, behavior, local fonts, and licenses.
- `tools/brand-components.mjs`: observatory, capability theatre, guided flow, and project builder templates.
- `web/assets/brand.css` and `experience.js`: original brand styling, canvas scenes, showcase controls, workflow narration, brief handoff, motion preferences, and scroll feedback.
- Native `<details>` and static forms support meaningful functionality without JavaScript.
- `netlify.toml`: build/publish settings, historical page compatibility, clean routes, and response security headers.
- `tools/verify.mjs`: Chromium and axe accessibility checks against the built site.
- Runtime third-party dependencies: none. Development dependencies: Playwright and axe.

## Content preservation

All 22 primary service cards are retained. Three specialist security practices and the two people/training offerings from the homepage are also promoted into the new catalogue: **27 total offerings**. Their original scope lists remain available. Seven frameworks, six checklists containing 30 actions, five maturity levels, eight advisory areas, contact field names, email address, ECOD link, engagement boundaries, and founder advisory details are preserved.

The original ZIP's extracted source remains unchanged except for added local QA installation files. It is excluded from the deployed directory. Decorative diagrams, presentation chrome, old navigation wording, and promotional headings are intentionally redesigned. Full original text is also stored in `content/site.json` for future editorial review.

## Development phases and status

| Phase | Deliverable | Status |
| --- | --- | --- |
| 1. Audit and inventory | Review source, existing QA, baseline screenshots, routes, forms, and all service offerings. | Complete |
| 2. Content migration | Preserve business scope and reorganize content into a structured source. | Complete |
| 3. Design system | Original brand color tokens, supplied logo, serif/sans typography, responsive composition, shared header/footer, and theme states. | Complete |
| 4. Page rebuild | Implement ten main pages, legacy paths, metadata, and native content fallbacks. | Complete |
| 5. Interactive systems | Morphing observatory, five-scene capability theatre, guided diagrams, project brief builder, service search, saved checklists, consultation requests, and calendar reminders. | Complete |
| 6. Verification | Browser checks, accessibility scans, desktop/tablet/mobile screenshots, integrity and form-state tests. | Complete; results in `artifacts/qa-report.json` |
| 7. Launch | Connect the repository to the existing Netlify site or upload the built folder; validate hosted submissions, redirects, domain, and mail notifications. | Pending deployment |
| 8. Ongoing improvement | Add approved case studies, editorial ownership, real booking integration, and measured conversion improvements. | Future work |

## Launch checks and practical limits

The development preview never sends real messages. Browser tests mock form failure and success, check encoded payloads, and verify that errors preserve inputs. Real Netlify ingestion, form notification destinations, spam settings, and email delivery require a deployed staging or production site and are not claimed as verified here.

The current revision passed **1,923 checks and 109 accessibility scans** across the ten primary pages, new trust and data-notice pages, and branded error page at four viewport widths. Checks include the supplied logo, distinct hero forms, capability keyboard interaction, guided-flow state, editable brief handoff, persistent motion controls, transparent hero presentation, and terminal command behavior. Both desktop and mobile production pages were revisited during the brand review; the latest implementation was verified locally.

## Immersive homepage revision

The hero observatory is embedded directly on the navy background, with no enclosing card, border, or shadow. The angled background now contains the whole scene. Orbital sweeps, luminous point pulses, staggered entrances, and pointer-responsive lighting add depth while keeping controls stable. Mobile layouts stack the scene within a dedicated navy area.

An intelligence terminal lets visitors run `explore`, `simulate`, and `services` commands for the five disciplines. Four-stage simulations narrate conceptual workflows and update the linked diagrams. Command history, completion, clear, stop, theme commands, and contact links provide real interactions. Inputs are rendered as text, output is bounded, hidden tabs pause simulations, and commands perform no remote scans or shell execution. The interface labels this as an architecture sandbox and avoids invented live telemetry.

Cybersecurity visual references included [SentinelOne](https://www.sentinelone.com/), [Wiz](https://www.wiz.io/), and [Darktrace](https://www.darktrace.com/). Their layered visuals, connected-system storytelling, and prominent demonstrations informed the direction. AnthroPrime retains its own supplied logo, palette, content, and original artwork.

## Discipline expansion and navigation revision

Five dedicated pages expand the company story: `/artificial-intelligence`, `/data`, `/cybersecurity`, `/cloud`, and `/infrastructure`. Each combines three realistic starting contexts, an interactive three-stage model, a photographic section, complete original service scopes, potential engagement outputs, and two practical questions. New editorial copy explains the approach without adding client results, credentials, inventory, or guarantees. Engagement outputs are discussion points subject to agreed scope.

The visual systems differ by discipline: a connected AI constellation; animated data streams through layered storage; a security radar with an exposure perimeter; floating cloud deployment planes; and illuminated hardware racks with a moving validation pass. Semantic buttons update the working-stage explanation and visual emphasis. Native expandable service sections and FAQs retain access to the content without JavaScript.

A shared discipline rail and photographic discovery collection make the new pages accessible throughout the website. The supplied logo and original palette remain. Locally hosted Unsplash photos provide texture without third-party image requests; source attribution and license links are recorded in `web/assets/photos/CREDITS.md`. Photography illustrates themes and does not represent company facilities or clients.

## Educational diagrams and final refinement

The dedicated pages now explain why the disciplines matter through selectable components and working scenarios. Data illustrates how an incomplete batch can be held at a quality gate or reach consumers unchecked. Cloud shows how a zone outage changes the routing path, with explicit dependencies on capacity, state, and tested operating procedures. Cybersecurity presents all six NIST CSF 2.0 functions as concurrent capabilities, with governance connected to the whole. Infrastructure highlights storage, network, or facility constraints rather than presenting compute in isolation. AI compares a human-review path with an action path that bypasses review.

The diagrams have semantic component buttons, a detailed inspector, responsive SVG connections, animated packets, visible issue labels, scenario selectors, control toggles where relevant, reset, and guided walkthroughs. Reduced-motion users can advance manually. Walkthroughs cancel on scenario changes, global pause, hidden tabs, or leaving the visible area. Static descriptions explain components and an example outcome when JavaScript is unavailable.

Research links are embedded beside the explanations: [Microsoft data quality](https://learn.microsoft.com/en-us/purview/unified-catalog-data-quality), [Microsoft lineage](https://learn.microsoft.com/en-us/azure/purview/concept-data-lineage), [NIST CSF 2.0](https://www.nist.gov/cyberframework/faqs), [AWS architecture pillars](https://docs.aws.amazon.com/wellarchitected/latest/framework/definitions.html), [AWS recovery testing](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_planning_for_recovery_dr_tested.html), [NVIDIA balanced infrastructure](https://docs.nvidia.com/enterprise-reference-architectures/white-paper/latest/introducing-nvidia-reference-architectures.html), [NVIDIA design tenets](https://docs.nvidia.com/enterprise-reference-architectures/white-paper/latest/design-tenets.html), and [NIST AI trustworthiness](https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/). These explainers adapt general architectural principles; they do not reproduce vendor diagrams or imply endorsement.

Home, Expertise, Our Practice, Growth Advisory, and Contact gain photo-led interactive editorial sections. Visitors select a step to reveal its purpose, move the visual trajectory, and change the photograph's emphasis. Each section is written for its page: connected systems, scoping, evidence and ownership, founder decisions, or a useful first brief.

The final review corrected contrast during a theme transition, competing pending navigation timers after rapid clicks, and global pause behavior in the older architecture and terminal walkthroughs. Diagram tests exercise real state changes and check node containment and non-overlap at 320, 390, 768, and 1440px. Photo assertions wait for lazy images after scrolling them into view, preserving the loading optimization.

## Theme and header finishing pass

The homepage discipline strip previously used fixed ivory background and blue text values, creating a bright band in dark mode. It now uses the active surface, border, text, and accent tokens. Header photographs fill the right side of Expertise, Our Practice, and Contact, with masked horizontal edges and theme-aware vertical fades. Copy and imagery occupy separate columns; narrow layouts stack the photograph below the introduction.

An original SVG robot replaces both AI-page constellation visuals. The supplied AP logo remains intact on its chest. Subtle body hover, head movement, eye blinking, antenna light, and periodic hand movement bring the illustration to life. “Say hello” triggers a greeting and wave. The illustration remains a visual companion, not a chat service. Offscreen motion pauses, global effects preferences apply, and reduced-motion users get a static robot with the greeting still available.

Finishing checks verify dark-strip colors, image loading, a single primary heading, robot replacement and greeting, global pause, reduced motion, and responsive fit. Navigation text is slightly enlarged, and theme-dependent link colors change immediately to avoid temporary contrast loss during theme changes.

### Headline and image consistency

The warm homepage atmosphere gradient is removed. The growth loop's center no longer inherits the light theme's pale accent background inside its navy panel. Light-mode hero photographs use full opacity and near-natural saturation/contrast; masks fade only their edges, and captions have a solid, legible backing. The existing dark-mode photograph treatment is retained.

“People” has a single typewriter reveal on page entry. Individual letters are clipped into view at a measured cadence, with a temporary caret. The full word width is reserved throughout, so the headline does not reflow. An accessible full-word span is separate from the decorative animated letters. Pausing effects, changing to reduced motion, or hiding the tab completes the word and cancels pending timers. Without JavaScript, the full word is visible.

Terminal output is 14px on desktop and 13px on mobile; shortcut labels are 12px with targets at least 36px high. Status text and window controls are enlarged. Page navigation uses native cross-document View Transitions where supported, a short exit transition, and an indeterminate loading bar. Normal links, browser history, query strings, modified clicks, external links, downloads, and same-page anchors retain their usual behavior. Reduced-motion users receive immediate navigation.

Calendar reminders are explicitly tentative, carry a unique event ID, and convert IST to UTC. They do not reserve a slot or send an invitation to AnthroPrime. An authenticated calendar backend can be added later if real-time availability and booking confirmation are desired.

The supplied company's service and regulatory wording is retained as source content. Actual framework editions, compliance applicability, published contact/privacy wording, and any credential claims should be confirmed by the company before launch. This is a content-owner launch review, not a claim that the supplied statements are invalid.

Optional future work: publish approved case studies with evidence; add a maintained insights area; measure CTA conversion with privacy-conscious analytics; integrate a real scheduling system; add a CMS if nontechnical staff need frequent content changes. These features are not necessary for the implemented redesign to function.

The final professional review adds an assessment planning guide and website data notice, keeps the contact journey focused, labels simulations persistently, supplies a branded 404, fixes confirmation indexing metadata, and explicitly blocks embedded objects and base elements. Detailed findings and owner launch checks are in PROFESSIONAL-REVIEW.md.
