import { editedAgain as selected } from './chooseWhatToStage'
import { freezeLesson, type RepositoryState } from './lesson'

export const afterFirstCommit: RepositoryState = {
  ...selected,
  branches: { main: 'c1' },
  commits: [{ id: 'c1', parents: [], snapshot: selected.staged }],
}

export const recordCommit = freezeLesson({
  slug: 'record-a-commit',
  title: 'Record a commit',
  duration: '~ 2 min',
  difficulty: 'Beginner',
  topic: 'Local fundamentals',
  mentalModel: [
    'A commit records the staging area.',
    'The first commit has no parent.',
    'Committing does not discard unstaged edits.',
  ],
  steps: [
    {
      label: 'Review',
      title: 'Bob compares the copies.',
      action: {
        kind: 'editor',
        text: 'Alice rereads the new line in `notes.txt`.',
      },
      story:
        'Bob asks if the new line will be in the commit. Alice staged the note before she added it.',
      idea: 'The next commit comes from the staging area, not directly from the editor.',
      change:
        'Version C of `notes.txt` has an unstaged edit. Version B is staged. There are no commits yet.',
      transition: { kind: 'open-folder', before: selected, after: selected },
    },
    {
      label: 'Commit',
      title: 'Alice records the note.',
      action: { kind: 'command', text: 'git commit -m "Record notes"' },
      story:
        'The commit includes “Git keeps a history.” Bob sees the newer line only in the working file.',
      idea: 'Each sphere is a repository snapshot. The first commit, `c1`, is the root: it has no parent.',
      change:
        '`HEAD` points to `main`, which now points to `c1`. Staging still holds version B and matches `c1`. Version C stays in the working directory with its unstaged edit.',
      transition: { kind: 'commit', before: selected, after: afterFirstCommit },
    },
  ],
})
