export function describeParents(parents: readonly string[]) {
  if (parents.length === 0) return 'Root · no parent'
  if (parents.length === 1) return `Parent: ${parents[0]}`
  return parents.map((parent, index) => `Parent ${index + 1}: ${parent}`).join(' · ')
}
