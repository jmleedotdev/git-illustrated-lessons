export interface FileContents {
  readonly name: string
  readonly contents: string
  readonly version?: string
}

export interface RepositoryState {
  readonly initialized: boolean
  readonly head: string | null
  readonly working: readonly (FileContents & {
    readonly status: 'existing' | 'untracked' | 'tracked'
  })[]
  readonly staged: readonly FileContents[]
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
    kind: 'open-folder' | 'initialize' | 'inspect' | 'edit' | 'status' | 'stage'
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
