# Choose fidelity exceptions for responsive layout and reduced motion

Labels: wayfinder:grilling
Type: grilling
Status: resolved
Assignee: jmlee
Parent: [A Designed to Scale-style Git learning website](../map.md)
Blocked by: 01

Research prerequisite: [Audit Designed to Scale's visual and explanatory experience](01-reference-audit.md).

## Question

Should the Git adaptation preserve the reference's whole-workspace desktop scaling and diagram-before-prose mobile order, or deliberately depart to protect readability and touch targets? What reduced-motion alternative and accessible diagram explanation should be required even where the reference lacks them?

## Context

- The audit observed desktop scaling based on a 1672×920 design workspace. At 1200×560, header height was approximately 32.9 displayed pixels and guide navigation buttons approximately 23.1px tall.
- At narrow widths the reference stacks the scene above the explanatory guide, with fixed bottom navigation. Whether that reading order suits Git remains a human decision.
- Reduced-motion emulation did not stop guide animations or moving packets. The sampled primary SVG had no accessible name. These are reference observations, not behavior approved for replication.
- Evidence: [Reference audit](../research/reference-audit.md), especially responsive and accessibility sections.
- Load grilling and domain-modeling. Preserve the user's visual goal while making any exceptions explicit; do not silently assume permission to change the design.

## Answer

The human approved all five recommendations with “1-5 yes.” These are explicit fidelity exceptions and accessibility requirements for the build-ready brief, not authorization to implement the website or modify the disposable prototype.

### Readability before whole-workspace scaling

- Preserve the approved scene-left/story-right desktop composition and compact desktop fit where practical. Do not shrink the entire workspace to force it into a smaller viewport.
- Keep story text at least 16px and interactive targets at least 44×44px.
- Allow internal guide scrolling on short desktops, as in the approved prototype. Switch to a vertically scrolling layout when two columns no longer remain readable.
- Browser zoom must enlarge content rather than trigger compensating shrinkage.

### Small-screen reading order and navigation

- Retain scene first, then story, with normal document scrolling. Keep the current step's scene compact so the explanation is not unnecessarily far away.
- Preserve essential Git distinctions and labels. Remove decorative space before shrinking meaningful content; do not author separate mobile lesson content.
- Keep Back/Next in a fixed bottom bar on phones, with safe-area spacing and enough content padding that the bar never covers text or keyboard focus.
- Keep numbered step selection and Replay near the scene rather than crowding the bottom bar. Lessons remains available from the header.

### Reduced motion

- Honor the system reduced-motion preference both on load and when it changes during use.
- Display the completed diagram state immediately. Remove object travel, camera movement, bouncing, animated link drawing, and decorative loops rather than merely shortening their duration.
- Pair each final state with the explanation of what changed. Keep Replay visible but disabled, with a clear “Unavailable with reduced motion” explanation.
- Neither normal nor reduced-motion playback advances steps automatically, preserving the approved reader-stepped behavior from [Choose ten short Git explanations and their scenario behavior](03-five-lessons.md).

### Accessible diagram explanations and controls

- Give every scene an accessible name and a per-step textual explanation of its relevant Git state and changes. Reuse the story where it already provides equivalent information; meaning must not depend on interpreting the SVG.
- Never rely on color alone.
- Require keyboard-operable controls, visible focus, announced current-step changes, and sensible focus return when Lessons closes.
- These are deliberate improvements over the reference, not claims that the reference or existing prototype already meets them.

### Handoff

[Set the Vue implementation boundaries and visual acceptance criteria](04-implementation-contract.md) will incorporate this policy into the implementation brief and observable checks. History/branch/merge and remote visual treatments remain with their existing prototype tickets; no new decision tickets or fog emerged from this resolution. No application or prototype code was changed, and no new browser or accessibility verification is claimed.
