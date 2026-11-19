# Audit Designed to Scale's visual and explanatory experience

Labels: wayfinder:research
Type: research
Status: resolved
Assignee: jmlee
Parent: [A Designed to Scale-style Git learning website](../map.md)
Blocked by:

## Question

What observable layout, typography, color, diagram, navigation, animation, and explanatory behaviors define Designed to Scale, and which of these should a Vue/SVG Git adaptation preserve? Produce an evidence-backed reference inventory and an explicit list of unknowns that a human must inspect, not a new technology-stack investigation.

## Context

- Reference: https://designed-to-scale.vercel.app/
- Reuse /tmp/designed-to-scale-research/findings.md and its downloaded assets; the existing audit was static and did not verify complete browser behavior.
- Research skill: /Users/jmlee/.agents/skills/research/SKILL.md.
- Output asset: [Reference audit](../research/reference-audit.md).
- No application code or design decisions on the human's behalf.
- No Git repository or remote exists. Local research artifact is the explicit map exception to throwaway research branch/push handling.

## Answer

Resolved through a primary-source [reference audit](../research/reference-audit.md), combining deployed HTML/CSS/JS inspection with scripted headless Chrome DOM, geometry, and interaction checks. The reference uses a three-region course workspace, warm paper/ink tokens, JetBrains Mono, isometric SVG objects, and manually advanced explanatory steps that synchronize prose and diagrams. The artifact records exact source-backed tokens, geometry, control semantics, motion timings, responsive rules, evidence labels, and verification limits for the prototype.

No screenshot-based visual approval or human motion judgment was performed. Git-specific symbols, lesson grouping, playback controls, production architecture, and acceptable fidelity exceptions remain undecided; recommendations in the audit are not approvals. New precise responsive/readability and reduced-motion questions are tracked in [Choose fidelity exceptions for responsive layout and reduced motion](05-fidelity-exceptions.md). Local artifact only: no Git branch, push, or PR was created.
