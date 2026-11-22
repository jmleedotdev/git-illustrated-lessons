<script setup lang="ts">
import FoldedPage from '@/components/scenes/FoldedPage.vue'

const palette = [
  { name: 'Paper', token: 'paper', class: 'bg-paper' },
  { name: 'Sheet', token: 'sheet', class: 'bg-sheet' },
  { name: 'Panel', token: 'panel', class: 'bg-panel' },
  { name: 'Ink', token: 'ink', class: 'bg-ink' },
  { name: 'Git orange', token: 'git', class: 'bg-git' },
  { name: 'Charcoal', token: 'charcoal', class: 'bg-charcoal' },
  { name: 'Peach', token: 'peach', class: 'bg-peach' },
  { name: 'Slate', token: 'slate', class: 'bg-slate' },
  { name: 'Terracotta', token: 'terracotta', class: 'bg-terracotta' },
]
const spaces = [
  { name: '1 / 4px', class: 'w-1' },
  { name: '2 / 8px', class: 'w-2' },
  { name: '3 / 12px', class: 'w-3' },
  { name: 'inset / 16px', class: 'w-inset' },
  { name: 'layout / 24px', class: 'w-layout' },
  { name: 'section / 32px', class: 'w-section' },
]
</script>

<template>
  <div class="mx-auto max-w-7xl px-inset pb-section">
    <header class="flex flex-wrap items-center justify-between gap-3 border-b border-rule py-inset">
      <span class="text-story font-bold">Git / visual notes</span>
      <span class="text-label text-muted">Development only · foundations</span>
    </header>

    <main class="space-y-section pt-section">
      <div class="space-y-3">
        <p class="eyebrow">Shared design tokens / revised A</p>
        <h1>Paper, ink &amp; Git.</h1>
        <p class="max-w-3xl text-story">
          Warm paper, drawn outlines, and a little Git orange. These samples use the application’s
          stylesheet—not a separate preview theme. No lessons or player are implemented here.
        </p>
      </div>

      <section aria-labelledby="palette-heading" class="space-y-inset">
        <h2 id="palette-heading">01 / Palette</h2>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-9">
          <figure v-for="color in palette" :key="color.token" class="min-w-0">
            <div :class="[color.class, 'h-16 rounded-control border-2 border-outline']"></div>
            <figcaption class="mt-2 text-label">
              <b class="block">{{ color.name }}</b>
              <span class="text-muted">{{ color.token }}</span>
            </figcaption>
          </figure>
        </div>
        <p class="text-label text-muted">
          Ink for text; orange for emphasis, not small text on paper. Diagram colors always carry
          ink outlines and labels.
        </p>
      </section>

      <div class="grid items-start gap-layout lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section aria-labelledby="illustration-heading" class="paper-sheet space-y-inset">
          <p class="eyebrow">02 / Illustration vocabulary</p>
          <h2 id="illustration-heading">Flat color. Drawn character.</h2>
          <svg
            role="img"
            aria-labelledby="illustration-title illustration-description"
            viewBox="0 0 480 300"
            class="ink-illustration"
          >
            <title id="illustration-title">Paper and ink illustration sample</title>
            <desc id="illustration-description">
              A folded document represents an individual file. The commit sphere uses the approved
              prototype’s clipped side shading, cream highlight, bold outline, and small ground
              shadow. These are styling samples, not a lesson state.
            </desc>
            <FoldedPage />
            <defs>
              <clipPath id="showcase-commit-clip"><circle r="42" /></clipPath>
            </defs>
            <!-- Preserve final revised A geometry from HistoryPrototype.vue, not a redrawing. -->
            <g transform="translate(345 160) scale(1.35)">
              <ellipse cx="5" cy="49" rx="31" ry="6" class="fill-ground-shadow" />
              <circle r="42" class="fill-commit-current" />
              <path
                d="M20-45C36-12 20 26-29 40L-29 60H60V-45Z"
                clip-path="url(#showcase-commit-clip)"
                class="fill-commit-current-shade"
              />
              <circle r="42" fill="none" class="stroke-charcoal" stroke-width="3" />
              <path
                d="M-28-12Q-25-27-11-30"
                fill="none"
                class="stroke-commit-highlight"
                stroke-width="5"
                stroke-linecap="round"
              />
              <text y="8" text-anchor="middle" class="fill-charcoal font-bold" font-size="22">
                c1
              </text>
              <text y="80" text-anchor="middle" class="fill-charcoal" font-size="17">
                notes.txt
              </text>
            </g>
          </svg>
          <p class="text-story">
            Folded pages represent individual files; comic spheres represent recorded commits. The
            sphere preserves the approved prototype’s shape, shading, and highlight.
          </p>
          <div class="flex flex-wrap gap-inset">
            <span class="rounded-control border border-outline bg-panel p-3">1px outline</span>
            <span class="rounded-control border-2 border-outline bg-panel p-3 shadow-offset"
              >2px + offset</span
            >
          </div>
        </section>

        <section aria-labelledby="type-heading" class="paper-sheet space-y-inset">
          <p class="eyebrow">03 / Type &amp; explanation</p>
          <h2 id="type-heading">A technical notebook.</h2>
          <p class="text-title font-bold tracking-tight">Title / 30px</p>
          <p class="text-heading font-bold">Heading / 24px</p>
          <p class="story-text">
            Story / 16px. Alice opens <code>notes.txt</code> while Bob looks on. Comfortable line
            spacing leaves room for a short explanation, even on a narrow screen.
          </p>
          <p class="text-label text-muted">Label / 14px · JetBrains Mono · regular &amp; bold</p>
          <div class="space-y-2">
            <h3>Command block</h3>
            <pre
              class="command-block"
              aria-label="Command example"
            ><code>git init -b main</code></pre>
          </div>
          <aside class="key-idea" aria-labelledby="key-idea">
            <h3 id="key-idea">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                class="shrink-0"
              >
                <path d="M9 18h6M10 21h4M9 15c0-2-3-3-3-7a6 6 0 0 1 12 0c0 4-3 5-3 7v1H9z" />
              </svg>
              Key idea
            </h3>
            <p class="text-story">
              Inline references belong in prose. Standalone command blocks contain only commands.
            </p>
          </aside>
        </section>
      </div>

      <div class="grid gap-layout lg:grid-cols-2">
        <section aria-labelledby="controls-heading" class="paper-sheet space-y-inset">
          <h2 id="controls-heading">04 / Controls</h2>
          <p class="text-story">
            Hover the samples or press Tab to see the shared states. Every button is at least 44 ×
            44px.
          </p>
          <div class="flex flex-wrap gap-inset">
            <button type="button" class="control">Default</button>
            <button type="button" class="control control-primary">Hover me</button>
            <button type="button" class="control">Focus me</button>
            <button type="button" class="control" disabled>Disabled</button>
          </div>
          <p class="text-label text-muted">
            Focus: 3px terracotta outline with a 4px gap. Disabled: slate fill, no shadow.
          </p>
        </section>

        <section aria-labelledby="spacing-heading" class="paper-sheet space-y-inset">
          <h2 id="spacing-heading">05 / Spacing</h2>
          <ul class="space-y-2">
            <li
              v-for="space in spaces"
              :key="space.name"
              class="flex items-center gap-inset text-label"
            >
              <span class="w-40 shrink-0">{{ space.name }}</span>
              <span :class="[space.class, 'h-3 shrink-0 bg-git']" aria-hidden="true"></span>
            </li>
          </ul>
        </section>
      </div>
      <p class="border-t border-rule pt-inset text-label text-muted">
        Shared foundations ship with the app; this page does not.
      </p>
    </main>
  </div>
</template>
