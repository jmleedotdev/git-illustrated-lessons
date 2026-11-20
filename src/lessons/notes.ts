export const originalNote = Object.freeze({ name: 'notes.txt', contents: 'A little less magic.\n' })

export const editedNote = Object.freeze({
  ...originalNote,
  contents: originalNote.contents + 'Git keeps a history.\n',
  version: 'B',
})

export const newerNote = Object.freeze({
  ...editedNote,
  contents: editedNote.contents + 'Only selected contents go in.\n',
  version: 'C',
})

export const revisedNote = Object.freeze({
  ...newerNote,
  version: 'D',
  contents: 'A little less magic.\nGit keeps a history.\nOnly staged contents go into a commit.\n',
})

export const ideaFile = Object.freeze({
  name: 'ideas.txt',
  contents: 'Draw the history as a map.\n',
})
