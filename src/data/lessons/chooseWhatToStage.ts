import type { RepositoryState } from '@/types/lesson'
import { freezeLesson } from './freezeLesson'
import { editedNote, newerNote } from './notes'

const untracked: RepositoryState = {
  initialized: true,
  head: 'main',
  working: [{ ...editedNote, status: 'untracked' }],
  staged: [],
  commits: [],
}
const staged: RepositoryState = {
  ...untracked,
  working: [{ ...editedNote, status: 'tracked' }],
  staged: [editedNote],
}
export const editedAgain: RepositoryState = {
  ...staged,
  working: [{ ...newerNote, status: 'tracked' }],
}

export const chooseWhatToStage = freezeLesson({
  slug: 'choose-what-to-stage',
  title: 'Choose what to stage',
  duration: '~ 3 min',
  difficulty: 'Beginner',
  topic: 'Local fundamentals',
  mentalModel: [
    'The working file stays in place.',
    'Staging copies selected contents.',
    'Later edits do not change the staged copy.',
  ],
  steps: [
    {
      label: 'Review',
      title: 'Alice reviews the note.',
      action: {
        kind: 'editor',
        text: 'Alice reads version B of `notes.txt` before deciding what to stage.',
      },
      story:
        'Alice has an initialized repository on `main` and an edited file. Bob asks whether the line “Git keeps a history.” is ready to record. Alice decides to stage the note as it is.',
      idea: 'The working directory holds the file Alice edits. The staging area holds the contents she selects for the next commit.',
      change:
        'Version B of `notes.txt` is untracked. The staging area is empty and there are no commits.',
      transition: { kind: 'open-folder', before: untracked, after: untracked },
    },
    {
      label: 'Stage',
      title: 'Alice selects version B.',
      action: { kind: 'command', text: 'git add notes.txt' },
      story:
        'Alice runs `git add notes.txt` to stage the contents she just reviewed. Bob sees a copy appear in the staging area. The original working file is still there.',
      idea: 'Staging copies the file’s current contents into the staging area. It starts tracking the file but doesn’t create a commit.',
      change:
        'Version B of `notes.txt` stays in the working directory. A copy of version B is now staged. There are no commits yet.',
      transition: { kind: 'stage', before: untracked, after: staged },
    },
    {
      label: 'Edit again',
      title: 'Alice makes another edit.',
      action: {
        kind: 'editor',
        text: 'Alice adds “Only selected contents go in.” and saves `notes.txt`.',
      },
      story:
        'Bob asks what Alice would commit. She points to staged version B, not the new version C.',
      idea: 'Later edits don’t refresh staging. The next commit would still use version B.',
      change:
        'The working directory holds version C of `notes.txt`. The staging area still holds version B. There are no commits.',
      transition: { kind: 'edit', before: staged, after: editedAgain },
    },
  ],
})
