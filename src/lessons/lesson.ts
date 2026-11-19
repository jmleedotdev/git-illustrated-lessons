export interface RepositoryState {
  readonly initialized: boolean
  readonly head: string | null
  readonly working: readonly Readonly<{
    name: string
    contents: string
    status: 'existing' | 'untracked'
  }>[]
  readonly staged: readonly string[]
  readonly commits: readonly string[]
}

export interface LessonStep {
  readonly label: string
  readonly title: string
  /** Backticks mark inline code; always rendered as text, never HTML. */
  readonly story: string
  readonly action: Readonly<{ kind: 'editor' | 'command'; text: string }>
  readonly idea: string
  readonly change: string
  readonly transition: Readonly<{
    kind: 'open-folder' | 'initialize' | 'inspect'
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
  readonly steps: readonly LessonStep[]
}
