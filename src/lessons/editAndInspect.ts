import { freezeLesson, type RepositoryState } from './lesson'
import { editedNote, originalNote } from './notes'

const beforeEdit: RepositoryState = {
  initialized: true,
  head: 'main',
  working: [{ ...originalNote, version: 'A', status: 'untracked' }],
  staged: [],
  commits: [],
}
const afterEdit: RepositoryState = {
  ...beforeEdit,
  working: [{ ...editedNote, status: 'untracked' }],
}

export const editAndInspect = freezeLesson({
  slug: 'edit-and-inspect',
  title: 'Edit and inspect',
  duration: '~ 2 min',
  difficulty: 'Beginner',
  topic: 'Local fundamentals',
  mentalModel: [
    'Editor saves change the working file.',
    'Editing alone does not track a file.',
    '`git status` reports without changing anything.',
  ],
  steps: [
    {
      label: 'Edit',
      title: 'Alice adds a line.',
      action: {
        kind: 'editor',
        text: 'Alice adds “Git keeps a history.” to `notes.txt` and saves the file.',
      },
      story:
        'Alice already has an empty repository on `main`. Bob suggests a new line for `notes.txt`. Alice saves it as version B, replacing version A in the working directory.',
      idea: 'Saving in the editor changes the working file. It doesn’t stage its contents or create a commit.',
      change:
        'The working directory now holds version B of `notes.txt`. It is still untracked. The staging area is empty and there are no commits.',
      transition: { kind: 'edit', before: beforeEdit, after: afterEdit },
    },
    {
      label: 'Check status',
      title: 'Bob checks what Git sees.',
      action: { kind: 'command', text: 'git status' },
      story:
        'Bob asks if Git has recorded the new line. Alice runs `git status` and shows him that `notes.txt` is still listed as untracked.',
      idea: '`git status` reports what Git sees right now. Running it doesn’t change the file, the staging area, or history.',
      change:
        'Version B of `notes.txt` is still untracked. Nothing is staged and there are still no commits on `main`.',
      transition: { kind: 'status', before: afterEdit, after: afterEdit },
    },
  ],
})
