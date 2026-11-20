import { afterFirstCommit } from './recordCommit'
import { freezeLesson, type RepositoryState } from './lesson'
import { newerNote } from './notes'

const staged: RepositoryState = { ...afterFirstCommit, staged: [newerNote] }
export const afterSecondCommit: RepositoryState = {
  ...staged,
  branches: { main: 'c2' },
  commits: [...staged.commits, { id: 'c2', parents: ['c1'], snapshot: staged.staged }],
}

export const readHistory = freezeLesson({
  slug: 'read-the-history',
  title: 'Read the history',
  duration: '~ 3 min',
  difficulty: 'Beginner',
  topic: 'Local fundamentals',
  mentalModel: [
    'A commit records a snapshot, not just the changed lines.',
    'Parent links lead back through history.',
    'Inspecting a snapshot does not check it out.',
  ],
  steps: [
    {
      label: 'Review',
      title: 'Bob spots the remaining edit.',
      action: {
        kind: 'editor',
        text: 'Alice checks that “Only selected contents go in.” is still in `notes.txt`.',
      },
      story:
        'Bob sees that Alice’s newest line is still in the editor even though it was not recorded in `c1`. Alice decides to include it in the next commit.',
      idea: 'The working directory can differ from both staging and the recorded snapshot.',
      change:
        '`HEAD` points to `main`, which points to the root commit `c1`. Staging matches its earlier contents. The newer edit remains unstaged.',
      transition: { kind: 'open-folder', before: afterFirstCommit, after: afterFirstCommit },
    },
    {
      label: 'Stage',
      title: 'Alice stages the remaining edit.',
      action: { kind: 'command', text: 'git add notes.txt' },
      story:
        'Alice stages `notes.txt` again. Now the staging area includes “Only selected contents go in.” The file in her editor stays put.',
      idea: 'Staging prepares the next snapshot. It does not rewrite an existing commit.',
      change:
        'The working directory and staging area now hold version C of `notes.txt`. `HEAD` still points to `main` at `c1`, which records version B and has no parent.',
      transition: { kind: 'stage', before: afterFirstCommit, after: staged },
    },
    {
      label: 'Commit',
      title: 'Alice records the newer contents.',
      action: { kind: 'command', text: 'git commit -m "Add the remaining line"' },
      story:
        'The new commit `c2` records all of `notes.txt`, including the remaining line. It links back to the previous commit, `c1`.',
      idea: 'The arrow from `c2` points to its only parent, `c1`. Each sphere is a complete repository snapshot.',
      change:
        '`HEAD` still points to `main`, which advances to `c2`. The working directory and staging area both match `c2`, so there are no uncommitted changes.',
      transition: { kind: 'commit', before: staged, after: afterSecondCommit },
    },
    {
      label: 'Log',
      title: 'Bob follows the history back.',
      action: { kind: 'command', text: 'git log' },
      story:
        'Alice runs `git log`. It lists the newer commit first, then the root. Bob inspects the snapshots to compare the recorded lines without changing the checkout.',
      idea: 'Reading history leaves the working directory, staging area, and current branch alone.',
      change:
        'History shows `c2` followed by its parent `c1`, which has no parent. `HEAD` stays on `main` at `c2`; the working directory and staging area still match `c2`.',
      transition: { kind: 'log', before: afterSecondCommit, after: afterSecondCommit },
    },
  ],
})
