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
        'Alice has a project folder containing `notes.txt`. It says “A little less magic.” Bob asks, “Does having a file mean Git is already looking after it?” Not yet. This folder has no local repository.',
      idea: 'A file can exist in the working directory before Git is initialized. Nothing has been staged or recorded.',
      change:
        'Alice opens the folder. `notes.txt` is present. There is no local repository, staging area, or recorded history yet.',
      transition: { kind: 'open-folder', before: folder, after: folder },
    },
    {
      label: 'Initialize',
      title: 'Alice initializes Git.',
      action: { kind: 'command', text: 'git init -b main' },
      story:
        'Alice initializes a local repository and chooses `main` as its initial branch. Bob asks, “So our note is saved in Git now?” Alice explains that `git init` sets up the repository. Staging and committing the file are separate actions.',
      idea: '`HEAD` refers to `main`, which has no commit yet. Initializing a repository does not automatically track files.',
      change:
        'Git is initialized. `HEAD` points to `main`. `notes.txt` is untracked, the staging area is empty, and there are no commits.',
      transition: { kind: 'initialize', before: folder, after: initialized },
    },
    {
      label: 'Inspect',
      title: 'Alice checks the repository.',
      action: { kind: 'command', text: 'git status' },
      story:
        'Alice checks `git status`. It reports no commits yet on `main`, and lists `notes.txt` as untracked. Bob notices the file is still right where it started. Reading status does not change the file, stage its contents, or create history.',
      idea: 'The working directory, staging area, and recorded history are different things. Our note exists only in the working directory.',
      change:
        '`git status` confirms that `HEAD` points to `main`. `notes.txt` is untracked, the staging area is empty, and there are no commits.',
      transition: { kind: 'inspect', before: initialized, after: initialized },
    },
  ],
})

export const lessons: readonly Lesson[] = Object.freeze([startRepository])
