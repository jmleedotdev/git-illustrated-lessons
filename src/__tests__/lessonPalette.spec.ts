// @vitest-environment node
import { spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, it } from 'vitest'

it('reports literal lesson colors at their source and accepts shared tokens', () => {
  const root = mkdtempSync(join(tmpdir(), 'lesson-palette-'))
  const checker = fileURLToPath(new URL('../../scripts/check-lesson-palette.mjs', import.meta.url))
  const runCheck = () => spawnSync(process.execPath, [checker], { cwd: root, encoding: 'utf8' })
  const writeSources = (color: string) => {
    writeFileSync(
      join(root, 'src/assets/css/main.css'),
      `@theme static { --color-git: #f05032; }
#bad { background: ${color}; }
`,
    )
    writeFileSync(
      join(root, 'src/Scene.vue'),
      `<template>
  <svg class="animate-[red]">
    <path :stroke="'${color}'" :style="{ fill: '${color}' }" />
  </svg>
</template>
<style scoped>
path { color: ${color}; }
</style>
`,
    )
    writeFileSync(
      join(root, 'public/scene.svg'),
      `<svg xmlns="http://www.w3.org/2000/svg">
  <path id="bad" fill="url(#bad) ${color}" />
</svg>
`,
    )
  }
  try {
    mkdirSync(join(root, 'src/assets/css'), { recursive: true })
    mkdirSync(join(root, 'public'))
    writeSources('#f05032')
    const failure = runCheck()
    expect(failure.status).toBe(1)
    expect(failure.stderr).toContain(
      'src/assets/css/main.css:2:20 Use a shared color token for #f05032',
    )
    expect(failure.stderr).toContain('src/Scene.vue:3:21 Use a shared color token for #f05032')
    expect(failure.stderr).toContain('src/Scene.vue:3:48 Use a shared color token for #f05032')
    expect(failure.stderr).toContain('src/Scene.vue:7:15 Use a shared color token for #f05032')
    expect(failure.stderr).toContain('public/scene.svg:2:34 Use a shared color token for #f05032')

    writeSources('var(--color-git)')
    const success = runCheck()
    expect(success.stderr).toBe('')
    expect(success.status).toBe(0)
  } finally {
    rmSync(root, { recursive: true })
  }
})
