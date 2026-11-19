# Choose the visual explanation of remote setup and first push

Labels: wayfinder:prototype
Type: prototype
Status: resolved
Assignee: jmlee
Parent: [A Designed to Scale-style Git learning website](../map.md)
Blocked by: 02, 03

Prerequisites: [Choose the visual treatment for a representative Git lesson](02-representative-lesson.md) and [Choose ten short Git explanations and their scenario behavior](03-five-lessons.md).

## Question

How should the approved scene-left/story-right design distinguish Alice's local repository, an empty GitHub repository, the origin connection, and a first push, while explaining upstream briefly without suggesting automatic file synchronization? Prototype the remote sequence and obtain live human feedback on the visual clarity and level of GitHub setup detail.

## Context

- Use the approved Git palette and original story-led explanations. Do not reproduce the entire GitHub dashboard or build an account/credential tutorial.
- Show three pivotal states: an empty hosted repository, origin configured without any history transfer, and main successfully pushed with an upstream established.
- The final GitHub view shows committed files. Uncommitted working/staged contents are not transferred; ideas is not separately published, though its merged commits are included in main's history.
- Assume Git installation, commit identity, a GitHub account, and working HTTPS authentication. Do not provision real infrastructure or execute a real push as part of the prototype.
- Link real remote URLs only as illustrative examples; no secrets or actual account access is needed.
- Prototype only the decision aid, not production lessons or a general simulator.
- Consult prototype, domain-modeling, and codebase-design. Keep artifacts disposable and link them here. Resolve only after live human feedback.

## Comments

### Disposable comparison ready for human review

Claimed for jmlee. Consulted prototype (UI branch), domain-modeling, and codebase-design; reused the approved host layout without introducing a production architecture or simulator.

Asset: [Remote comparison and run instructions](../prototype/README.md#remote-setup--first-push-comparison-awaiting-feedback). Preview: http://127.0.0.1:5187/?study=remote&variant=A .

Three treatments compare the same authored states:
- **A — Two places, one history:** separate local/hosted containers with approved comic spheres; dashed origin configuration without transfer; an explicit push arrow and hosted history afterward. Local main/HEAD and ideas remain in place. The final hosted caption names committed files.
- **B — Hosted snapshot inspector:** an illustrative GitHub empty state/file list and a local-repository dock.
- **C — Transfer receipt:** explicit accounting of what was published, what was excluded, and the upstream association.

Four representative states span the approved final three lessons: create empty repository, configure origin, push main with upstream, inspect committed files. They do not alter the lesson sequence. The creation summary names git-notes and leaves README/.gitignore/license unselected. Installation, identity, account, and HTTPS authentication remain prerequisites. No real account access, Git execution, persistence, or network mutation.

Build/type-check passes. Browser smoke checks cover 36 state/treatment/viewport combinations (1440×900, 1280×720, 390×844): correct origin/hosted-history states, no horizontal overflow, no desktop page scrolling, and no JavaScript exceptions. Live reduced motion disables Replay; switching treatments retains the step. Desktop screenshots inspected, including correction of an initially hidden SVG caused by inherited CSS specificity. Not exhaustive accessibility/cross-browser testing or final motion choreography.

Proposed preference for review: A for connection/history, possibly B’s file list for the final inspection. This is an agent recommendation, not a decision. Awaiting live human feedback on visual clarity and creation-detail level; Status remains claimed, no Answer, and the map remains unchanged.

Artifact stays local because there is no Git repository/remote; no branch, commit, push, PR, or production implementation.

### Human prefers A; grid and command emphasis restored

The human prefers A but asked why the isometric square-grid background had disappeared and requested highlighting `-u` in the guidance/command. The missing grid was an omission in the remote comparison, not an approved fidelity exception.

Restored the isometric diamond-grid backdrop beneath A’s repository containers, with translucent panel fills so the grid remains visible. Kept the scene geometry and comic spheres unchanged. Highlighted and underlined `-u` in the actual `git push -u origin main` command and rendered the prose occurrence as emphasized inline code. Shared InlineText recognizes the option without HTML injection.

Build/type-check and the 36 browser combinations pass; targeted checks confirm the SVG grid and both command/prose `-u` highlights. Desktop screenshot inspected. Live reduced motion and step-preserving switching still pass. Awaiting review of this revision; preference for A is recorded, but the ticket remains claimed with no Answer or map resolution yet.

### Separate repository grids and quieter diagram

The human requested a separate isometric grid within each repository panel behind its spheres, dotted panel borders, removal of the current-branch/parent-arrow legend and hosted-repository explanatory captions, and removal of the remote visual’s bottom explanation. They specified that only the scene note and guide should carry explanations, and that `-u` should use ordinary inline-code styling in the paragraph only, with no special styling in the command block.

Revised A accordingly: two confined grids, dotted rounded borders, no per-panel explanatory captions or bottom diagram caption, and no redundant origin/upstream status strip. Repository headings, branch labels, HEAD readout, and origin/push connection labels remain identifiers. The command block is plain command text; paragraph `-u` uses the same inline-code appearance as filenames. Removed the custom amber/underline styling. Scene note and guide remain.

Build/type-check and all 36 browser combinations pass. Targeted checks confirm two panel grids, no special command markup, inline-code `-u` in prose, and no redundant status strip. Revised desktop screenshot inspected. Ticket stays claimed pending human review; no resolution or map update.

## Answer

The human approved the final revised **A — Two places, one history** with “ok i'm satisfy with this.” This resolution supersedes conflicting earlier iterations in Comments. B/C remain comparison evidence, not selected designs.

### Approved presentation

- Preserve the approved scene-left/story-right host layout, Git palette, and comic commit spheres.
- Distinguish Alice’s local repository and the GitHub repository with separate rounded, dotted-border panels. Each panel has its own isometric square-grid background behind the spheres; no shared grid outside the panels.
- Keep repository headings, local HEAD → main → c5, current-branch asterisk, branch labels, and origin/push connection labels. Remove per-panel explanatory captions, the current-branch/parent-arrow legend, the bottom visual explanation, and the redundant origin/upstream status strip. Explanations belong in the scene note and guide; equivalent diagram text remains available in the guide.
- Commands remain actual command text, without special highlighting of `-u` inside the command block. Use ordinary inline-code styling for `-u` in prose, and for filenames including both `notes.txt` and `ideas.txt`. No custom amber/underline treatment.

### Remote sequence and explanatory scope

- Illustrate creating an empty GitHub repository named git-notes, leaving README, .gitignore, and license initialization unselected. Do not reproduce the dashboard or teach credentials/account setup. Installation, identity, account, and working HTTPS authentication remain prerequisites.
- Configuring origin stores the illustrative remote address locally; GitHub stays empty and no history is sent. The dashed connection is not automatic synchronization.
- `git push -u origin main` publishes main’s reachable history, including the merged ideas commits. Hosted main points to c5; local main and ideas remain in place, and the separate ideas branch name is not published. Briefly explain upstream as origin/main and its role in subsequent pushes, not automatic synchronization.
- The guide’s final inspection names notes.txt and ideas.txt as files from c5 and distinguishes the latest committed snapshot from Alice’s live working directory. Uncommitted working/staged contents are not pushed. Removing the panel’s file caption does not remove this teaching outcome. B’s file-list panel was not selected.
- The four prototype states sample approved lessons eight through ten; they are not a replacement curriculum or simulator. No real Git commands or network mutations occur.

### Evidence and handoff

- Asset: [Disposable remote comparison and run instructions](../prototype/README.md#remote-setup--first-push-comparison-approved), `?study=remote&variant=A`.
- Build/type-check passes, including the final ideas.txt inline-code addition. Browser smoke checks covered 36 treatment/state/viewport combinations at 1440×900, 1280×720, and 390×844, with no horizontal overflow, desktop page scrolling, or JavaScript exceptions. Targeted checks confirmed separate grids, plain command text, prose inline-code styling, and removed status strip. Live reduced motion and state-preserving treatment switching pass. This is not exhaustive accessibility/cross-browser certification or approval of final motion choreography.
- Prototype remains disposable and local: no Git repository/remote exists, and no branch, commit, push, PR, or production implementation was created.
- No new fog or decision questions emerged. [Set the Vue implementation boundaries and visual acceptance criteria](04-implementation-contract.md) is now unblocked and remains for a later session.
