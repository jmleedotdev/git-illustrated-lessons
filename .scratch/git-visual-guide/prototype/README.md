# Disposable Git lesson layout study

**Not production scaffolding.** Local decision aid for [Choose the visual treatment for a representative Git lesson](../issues/02-representative-lesson.md). No existing application or route exists in this repository, so the study is isolated here. No Git repository or remote exists; no branch, commit, push, or production promotion was attempted.

## Run

```sh
cd .scratch/git-visual-guide/prototype
npm ci
npm run dev -- --port 5187 --strictPort
```

Open http://127.0.0.1:5187/?variant=A . The current session has started this server.

- A (human-preferred, revised): isometric scene on the left, guide on the right; hidden lesson list toggled at the far right of the header using text-only Lessons / Close labels. Git-orange/charcoal accents over warm paper; peach/slate/terracotta diagram zones. Small screens still stack scene above guide, pending the separate responsive decision.
- B: reading-first notebook; prose precedes a flatter diagram. Scrolling is intentional.
- C: scene-first canvas with an attached explanation strip and collapsible Lessons navigation.
- Switch with the bottom arrows or keyboard Left/Right. The URL preserves the variant; switching retains the step. Reload resets the scenario.
- Back/Next or numbered steps change the authored scenario; Replay replays the simple entry animation.
- Prototype state is shown below the page; expand for full values.
- No terminal execution, backend, persistence, or real mutations.
- The five sidebar titles are context placeholders, not an approved lesson plan.
- One tracked file is illustrated; unchanged repository contents are omitted.
- A/B/C on files are content-version labels, not commit hashes or variant selectors.
- Google Fonts supplies JetBrains Mono; offline use falls back to monospace.
- The switcher only renders in Vite development mode. This is not intended to ship.

## History / branch / merge comparison (approved)

Approved decision: [Choose the visual language for history, branches, HEAD, and merging](../issues/06-history-branch-merge-visuals.md#answer). Its Answer is the canonical resolution; earlier variants and iterations are disposable evidence.

Open **http://127.0.0.1:5187/?study=history&variant=A** using the same dev server above.

- A — Comic snapshot spheres (human-approved): after rejecting isometric documents and finding gradient spheres too realistic, the human requested a comic treatment. SVG circles now use bold ink outlines, flat two-tone cel shading, a small drawn highlight, and solid offset shadows—no gradients or soft lighting. Upright commit IDs are centered inside, with recorded filenames below. The current checkout’s commit uses a peach fill; the active branch is independently marked with a bold asterisk and orange label. Parent links meet the circular silhouettes. The open framing, shared history, story, and controls remain; no 3D stack is introduced.
- B — Pointer graph: compact nodes emphasize shared ancestry and movable branch labels; the snapshot inspector shows recorded contents.
- C — History ledger: explicit snapshot rows and parent IDs, with an independently scrollable history list.
- Bottom arrows or Left/Right switch treatments without resetting the current state. Back/Next and numbered steps traverse eight representative states, not a proposed eight-step production lesson.
- Compare the root commit, second commit, branch creation, switching, commit on ideas, switch back to main, divergence, and two-parent merge. The root has no baseline parent. Only the first state retains the approved unstaged edit; later states have clean checkouts.
- HEAD → branch → commit is spelled out. The active branch carries a bold `*` and Git-orange fill, with a `* current branch` legend; inactive branch labels use a neutral fill. This also appears in the textual/mobile history. Arrows on graph edges point toward parents; merge parent labels sit just above their actual arrow segments and rotate with them. Commit IDs c1–c5 and file-content versions B/C/D are illustrative, not actual hashes or editable content.
- Working directory, staging area, and recorded snapshots remain distinct. Snapshot buttons inspect a commit without switching branches.
- Phone layouts use a compact textual history in place of the SVG to preserve labels, with fixed Back/Next and safe-area padding. This is a disposable adaptation to react to, not a separate approved responsive design.
- Replay is a simple diagram fade-in only (not pointer-travel choreography); it is disabled with an explanation under reduced motion, including live preference changes. No auto-advance.
- Original staging study at `/?variant=A` remains unchanged and contains its historical pre-curriculum scenario; use the history study for the approved no-baseline opening state.
- Browser smoke checks covered all eight states in all three treatments at 1440×900, 1280×720, and 390×844: no horizontal overflow, no desktop page scrolling, internal guide scrolling at 1280×720, phone document scrolling, correct commit counts and merge parents, preserved step during switching, and no page errors. Live reduced-motion changes were checked. No automated test suite or exhaustive accessibility verification was added.
- Artifact stays local because there is no Git repository/remote. No production work, branch, push, or PR.

## Remote setup / first push comparison (approved)

Approved decision: [Choose the visual explanation of remote setup and first push](../issues/07-remote-visuals.md#answer). The human approved final revised A; that Answer is canonical. B/C remain comparison evidence.

Open **http://127.0.0.1:5187/?study=remote&variant=A** with the same dev command above.

- A — Two places, one history (approved): comic commit spheres in distinct local/hosted containers with dotted borders and separate isometric grids behind the spheres. A dashed origin connection appears without transferring history; an explicit push arrow accompanies publication. Local HEAD/current-branch and ideas remain local; GitHub receives main and its reachable commits. Explanations are confined to scene note and guide, not panel captions, a diagram footer, or a redundant status strip. The final guide names the committed files. Command blocks are plain commands; prose uses ordinary inline-code styling for -u, notes.txt, and ideas.txt.
- B — Hosted snapshot inspector: an illustrative empty/file-list GitHub view with a persistent local-repository dock. Not a dashboard replica or live integration.
- C — Transfer receipt: a textual accounting of destination, branch update, included history, excluded contents, and upstream.
- Four representative states span approved lessons eight through ten: create empty; add origin; push main with -u; inspect the result. They do not replace the approved lesson sequence. All start from the approved clean post-merge state.
- Back/Next and numbered steps move through states; bottom arrows or keyboard Left/Right compare treatments while preserving the step. Replay repeats a short entry fade, not transfer choreography. Live reduced-motion changes disable Replay and remove animation.
- GitHub account, installation, commit identity, and working HTTPS authentication are assumed. Repository creation is summarized with the name and unselected initialization options; no account access, real Git execution, or infrastructure provisioning occurs. The example remote URL is illustrative and is not a live account link.
- Phone A substitutes readable textual relationships for the wide graph. Back/Next stays fixed. “Diagram in words” provides the equivalent relationships for every treatment.
- Build/type-check passes. Browser smoke checks covered all four states in all three treatments at 1440×900, 1280×720, and 390×844 (36 combinations): no horizontal overflow, no desktop page scrolling, correct hosted commit counts and origin state, no JavaScript exceptions. Also checked live reduced motion and state-preserving switching. Desktop screenshots inspected; a CSS specificity collision initially hiding the SVG was corrected before handoff. This is not exhaustive accessibility or cross-browser certification.
- Remains disposable and local: no Git repository, branch, push, PR, or production promotion. Existing dependency-audit caveats below still apply.

## Approved treatment

The human prefers A with hidden navigation and, in the latest revision, scene left/guide right. They have confirmed the staged-vs-working distinction is clear and requested third-person storytelling. Alice edits and commits in one local repository while Bob sits beside her and asks questions; no remote workflow is implied. The revision removes editor instructions from code blocks: only actual git add / git commit commands render as code. Editing steps are labeled “In Alice’s editor.” Version changes are spelled out in sentences rather than arrow shorthand; filenames and commands in prose use inline-code emphasis, distinct from standalone command blocks. The replay control reads “Replay.” The human approved the final revised A, including its Git-orange/charcoal palette and compact heading, and the decision ticket is resolved. Breadcrumb and pills share one row; the redundant scene subtitle is removed; Key idea uses an outlined light-bulb icon. Desktop A fits the viewport with no page or guide scrolling across all four steps at 1672×920, 1440×900, 1366×768, and 1280×720. Short desktop heights hide the supplementary mental-model card; very short windows allow internal guide scrolling instead of clipping text. Debug state is in an expandable footer overlay. Mobile/readability and reduced-motion acceptance policy remain separate decisions. See the ticket's Answer for the canonical resolution; historical comments describe earlier iterations.

## Checks and limits

- `npm run build`: Vue/TypeScript checking and Vite production build passed.
- Headless Chrome checks at 1440×900 and 390×844: all three variants render, no horizontal page overflow, step 3 shows working C / staged B / committed A, layout switching retains that state, step 4 shows C / B / B.
- Revised A checked at 1672×920, 1440×900, 1024×768, and 390×844: no horizontal overflow, correct scene-left/guide-right desktop geometry, rightmost Lessons toggle opens the hidden list, and only steps 2/4 render command code. Desktop revision screenshot inspected. No claim of pixel-matching the reference or human animation approval.
- CSS disables animation under reduced-motion preference; not an accessibility certification.
- `npm audit`: six high-severity reports, all through tooling dependency picomatch 4.0.7; registry's latest picomatch is 4.0.7 at creation. No patched version available. Do not expose this development server publicly. Recheck tooling before reuse.
- Simple fade/lift animations only: no moving content-copy glyph or full reference motion choreography yet.
- No automated test suite added for this throwaway study.
