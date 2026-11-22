# Coding standards

These standards apply to implementation and review. Feature specs define behavior and approved visual deviations. For lesson UI, follow the approved design references and comparison workflow in [AGENTS.md](AGENTS.md#lesson-ui).

## Commit messages

- Use `feat: <summary>` for new or changed functionality, `fix: <summary>` for corrections, and `docs: <summary>` for documentation-only changes, including specs, tickets, and review records.
- Write a concise, imperative summary that describes what changed. Choose the prefix by the commit’s primary purpose; supporting tests and docs don’t make a feature commit documentation-only.

```text
feat: add playable Start a repository lesson
fix: restore approved prototype commit sphere
docs: record visual foundations approval and resolve issue
```

## UI foundations

- Use native buttons, links, and other controls for their intended actions. Reuse existing shared components and treatments where they fit, such as `InlineText`, `.control`, `.control-primary`, and `.command-block`. Extend a treatment only when the approved design calls for a variant; don’t introduce a generic wrapper just to share styling.
- Use the palette, typography, spacing, and other shared tokens in [`src/assets/css/main.css`](src/assets/css/main.css). Reuse an existing token before adding one. Lesson CSS and SVG use palette tokens rather than literal colors; a new token should serve an approved visual need.
- Keep simple layout utilities in the Vue template. Use named CSS rules for shared treatments or when they keep responsive, multi-state, or animated styling easier to follow. Keep theme tokens, fonts, and baseline rules in `src/assets/css/main.css`.
- Reuse local assets and preserve approved SVG geometry. For decorative monochrome icons that should follow a control’s text color, use inline SVG with `currentColor`. When assets change, verify that they resolve in the production build.

## UI review

- For changed controls, check the shared treatment and token choices, plus default, hover, active, current or selected, keyboard focus, and disabled states where applicable. Check that decorative icons inherit the intended color.
- Verify accessible names, native keyboard behavior, and responsive fit. On narrow screens, make sure the fixed step navigation doesn’t cover content or focused controls. For motion changes, check the reduced-motion behavior.
- Record any intentional deviation from the approved design and any comparison you couldn’t complete because a reference was unavailable.
