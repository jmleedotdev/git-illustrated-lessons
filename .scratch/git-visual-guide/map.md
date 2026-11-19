# Map: A Designed to Scale-style Git learning website

Labels: wayfinder:map

## Destination

A build-ready brief for a visually faithful, Designed to Scale-style Git learning website, implemented with Vue, TypeScript, SVG, Vite, and Tailwind CSS. The brief settles the presentation, ten short lessons from local Git fundamentals through a first push to GitHub, explanatory behavior, architecture, and acceptance criteria; implementing the website is a later effort.

## Notes

- Personal learning and research project. Website presentation is the main goal; lesson depth is secondary, with ten short lessons approved.
- Primary reference: https://designed-to-scale.vercel.app/ . Reproduce its overall layout, typography, colors, navigation, diagram style, and animation feel as closely as practical, adapting diagrams and writing original explanations for Git.
- Audience: people who edit code but need a visual mental model of Git commands and state.
- Fixed stack: Vue + TypeScript + SVG + Vite + Tailwind CSS. Do not introduce React, Next.js, Three.js, or React Three Fiber by default.
- Explanation-led, not an arbitrary-command terminal, exercise platform, or Git simulator. Illustrative scenarios may support explanations. The approved story/playback contract is recorded in [Choose ten short Git explanations and their scenario behavior](issues/03-five-lessons.md).
- Expanded scope approved during [Choose ten short Git explanations and their scenario behavior](issues/03-five-lessons.md): local fundamentals through creating an empty GitHub repository, adding it as origin, and first pushing main. The approved sequence and scenario details live in that resolution. Git installation, commit identity, GitHub account, and HTTPS authentication are prerequisites, not setup tutorials.
- Consult grilling and domain-modeling for human decisions; research for reference auditing; prototype plus codebase-design for the visual/architecture decisions as appropriate.
- Planning only: no application scaffolding or production implementation during charting. Prototypes are disposable decision aids and require human feedback.
- Map complete: all decision tickets are resolved and the destination is reached. Handoff: [Git visual learning website — implementation spec](spec.md), consolidated as a self-contained spec with implementation status ready-for-agent and user-confirmed testing seams. Production implementation requires a separate effort.
- Tracker: local Markdown. Open/unassigned tickets have Status: open; claim with Status: claimed and Assignee: jmlee before work; resolve with an Answer, Status: resolved, and a linked gist below. Blocked by lists local ticket numbers; relationships are wired after creation. Only wayfinder labels are used.
- Research storage exception: this directory has no Git repository or remote. Keep the reference audit under research/ locally; do not initialize Git, fabricate a branch, push, or open a PR. The prescribed throwaway research branch cannot be created/pushed until repository setup is authorized.
- Existing evidence: /var/folders/lp/810427xx1tl7k3sgf538hzz80000gn/T/website-stack-research-handoff.md and /tmp/designed-to-scale-research/findings.md . These establish technology fingerprints, not a complete visual/behavior audit.
- Resolve at most one human decision ticket per session. Research may complete independently.

## Decisions so far

- [Audit Designed to Scale's visual and explanatory experience](issues/01-reference-audit.md): source and browser-backed reference inventory is ready for prototyping; visual/motion approval and adaptation choices remain open.
- [Choose the visual treatment for a representative Git lesson](issues/02-representative-lesson.md): approved revised A—scene left, story-led guide right, hidden lessons, Git-themed palette, clear command styling, and compact desktop fit.

- [Choose ten short Git explanations and their scenario behavior](issues/03-five-lessons.md): approved ten independently openable, reader-stepped Alice-and-Bob lessons from a fresh local repository through a first GitHub push.
- [Choose fidelity exceptions for responsive layout and reduced motion](issues/05-fidelity-exceptions.md): approved readability-first adaptation, scene-first phone layout with fixed Back/Next, immediate reduced-motion states, and accessible textual diagram explanations and controls.

- [Choose the visual language for history, branches, HEAD, and merging](issues/06-history-branch-merge-visuals.md): approved comic-style commit spheres, starred current-branch labels, arrow-aligned parent labels, and open shared-history framing.

- [Choose the visual explanation of remote setup and first push](issues/07-remote-visuals.md): approved revised A with separate dotted/grid repository panels, explicit origin-versus-push states, and explanations confined to the scene note and guide.
- [Set the Vue implementation boundaries and visual acceptance criteria](issues/04-implementation-contract.md): approved authored-state modules, hash navigation, interruptible step motion, focused test coverage, and human visual acceptance gates; amended to include Tailwind CSS; [self-contained implementation spec](spec.md) consolidates all approved treatments, behavior, and acceptance requirements. The user confirmed the rendered-website and public content/player testing seams.

## Not yet specified

None. All decision tickets are resolved; the build-ready brief is complete. Production implementation and its acceptance evidence belong to the later build effort, not further planning tickets on this map.

## Out of scope

- Building/deploying the production website during this planning effort.
- A complete Git course, cloning, pulling, team collaboration, pull requests, rebase, cherry-pick, or advanced recovery. GitHub repository creation and a first push are in scope; account provisioning, credential setup, and broader hosting-provider workflows are not.
- An arbitrary Git terminal, real repository execution, quizzes, scoring, and a general-purpose simulator.
- Accounts, a backend, payments, analytics, localization, or a content-management system unless the destination is explicitly reconsidered.
- 3D scenes or a Three.js/R3F stack.
