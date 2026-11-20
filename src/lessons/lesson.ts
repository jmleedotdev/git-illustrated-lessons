export interface FileContents {
  readonly name: string
  readonly contents: string
  readonly version?: string
}

export interface Commit {
  readonly id: string
  readonly parents: readonly string[]
  readonly snapshot: readonly FileContents[]
}

interface HostedRepository {
  readonly owner: string
  readonly name: string
  readonly branches: Readonly<Record<string, string>>
  readonly commits: readonly Commit[]
  readonly files: readonly FileContents[]
}

export interface RemoteSetup {
  readonly hosted: HostedRepository | null
  readonly origin: string | null
  readonly upstream: string | null
}

export interface RepositoryState {
  readonly initialized: boolean
  readonly head: string | null
  readonly working: readonly (FileContents & {
    readonly status: 'existing' | 'untracked' | 'tracked'
  })[]
  readonly staged: readonly FileContents[]
  /** Named references with recorded tips. An unborn branch has no entry. */
  readonly branches?: Readonly<Record<string, string>>
  readonly commits: readonly Commit[]
  readonly remoteSetup?: RemoteSetup
}

export function checkoutTip(state: RepositoryState) {
  return state.head ? state.branches?.[state.head] : undefined
}

export interface LessonStep {
  readonly label: string
  readonly title: string
  /** Backticks mark inline code; always rendered as text, never HTML. */
  readonly story: string
  readonly action?: Readonly<{ kind: 'editor' | 'command' | 'github'; text: string }>
  readonly idea: string
  readonly change: string
  readonly diagram?: string
  readonly transition: Readonly<{
    kind:
      | 'open-folder'
      | 'initialize'
      | 'inspect'
      | 'edit'
      | 'status'
      | 'stage'
      | 'commit'
      | 'log'
      | 'create-branch'
      | 'switch-branch'
      | 'merge'
      | 'inspect-remote'
      | 'create-remote'
      | 'add-origin'
    before: RepositoryState
    after: RepositoryState
  }>
}

export interface Lesson {
  readonly slug: string
  readonly title: string
  readonly duration: string
  readonly difficulty: string
  readonly topic: string
  readonly mentalModel: readonly string[]
  readonly steps: readonly LessonStep[]
}

export function freezeLesson(lesson: Lesson): Lesson {
  function freeze(value: unknown) {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze)
      Object.freeze(value)
    }
  }
  freeze(lesson)
  return lesson
}
