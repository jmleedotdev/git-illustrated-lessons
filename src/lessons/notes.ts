export const originalNote = Object.freeze({ name: 'notes.txt', contents: 'A little less magic.\n' })

export const editedNote = Object.freeze({
  ...originalNote,
  contents: originalNote.contents + 'Git keeps a history.\n',
  version: 'B',
})
