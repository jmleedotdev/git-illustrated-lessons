# Stable, responsive lesson stage

Status: ready-for-agent

Related: [Git visual learning website spec](../git-visual-guide/spec.md)

## Problem Statement

When the scene, caption, or controls change between steps, the desktop drawing area can resize or shift. That makes it harder to compare two Git states. On smaller screens, some lessons replace the SVG with a text summary, so readers cannot see the illustration at all. The step timeline also sits below the scene instead of where readers orient themselves at the lesson heading.

## Solution

Use Lesson 1 as the reference for a shared stage across all ten lessons. Keep the SVG drawing frame stable as readers step through a lesson. Scale the full diagram proportionally when horizontal space is limited; use document scrolling when vertical space is limited. Let the surrounding canvas grow downward for captions and other details. Put the timeline directly below the lesson heading and before the stage on every viewport.

## User Stories

1. As a desktop reader, I want the stage to keep the same size and position as I change steps, so that I can compare what changed in the Git state without the drawing area jumping.
2. As a reader moving between lessons, I want the same stage sizing at a given viewport, so that a branch graph or remote diagram does not introduce a different layout.
3. As a reader on a narrow screen, I want to see the whole SVG without cropping or horizontal panning, so that I can follow the visual explanation even if the labels are small.
4. As a reader who cannot easily read a scaled-down diagram, I want readable text describing the relevant Git state, so that I can follow the explanation without decoding tiny labels.
5. As a reader on a short screen, I want to scroll the page to reach the full scene and caption, so that a limited screen height does not shrink the diagram further.
6. As a reader on a step with a long caption, I want the caption to wrap below the drawing frame, so that I can read it in full without the scene moving or gaining its own scrollbar.
7. As a reader inspecting a commit, I want expanded details to open without resizing or moving the drawing frame, so that I can refer back to the same scene.
8. As a reader replaying a step or using reduced motion, I want changes in playback controls or explanatory text not to move the stage, so that I can keep my place.
9. As a reader navigating steps, I want the timeline immediately below the lesson heading and above the stage, so that I can choose a step before reading its illustration.
10. As a phone reader, I want all timeline labels and controls to wrap into readable, tappable rows, so that I do not have to scroll sideways to find a step.
11. As a keyboard reader, I want the timeline before the stage controls in reading and focus order, so that tabbing follows the displayed layout.
12. As a reader using browser zoom, I want readable text and controls and a complete diagram, so that zoom does not make any part of the lesson unreachable.

## Implementation Decisions

- **Stage vs. canvas:** The stage is the frame that holds the SVG drawing. The lesson canvas contains that frame and the surrounding content, including the scene caption. The stability guarantee is for the drawing frame, not the full figure or the positions of individual SVG objects. Intentional scene animation is unchanged.
- Use the same stage sizing rule for all ten lessons. Derive the desktop size cap from the current Lesson 1 appearance at **1440 × 900, 100% browser zoom**, and use its proportions as the reference. Measure and record the baseline before changing layout. Lesson 1's `960 × 500` viewBox is a proportion reference, not a prescribed CSS pixel size.
- Below the cap, size the frame to the available width at its established proportions. At an unchanged viewport, step selection, playback controls, reduced-motion messages, long captions, summaries, and inspector expansion must not change the frame's width, height, or position in the page. Do not size the frame from the vertical space left over after laying out step content.
- Fit each SVG to the shared frame with its own aspect ratio intact. Blank space is acceptable; stretching, cropping, and replacing an SVG with text are not. Preserve scene geometry and motion unless a targeted change is needed to keep the whole scene visible.
- Let captions and other variable-height details grow in normal flow below the drawing frame. Keep the space above the frame stable when playback controls change. The page can scroll vertically, including on short desktops and landscape phones; the canvas does not get a nested scrollbar. Preserve the existing guide and Back/Next behavior where practical.
- Put the timeline in the shared lesson layout, immediately after the heading and before the stage in both visual and DOM order. Keep selectable numbered steps and readable labels. Allow wrap without sideways scrolling, and keep row count and occupied height stable when selection changes at a given width.
- Scale only the drawing, not the surrounding interface. Keep existing readable text alternatives and accessible scene descriptions; where compact summaries are needed, show them in addition to the SVG. Preserve visible keyboard focus, at least 44 × 44 CSS px interactive targets, reduced-motion behavior, and unobscured content and focus above the fixed mobile Back/Next bar.
- Validate Lesson 1 first, then apply and verify the shared layout across the course, including history, branch/merge, and remote scenes. Keep the approved visual language and shared tokens.

## Testing Decisions

- Use the existing **browser-level lesson and course tests** as the automated seam. Exercise routed lessons and real controls; assert visible geometry, reading and focus order, and reachability rather than internal component or CSS structure. Extend the existing desktop scene/guide placement, phone keyboard and fit, and all-course responsive checks.
- At a fixed viewport, compare the stage's document-relative position and size before and after selecting steps, replaying, changing reduced motion, getting a wrapped caption, and opening inspector details. Check the timeline's height across selection changes, including a six-step lesson at phone width. Normal scrolling and animation inside the frame are not layout jumps.
- Check that all ten lessons keep their complete SVGs available without horizontal overflow on desktop, short desktop, and phone widths. Cover repository, history, branch/merge, and remote scenes, including cases that previously switched to text-only. Check that longer content remains reachable by page scrolling, text alternatives are available where needed, and controls remain usable by keyboard and touch.
- Validate at **1440 × 900** first, then cover wider desktop, short desktop (e.g. **1200 × 560**), phone widths including **390 px** and **320 px**, a short landscape viewport, and **200% browser zoom**. Use manual checks where needed for actual browser zoom and visual clipping.
- Open the matching revised A study and proposed lesson side by side at the same viewport and zoom. Compare layout, controls, and SVG geometry, including viewBox, paths, and placement. Record the viewport, observations, intentional differences, and verdict in review comments.

## Out of Scope

- Rewriting Git explanations, changing lesson order or step behavior, redesigning artwork, or revising the approved visual language.
- Redesigning the guide, lesson list, or Back/Next navigation.
- Making every label inside every SVG readable on the smallest screen. Readable text alternatives cover the meaning when the drawing is small.
- Requiring the entire workspace to fit above the fold on short screens, or preventing intentional motion within the diagram.

## Further Notes

This follow-up supersedes the earlier layout only where it conflicts with the agreed behavior: the timeline is above the stage, full SVGs stay visible alongside text on narrow layouts, and short-screen page scrolling takes priority over shrinking the stage to fit the viewport height. The [revised A approval](../git-visual-guide/issues/02-representative-lesson.md#answer), [responsive fidelity exceptions](../git-visual-guide/issues/05-fidelity-exceptions.md#answer), and [shared token approval](../git-visual-guide-foundation/issues/02-establish-and-review-shared-design-tokens.md#comments) still apply otherwise.

Keep this as one implementation task with Lesson 1 as the first verification checkpoint.

## Comments

**Implementation and visual review — Chromium.** Before editing, measured all three Lesson 1 steps at **1440 × 900, 100%**: the SVG element was 1006 × 476.52 CSS px with motion enabled, so its 960:500 viewBox occupied about **915 × 476.5 CSS px** after aspect-ratio fitting. With reduced motion the old element dropped to 449.52 px tall. The new frame is **915 × 476.56 CSS px** in both modes. Lesson 1 remained scene-left and guide-right at that viewport.

Opened the matching revised A staging, history/branch/merge, and remote studies next to the proposed lessons at **1440 × 900**, and compared phone layouts at **390 × 844** and the merge layout at **1200 × 560**, all at **100%**. Checked heading, timeline, Replay, Back/Next, viewBoxes, and placement of the platform, page, snapshot, parent arrows, and remote panels. No production SVG paths or viewBoxes changed: early repository scenes retain 960 × 500; the narrower production branch bounds differ from the study; merge and remote retain their respective 1060 × 475 and 900 × 420 extents. Differences are the timeline above the scene, drawings fitted into a common centered frame, and variable notes/readouts below it. At short desktop height the merge graph no longer collapses to text; readers scroll the page to see the rest. At phone width the full drawings accompany the readable summaries, and the fixed walkthrough remains in place. Checked all 32 step diagrams at 320 CSS px: all rendered SVG labels were inside their drawing frames. Focus order follows the new timeline placement.

Checked real **200% browser zoom** on Lesson 1, merge, and push. At the resulting **720 × 406 CSS px** viewport the drawing frame was **668 × 347.91 CSS px** in all three, captions retained their CSS font size, and none had horizontal document overflow. `pnpm verify` passed, including 58 Playwright tests each against dev and production preview, with course-wide checks at seven viewport sizes and an in-place six-step timeline check on a 320 px phone. **Verdict:** matches the responsive-stage spec and its listed fidelity exceptions; not a new human visual approval.

**Lessons 8–10 summary follow-up.** Compared the remote push step with revised A and Lesson 7 side by side in Chromium at **1440 × 900** and **320 × 700**, both at **100%**. The new always-visible Alice’s computer and GitHub cards reuse the two-column history treatment and shared legend. They intentionally add an HTML summary under the SVG where revised A had only a scene note on desktop and text in place of the diagram on phones. The remote 900 × 420 viewBox, panel paths, origin and push indicators, and picture placement within the frame were unchanged; the cards and caption are reachable by scrolling past the drawing. No horizontal overflow at either size. `pnpm check` and all 60 development Playwright tests passed, including checks for pre-creation, empty, and published GitHub states at both widths. **Verdict:** the summary matches the preceding lesson layout without affecting the stage.
