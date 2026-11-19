# Git visual guide — foundation breakdown index

This approved breakdown splits [08 — Open and play “Start a repository”](../git-visual-guide/issues/08-open-and-play-start-a-repository.md) into executable child tickets. The original ticket remains unchanged as the source requirement; implement these children rather than independently implementing the original bundled ticket.

This file is a ticket-breakdown index, not a second implementation spec. The [main implementation spec](../git-visual-guide/spec.md) is the single authoritative source for product behavior, approved presentation, foundation-first sequencing, and the development-only showcase boundary. The child tickets below supply executable scope and blocking edges.

## Tickets and frontier

1. [Scaffold Vue with human-controlled setup](issues/01-scaffold-vue-with-human-controlled-setup.md) — implementation complete; setup choices, verification, and unresolved development-dependency advisories recorded in the ticket.
2. [Establish and review shared design tokens](issues/02-establish-and-review-shared-design-tokens.md) — complete, including explicit human approval of the revised visual foundations.
3. [Build and play Start a repository with approved tokens](issues/03-build-and-play-start-a-repository.md) — unblocked; not started.

The showcase is development tooling, not a production destination. Shared tokens and licensed font assets ship with the website; the showcase entry, examples, and showcase-only assets do not ship in the production build.

The existing Edit, inspect, and stage selected contents ticket follows child 03. Other downstream dependencies remain unchanged. Publishing these tickets does not start installation or authorize Git initialization, remote creation, pushing, or deployment.
