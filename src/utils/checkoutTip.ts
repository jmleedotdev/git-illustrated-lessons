import type { RepositoryState } from '@/types/lesson'

export function checkoutTip(state: RepositoryState) {
  return state.head ? state.branches?.[state.head] : undefined
}
