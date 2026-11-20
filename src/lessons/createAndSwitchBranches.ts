import { freezeLesson, type RepositoryState } from './lesson'
import { ideaFile } from './notes'
import { afterSecondCommit } from './readHistory'

const opening = afterSecondCommit
const created: RepositoryState = { ...opening, branches: { main: 'c2', ideas: 'c2' } }
const switched: RepositoryState = { ...created, head: 'ideas' }
const edited: RepositoryState = {
  ...switched,
  working: [...switched.working, { ...ideaFile, status: 'untracked' }],
}
const staged: RepositoryState = {
  ...switched,
  working: [...switched.working, { ...ideaFile, status: 'tracked' }],
  staged: [...switched.staged, ideaFile],
}
const recorded: RepositoryState = {
  ...staged,
  branches: { main: 'c2', ideas: 'c3' },
  commits: [...staged.commits, { id: 'c3', parents: ['c2'], snapshot: staged.staged }],
}
export const afterReturningToMain: RepositoryState = {
  ...recorded,
  head: 'main',
  working: opening.working,
  staged: opening.staged,
}

export const createAndSwitchBranches = freezeLesson({
  slug: 'create-and-switch-branches',
  title: 'Create and switch branches',
  duration: '~ 4 min',
  difficulty: 'Beginner',
  topic: 'Branches',
  mentalModel: [
    'A branch is a movable reference into shared history.',
    'HEAD identifies the current branch.',
    'Changing the checkout does not delete recorded history.',
  ],
  steps: [
    {
      label: 'Create',
      title: 'A new name for the same commit.',
      action: { kind: 'command', text: 'git branch ideas' },
      story:
        'Alice starts with a clean checkout on `main` at `c2`. She creates `ideas`. Bob sees a second label on the same sphere, not a second set of files.',
      idea: 'A branch is a movable reference to a commit, not a copy of the repository.',
      change:
        'Both `main` and `ideas` point to `c2`, whose parent is `c1`. `HEAD` stays on `main`; the working directory and staging area still match `c2`.',
      transition: { kind: 'create-branch', before: opening, after: created },
    },
    {
      label: 'Switch',
      title: 'HEAD follows the chosen branch.',
      action: { kind: 'command', text: 'git switch ideas' },
      story:
        'Alice switches to `ideas`. Bob looks at the editor and finds the same `notes.txt`: nothing in the file needed to change.',
      idea: 'Switching changes the current branch. Both names still select the same snapshot here.',
      change:
        '`HEAD` now points to `ideas` at `c2`. `main` still points to `c2`, and the working directory and staging area are unchanged.',
      transition: { kind: 'switch-branch', before: created, after: switched },
    },
    {
      label: 'Edit',
      title: 'Alice writes down an idea.',
      action: {
        kind: 'editor',
        text: 'Alice creates `ideas.txt` and writes “Draw the history as a map.”',
      },
      story:
        'Bob suggests drawing a map of the commits. Alice makes a new file for the idea without touching `notes.txt`.',
      idea: 'A new working file is untracked until Alice stages it.',
      change:
        '`ideas.txt` appears only in the working directory. Staging still matches `c2`. Both branches still point to `c2`, with `ideas` current.',
      transition: { kind: 'edit', before: switched, after: edited },
    },
    {
      label: 'Stage',
      title: 'Alice stages the new file.',
      action: { kind: 'command', text: 'git add ideas.txt' },
      story:
        'Alice selects `ideas.txt` for the next commit. The file stays in her editor, and the unchanged `notes.txt` is still in staging.',
      idea: 'The next snapshot will include both the unchanged note and the newly staged idea.',
      change:
        'Both the working directory and staging area now hold `notes.txt` and `ideas.txt`. Neither branch has moved; `HEAD` still points to `ideas` at `c2`.',
      transition: { kind: 'stage', before: edited, after: staged },
    },
    {
      label: 'Commit',
      title: 'Only the current branch moves.',
      action: { kind: 'command', text: 'git commit -m "Add ideas"' },
      story:
        'Alice records both staged files in `c3`. Bob follows the arrow back to `c2`, the only parent. It is still one shared history.',
      idea: 'A new commit advances the current branch. Other branch references stay where they are.',
      change:
        '`ideas` advances to `c3`; `main` stays at `c2`. `HEAD` stays on `ideas`. The working directory and staging area match `c3`, which records unchanged `notes.txt` and new `ideas.txt`.',
      transition: { kind: 'commit', before: staged, after: recorded },
    },
    {
      label: 'Return',
      title: 'The files follow the checkout.',
      action: { kind: 'command', text: 'git switch main' },
      story:
        'With no uncommitted changes, Alice returns to `main`. Bob no longer sees `ideas.txt` in the editor, but he can still find it by inspecting `c3`.',
      idea: 'Switching restores the selected snapshot. It does not delete the commit you left.',
      change:
        '`HEAD` points to `main` at `c2`. The working directory and staging area now contain only `notes.txt`. `ideas` still points to `c3`, which keeps `ideas.txt` and links back to `c2`.',
      transition: { kind: 'switch-branch', before: recorded, after: afterReturningToMain },
    },
  ],
})
