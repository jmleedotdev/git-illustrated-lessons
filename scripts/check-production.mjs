import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Inspect the shipped artifact, not source organization or implementation details.
const files = await readdir('dist', { recursive: true })
const textFiles = files.filter((file) => /\.(?:html|js|css|json|map)$/.test(file))
for (const file of files) {
  assert.doesNotMatch(file, /showcase|__design|(?:^|\/)dev\//i, `Development file shipped: ${file}`)
}
for (const file of textFiles) {
  const content = await readFile(join('dist', file), 'utf8')
  assert.doesNotMatch(
    content,
    /DesignShowcase|\/__design|Paper, ink &|Visual approval pending|Illustration vocabulary/,
    `Showcase content shipped in ${file}`,
  )
}

const cssFiles = textFiles.filter((file) => file.endsWith('.css'))
assert.ok(cssFiles.length, 'Production must ship a stylesheet')
const css = (await Promise.all(cssFiles.map((file) => readFile(join('dist', file), 'utf8')))).join(
  '\n',
)
assert.match(css, /--color-paper\s*:/, 'Shared paper token missing')
assert.match(css, /--color-git\s*:/, 'Shared Git accent missing')
assert.match(css, /\.command-block\s*\{/, 'Shared command treatment missing')
assert.match(css, /@font-face/, 'Self-hosted font declarations missing')
assert.doesNotMatch(
  css,
  /(?:url\(\s*["']?|@import\s*["'])(?:https?:)?\/\//,
  'Styles must not depend on an external font or CDN',
)
for (const weight of ['Regular', 'Bold']) {
  const font = files.find(
    (file) => file.includes(`JetBrainsMono-${weight}`) && file.endsWith('.woff2'),
  )
  assert.ok(font, `Self-hosted ${weight} font missing`)
  assert.equal((await readFile(join('dist', font))).subarray(0, 4).toString(), 'wOF2')
  assert.ok(css.includes(font.split('/').at(-1)), `Styles must reference the ${weight} font`)
}
const license = await readFile('dist/fonts/OFL.txt', 'utf8')
assert.match(license, /SIL OPEN FONT LICENSE Version 1\.1/)
assert.match(license, /Copyright 2020 The JetBrains Mono Project Authors/)
console.log(
  'Production boundary passed: no showcase; shared styles, local fonts, and license retained.',
)
