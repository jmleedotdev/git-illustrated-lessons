# Choose ten short Git explanations and their scenario behavior

Labels: wayfinder:grilling
Type: grilling
Status: resolved
Assignee: jmlee
Parent: [A Designed to Scale-style Git learning website](../map.md)
Blocked by:

## Question

Which ten short lessons and concrete example states take Alice from local Git fundamentals through setting up an empty GitHub repository and first pushing her work, without letting curriculum work dominate? Set the explanation/playback behavior and the boundary between visual explanation and an interactive simulator.

## Context

- Audience understands editing code but lacks a Git mental model.
- Coverage boundary expanded with human approval: local repository initialization, working directory/status, staging, commits/history, creating/switching branches, simple merge, empty GitHub repository creation, origin, and first push. No cloning, pulling, or team collaboration.
- Fixed illustrative scenarios are approved; interactive exercises and arbitrary simulation are excluded.
- These are content and behavior decisions for a build brief, not a request to author a full course.
- Load grilling and domain-modeling; the human makes the choices.

## Comments

### Lesson scope and playback discussion

The human accepted the proposed initial progression (working directory, staging, commits, branches, merging), but requested considering ten lessons with guidance through Alice setting up a remote repository. This would expand the map's current local-only scope; the exact remote endpoint and revised scope await confirmation.

Confirmed:
- One continuous Alice-and-Bob story in a small local repository, with predefined starting states so every lesson can be opened independently. Playback does not carry mutable state between lessons; Bob is an observer, not a second Git user.
- Fixed, reader-stepped explanations: Back/Next, selectable numbered steps, and Replay for the current step's transition. Short transitions do not advance automatically. No terminal input, editable files, or branching simulation choices.

### Approved ten-lesson expansion

The human answered “yes to all” to the following proposals:
- Finish with Alice creating an empty GitHub repository, connecting her existing local repository, pushing main, and seeing committed files on GitHub. Explain local versus remote; stop before cloning, pulling, team collaboration, and pull requests.
- Ten short lessons: Start a repository; Edit and inspect; Choose what to stage; Record a commit; Read the history; Create and switch branches; Bring work together; Create a remote repository; Connect local and remote; Push the work.
- Use GitHub as the concrete host. Git installation, commit identity, GitHub account, and working HTTPS authentication are prerequisites. Illustrate repository creation and the remote URL; do not reproduce the whole dashboard or teach credential setup.

The map's scope has been revised accordingly.

### Approved scenario details

The human answered “1-3 yes” to:
- Lesson five stages and commits the newer edit left over from the staging/commit story, then inspects history. Branching begins with no uncommitted changes.
- The branch/merge story uses divergent, non-conflicting histories: Alice adds ideas.txt on ideas and changes notes.txt on main. Merging creates a two-parent merge commit. Conflict resolution and branch deletion are excluded.
- The final lesson uses git push -u origin main, briefly explains upstream as the default destination for subsequent pushes, and shows committed files on GitHub. Uncommitted contents are not pushed. The local ideas branch is not separately published, although its merged commits are included in main's history.
- Lessons generally have three to five authored steps, without padding lighter setup lessons.

### Opening-state consistency confirmed

The human answered “yes” to starting with an untracked notes.txt in a newly initialized repository. There is no hidden baseline commit. The first commit happens in lesson four, and the second in lesson five.

## Answer

The human approved ten short, story-led lessons taking Alice from a new local repository through her first push to GitHub. This resolution supersedes the original five-lesson/local-only scope and any earlier suggestion that the opening file was already tracked.

### Lesson sequence and concrete states

| Lesson | Scenario and explanatory outcome |
| --- | --- |
| 1. Start a repository | Alice initializes Git in an existing project folder containing notes.txt. Use main as the initial branch name. There are no commits yet; notes.txt is untracked. Initialization does not stage or commit files. |
| 2. Edit and inspect | Alice edits notes.txt and inspects git status. The file remains untracked; no history exists and no edits are recorded automatically. |
| 3. Choose what to stage | Alice stages notes.txt with git add notes.txt, then edits it again. The working directory holds newer contents while the staging area retains the selected version. Staging starts tracking the file; it does not move it out of the working directory. |
| 4. Record a commit | Alice commits the staged version. This is the first commit, with no parent. Her newer working-directory edit remains unstaged. The staging area matches the committed snapshot rather than becoming empty. |
| 5. Read the history | Alice stages and commits the remaining edit, producing a second commit whose parent is the first. git log connects recorded snapshots to their history. The lesson ends with no uncommitted changes. |
| 6. Create and switch branches | Alice creates ideas from main, switches to it, and adds and commits ideas.txt. Branch labels and HEAD explain the current branch. Switching back to main restores its snapshot, which does not yet include ideas.txt. |
| 7. Bring work together | Alice changes and commits notes.txt on main, so main and ideas have diverged. Merging ideas into main combines the non-conflicting changes and creates a two-parent merge commit. No conflict-resolution or branch-deletion tutorial. |
| 8. Create a remote repository | Alice creates an empty GitHub repository, without starter files or an initial remote commit. An illustrative setup flow distinguishes the hosted repository from her existing local one; this is not a dashboard replica. |
| 9. Connect local and remote | Alice adds the GitHub HTTPS URL as origin. origin is a local name for a remote address; adding it transfers no history or files. |
| 10. Push the work | Alice runs git push -u origin main. The needed committed history reaches GitHub and main gains an upstream, briefly explained as the default destination for later pushes. The final view shows committed files on GitHub. Uncommitted contents are not pushed. The ideas branch is not separately published, although its merged commits are included in main's history. |

Each lesson generally has three to five authored steps; do not pad lighter setup lessons to meet a quota. This is a build-brief decision, not a full script or production content implementation. Concrete prose, commands, and diagrams must stay consistent with these states.

### Story and playback contract

- Use one continuous Alice-and-Bob story. Alice performs local edits and Git actions; Bob observes, suggests, and asks questions, not acting as a second repository user.
- Every lesson has a predefined starting state and can be opened independently. Reader playback does not carry mutable state between lessons.
- Fixed, reader-stepped explanations with Back/Next, directly selectable numbered steps, and Replay for the current step's transition. Short transitions never advance automatically.
- No arbitrary terminal input, editable files, simulation choices, exercises, or real repository execution.
- Preserve the approved scene-left/story-right presentation and command-versus-editor-action distinction from [Choose the visual treatment for a representative Git lesson](02-representative-lesson.md). The old prototype remains visual evidence; it must not introduce an implicit starter commit into this revised story.

### Prerequisites and scope

- Assume Git is installed, commit identity is configured, and Alice has a GitHub account with working HTTPS authentication. Account creation, installation, and credential setup are prerequisites, not additional tutorials.
- GitHub is the concrete host. Show the empty-repository setup concept and remote URL without reproducing its entire dashboard or building a credential flow.
- End after a successful first push and seeing committed files on GitHub. Exclude cloning, pulling, team collaboration, pull requests, conflict resolution, branch deletion, and advanced Git operations.
- Production implementation remains outside this planning effort. History/branch/merge and local/remote visual treatments still need human-approved prototypes; responsive/accessibility policy and architecture remain separate decisions.
