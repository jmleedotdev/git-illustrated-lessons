import type { Lesson, RepositoryState } from './lesson'

function freeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze)
    Object.freeze(value)
  }
  return value
}

const notes = { name: 'notes.txt', contents: 'A little less magic.\n' }

const folder: RepositoryState = {
  initialized: false,
  head: null,
  working: [{ ...notes, status: 'existing' }],
  staged: [],
  commits: [],
}
const initialized: RepositoryState = {
  ...folder,
  initialized: true,
  head: 'main',
  working: [{ ...notes, status: 'untracked' }],
}

export const startRepository: Lesson = freeze({
  slug: 'start-a-repository',
  title: 'Start a repository',
  duration: '~ 2 min',
  difficulty: 'Beginner',
  topic: 'Local fundamentals',
  steps: [
    {
      label: 'The folder',
      title: 'Alice starts with a file.',
      action: {
        kind: 'editor',
        text: 'Alice opens the existing `notes.txt` in her project folder.',
      },
      story:
        'Alice opens `notes.txt`. It says “A little less magic.” Bob asks, “Is this file in Git already?” Alice checks the folder. It has no repository yet.',
      idea: 'A file can exist in the working directory before Git is initialized. Nothing has been staged or recorded.',
      change: '`notes.txt` is in the folder. Git, staging, and history are not set up yet.',
      transition: { kind: 'open-folder', before: folder, after: folder },
    },
    {
      label: 'Initialize',
      title: 'Alice initializes Git.',
      action: { kind: 'command', text: 'git init -b main' },
      story:
        'Alice creates a local repository with `main` as its first branch. Bob asks, “Is our note saved in Git now?” Alice explains that it still needs to be staged and committed.',
      idea: '`HEAD` points to `main`. The branch is ready for its first commit, and existing files are still untracked.',
      change:
        '`HEAD` points to `main`. `notes.txt` is untracked, staging is empty, and there are no commits.',
      transition: { kind: 'initialize', before: folder, after: initialized },
    },
    {
      label: 'Inspect',
      title: 'Alice checks the repository.',
      action: { kind: 'command', text: 'git status' },
      story:
        'Alice checks `git status`. Bob sees `notes.txt` listed as untracked and no commits on `main`. The file stays in the working directory.',
      idea: '`git status` shows what Git sees. The file, staging area, and history stay as they were.',
      change: '`main` still has no commits. `notes.txt` is untracked and staging is empty.',
      transition: { kind: 'inspect', before: initialized, after: initialized },
    },
  ],
})

export const lessons: readonly Lesson[] = Object.freeze([startRepository])
