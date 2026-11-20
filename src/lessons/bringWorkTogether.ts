import { afterReturningToMain, ideaFile } from './createAndSwitchBranches'
import { freezeLesson, type RepositoryState } from './lesson'
import { newerNote } from './notes'

const opening = afterReturningToMain
const revisedNote = {
  ...newerNote,
  version: 'D',
  contents: 'A little less magic.\nGit keeps a history.\nOnly staged contents go into a commit.\n',
}
const edited: RepositoryState = {
  ...opening,
  working: [{ ...revisedNote, status: 'tracked' }],
}
const staged: RepositoryState = { ...edited, staged: [revisedNote] }
const diverged: RepositoryState = {
  ...staged,
  branches: { main: 'c4', ideas: 'c3' },
  commits: [...staged.commits, { id: 'c4', parents: ['c2'], snapshot: staged.staged }],
}

const combined = [revisedNote, ideaFile]
const merged: RepositoryState = {
  ...diverged,
  branches: { main: 'c5', ideas: 'c3' },
  working: combined.map((file) => ({ ...file, status: 'tracked' })),
  staged: combined,
  commits: [...diverged.commits, { id: 'c5', parents: ['c4', 'c3'], snapshot: combined }],
}

export const bringWorkTogether = freezeLesson({
  slug: 'bring-work-together',
  title: 'Bring work together',
  duration: '~ 4 min',
  difficulty: 'Beginner',
  topic: 'Merging',
  mentalModel: [
    'Divergent branches can share a common ancestor.',
    'A merge commit records one snapshot with two parents.',
    'Merging advances the current branch without deleting the other branch.',
  ],
  steps: [
    {
      label: 'Check',
      title: 'Two branches, one clean checkout.',
      action: { kind: 'command', text: 'git status' },
      story:
        'Before editing, Alice checks that she is on `main` and has no uncommitted changes. Bob can still find `ideas.txt` by inspecting `c3`, even though it is not in the checkout.',
      idea: 'A clean checkout matches the current commit, not every branch in the repository.',
      change:
        '`HEAD` points to `main` at `c2`. The working directory and staging area match `c2`. `ideas` points to `c3`, whose parent is `c2`.',
      transition: { kind: 'status', before: opening, after: opening },
    },
    {
      label: 'Edit',
      title: 'Alice revises the notes on main.',
      action: {
        kind: 'editor',
        text: 'Alice changes the last sentence in `notes.txt` to “Only staged contents go into a commit.”',
      },
      story:
        'Alice wants the note to say exactly what goes into a commit. Bob spots the new sentence in her editor, but the staging area and the recorded snapshots still contain the old one.',
      idea: 'An edit changes the working directory, not the staging area or history.',
      change:
        'Only the working copy of `notes.txt` changes. Staging still matches `c2`, and neither branch moves.',
      transition: { kind: 'edit', before: opening, after: edited },
    },
    {
      label: 'Stage',
      title: 'Alice selects the revised notes.',
      action: { kind: 'command', text: 'git add notes.txt' },
      story:
        'Alice stages the new sentence. Bob sees the same revised `notes.txt` in the working directory and staging area, but not in `c2`.',
      idea: 'Staging prepares a snapshot; it does not change recorded history.',
      change:
        'Staging now holds the revised `notes.txt`. `HEAD` stays on `main` at `c2`, and `ideas` stays at `c3`.',
      transition: { kind: 'stage', before: edited, after: staged },
    },
    {
      label: 'Commit',
      title: 'Two paths from one shared past.',
      action: { kind: 'command', text: 'git commit -m "Revise notes"' },
      story:
        'Alice commits the revised `notes.txt` on `main`. Bob follows the arrows from `c4` and `c3` back to the same commit, `c2`. One path revised the note; the other added `ideas.txt`.',
      idea: 'The branches have diverged: neither tip is an ancestor of the other.',
      change:
        '`main` advances to `c4`, whose parent is `c2`. `ideas` stays at `c3`. The working directory and staging area now match `c4`.',
      transition: { kind: 'commit', before: staged, after: diverged },
    },
    {
      label: 'Merge',
      title: 'One snapshot, two parents.',
      action: { kind: 'command', text: 'git merge ideas' },
      story:
        'Alice runs `git merge ideas`. One branch revised `notes.txt`; the other added `ideas.txt`. Git keeps both changes, and Bob can follow either path back to `c2`.',
      idea: '`c5` keeps both histories. Its first parent is `c4` from `main`; its second is `c3` from `ideas`.',
      change:
        '`main` advances to `c5`; `HEAD` stays on `main` and `ideas` stays at `c3`. The working directory and staging area match `c5`.',
      transition: { kind: 'merge', before: diverged, after: merged },
    },
  ],
})
