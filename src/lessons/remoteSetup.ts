import { freezeLesson, type RemoteSetup, type RepositoryState } from './lesson'
import { editedNote, ideaFile, newerNote, revisedNote } from './notes'

// Authored from the post-merge snapshot contract, not from another lesson's playback.
const mergedFiles = [revisedNote, ideaFile] as const
const local: RepositoryState = {
  initialized: true,
  head: 'main',
  branches: { main: 'c5', ideas: 'c3' },
  working: mergedFiles.map((file) => ({ ...file, status: 'tracked' })),
  staged: mergedFiles,
  commits: [
    { id: 'c1', parents: [], snapshot: [editedNote] },
    { id: 'c2', parents: ['c1'], snapshot: [newerNote] },
    { id: 'c3', parents: ['c2'], snapshot: [newerNote, ideaFile] },
    { id: 'c4', parents: ['c2'], snapshot: [revisedNote] },
    { id: 'c5', parents: ['c4', 'c3'], snapshot: mergedFiles },
  ],
}
const beforeCreation: RepositoryState = {
  ...local,
  remoteSetup: { hosted: null, origin: null, upstream: null },
}
const emptyHosted = {
  owner: 'alice-example',
  name: 'git-notes',
  branches: {},
  commits: [],
  files: [],
}
const unconnected: RemoteSetup = { hosted: emptyHosted, origin: null, upstream: null }
const afterCreation: RepositoryState = { ...local, remoteSetup: unconnected }

const localDiagram =
  '`HEAD` points to the current branch, `main`, at `c5`; `ideas` points to `c3`. The arrows point to parents: `c5` has first parent `c4` and second parent `c3`; both point to `c2`, which points to `c1`. `c1` has no parent. The working directory and staging area match `c5`: revised `notes.txt` and `ideas.txt`.'
const beforeCreationDiagram = `${localDiagram} There is no hosted repository yet, no configured remote, and no upstream.`
const emptyDiagram = 'GitHub’s `git-notes` has no commits, files, or `main` reference.'
const emptyUnconnectedDiagram = `${localDiagram} ${emptyDiagram} There is no configured remote or upstream.`
const exampleAddress = `https://github.com/${emptyHosted.owner}/${emptyHosted.name}.git`
const connected: RepositoryState = {
  ...local,
  remoteSetup: { ...unconnected, origin: exampleAddress },
}

export const createRemoteRepository = freezeLesson({
  slug: 'create-a-remote-repository',
  title: 'Create a remote repository',
  duration: '~ 2 min',
  difficulty: 'Beginner',
  topic: 'GitHub',
  mentalModel: [
    'The local repository and the GitHub repository are separate places.',
    'Creating an empty repository does not send local history.',
  ],
  steps: [
    {
      label: 'Start local',
      title: 'Alice’s history is still local.',
      story:
        'Alice starts with a clean checkout of `main`. Bob can see the notes and ideas on her computer, but she hasn’t created a repository on GitHub yet.',
      idea: 'The files Alice sees and the history Git records are local to her computer.',
      change: 'Nothing changes. There is no GitHub repository yet, no `origin`, and no upstream.',
      diagram: beforeCreationDiagram,
      transition: { kind: 'inspect-remote', before: beforeCreation, after: beforeCreation },
    },
    {
      label: 'Create empty',
      title: 'Alice makes a place on GitHub.',
      action: {
        kind: 'github',
        text: 'Create `git-notes`. Leave README, `.gitignore`, and license initialization unselected.',
      },
      story:
        'Alice leaves all three starter options off so GitHub does not make a first commit of its own. Bob sees a new repository, but none of Alice’s history is there.',
      idea: 'Creating a place for the history does not publish it.',
      change: 'GitHub now has an empty `git-notes` repository. Local history is unchanged.',
      diagram: emptyUnconnectedDiagram,
      transition: { kind: 'create-remote', before: beforeCreation, after: afterCreation },
    },
  ],
})

export const connectLocalAndRemote = freezeLesson({
  slug: 'connect-local-and-remote',
  title: 'Connect local and remote',
  duration: '~ 2 min',
  difficulty: 'Beginner',
  topic: 'GitHub',
  mentalModel: [
    '`origin` is a conventional local name for a repository address.',
    'Adding a remote neither publishes commits nor sets an upstream for `main`.',
  ],
  steps: [
    {
      label: 'Two repositories',
      title: 'There’s a place for the history now.',
      story:
        'Bob can see `git-notes` on GitHub, but it has no files. Alice’s local Git repository does not yet know its address.',
      idea: 'The hosted repository can exist before Alice configures a local remote for it.',
      change: 'Nothing changes. GitHub is empty and Alice’s five commits remain local.',
      diagram: emptyUnconnectedDiagram,
      transition: { kind: 'inspect-remote', before: afterCreation, after: afterCreation },
    },
    {
      label: 'Add origin',
      title: 'An address is not a transfer.',
      action: { kind: 'command', text: `git remote add origin ${exampleAddress}` },
      story:
        'Alice calls this example GitHub HTTPS address `origin`. Bob checks GitHub: still empty. Git stored the address only on her computer.',
      idea: '`origin` is a conventional name, not a special GitHub service or automatic synchronization.',
      change: 'GitHub stays empty. No commits or files are sent, and `main` has no upstream.',
      diagram: `${localDiagram} A dashed line marks the address stored locally as \`origin\`, not a transfer. ${emptyDiagram} No upstream is configured.`,
      transition: { kind: 'add-origin', before: afterCreation, after: connected },
    },
  ],
})

const published: RepositoryState = {
  ...local,
  remoteSetup: {
    hosted: {
      ...emptyHosted,
      branches: { main: 'c5' },
      // Both ancestry paths from c5 are reachable, so all five authored commits are needed.
      commits: local.commits,
      files: mergedFiles,
    },
    origin: exampleAddress,
    upstream: 'origin/main',
  },
}

const originDiagram = 'The dashed `origin` connection marks the GitHub address stored locally.'
const publicationDiagram =
  'The push arrow points to GitHub, where `main` points to `c5` and all five commits, `c1` through `c5`, are present. There is no hosted `ideas` branch. Local `main` now has `origin/main` as its upstream.'
const publishedDiagram = `${localDiagram} ${originDiagram} ${publicationDiagram}`

export const pushTheWork = freezeLesson({
  slug: 'push-the-work',
  title: 'Push the work',
  duration: '~ 3 min',
  difficulty: 'Beginner',
  topic: 'GitHub',
  mentalModel: [
    'Push publishes committed history and updates a branch on the remote repository.',
    'The hosted files are a recorded snapshot, not a live view of Alice’s working directory.',
  ],
  steps: [
    {
      label: 'Ready to push',
      title: 'Git knows where to send the history.',
      story:
        'Alice’s working directory and staging area match the merge commit on `main`. Bob checks GitHub: `git-notes` is still empty, even though Alice has configured `origin`.',
      idea: 'Knowing the address is not the same as publishing history.',
      change: 'No history has been sent. GitHub is empty, and local `main` has no upstream.',
      diagram: `${localDiagram} ${originDiagram} ${emptyDiagram} No upstream is configured.`,
      transition: { kind: 'inspect-remote', before: connected, after: connected },
    },
    {
      label: 'Push main',
      title: 'Alice sends the history behind main.',
      action: { kind: 'command', text: 'git push -u origin main' },
      story:
        'Git sends the five commits reachable from `main`, including the work merged from `ideas`. GitHub’s `main` now points to `c5`, but Bob sees no separate `ideas` branch on GitHub. Alice keeps both branches locally.',
      idea: 'Push sends committed history, not uncommitted working-directory or staged contents.',
      change:
        'GitHub’s `main` points to `c5`. With `-u`, Git sets local `main`’s upstream to `origin/main`.',
      diagram: publishedDiagram,
      transition: { kind: 'push', before: connected, after: published },
    },
    {
      label: 'Inspect files',
      title: 'Bob looks at the recorded files.',
      story:
        'On GitHub, Bob sees `notes.txt` and `ideas.txt` as recorded in `c5`. That is the latest committed snapshot on hosted `main`, not Alice’s live working directory. If she edits or stages files later, those changes won’t show up on GitHub until she commits and pushes again.',
      idea: '`origin/main` is the default destination for later pushes from `main`, not automatic synchronization.',
      change: 'Nothing changes when Bob looks. GitHub still shows the files from `c5`.',
      diagram: publishedDiagram,
      transition: { kind: 'inspect-remote', before: published, after: published },
    },
  ],
})
