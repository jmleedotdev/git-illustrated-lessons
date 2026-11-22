# Issue tracker: Local Markdown

Issues and specs live as Markdown files in `.scratch/`.

## Implementation work

- One feature per directory: `.scratch/<feature-slug>/`.
- Spec: `.scratch/<feature-slug>/spec.md`.
- One ticket per file:
  `.scratch/<feature-slug>/issues/NN-<slug>.md`, numbered from `01`.
- Record triage state in a `Status:` line near the top.
  Role strings are defined in `triage-labels.md`.
- Append discussion and visual review notes under `## Comments`. Record the
  viewports, observations, and verdict; keep screenshots and recordings out of
  the repository.

When asked to publish, create the appropriate file under `.scratch/`.
When asked to fetch a ticket, read its referenced file.

## Wayfinding operations

Wayfinder tracks planning decisions separately from implementation triage.

- Map: `.scratch/<effort>/map.md`, labelled `wayfinder:map`.
- Child ticket: `.scratch/<effort>/issues/NN-<slug>.md`.
- Each ticket has a `Parent:` link, `Type:`, `Status:`, `Assignee:`,
  and `Blocked by:` line.
- Type is research, prototype, grilling, or task.
  Its label is `wayfinder:<type>`.
- Only wayfinder labels belong on maps and decision tickets.
- An unclaimed ticket has `Status: open` and an empty assignee.
- Blocking uses local ticket numbers in `Blocked by: NN, NN`.
  A ticket is unblocked when every listed blocker is resolved.
- The frontier is open, unblocked, unclaimed child tickets,
  ordered by ticket number.
- Claim before work: set `Status: claimed` and `Assignee:` to the
  developer driving the map.
- Resolve: append the resolution under `## Answer`, set
  `Status: resolved`, and add a linked gist to the map's
  Decisions so far.
- Refer to maps and tickets by linked title in human-facing output.
