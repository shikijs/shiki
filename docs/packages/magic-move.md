---
outline: deep
---

# @shikijs/magic-move

<Badges name="@shikijs/magic-move" />

Smoothly animated code blocks with Shiki. Useful for code-step animations in slide decks (e.g. [Slidev](https://sli.dev/guide/syntax#shiki-magic-move)) and tutorials.

`@shikijs/magic-move` is a low-level library: at its core is a framework-agnostic [diff/animation machine](https://github.com/shikijs/shiki/blob/main/packages/magic-move/src/core.ts) and [renderer](https://github.com/shikijs/shiki/blob/main/packages/magic-move/src/renderer.ts), with thin wrappers for Vue, React, Solid, Svelte, and a Web Component.

Each framework wrapper provides three components:

- **`ShikiMagicMove`** — the main component; wraps a code block and animates whenever `code` changes
- **`ShikiMagicMovePrecompiled`** — animations for compiled tokens, without the Shiki dependency at runtime
- **`ShikiMagicMoveRenderer`** — the low-level renderer component

`ShikiMagicMove` needs a Shiki highlighter instance plus the bundled stylesheet (`@shikijs/magic-move/style.css`). Whenever `code` changes, the component animates the diff.

## Install

::: code-group

```sh [npm]
npm i -D @shikijs/magic-move shiki
```

```sh [yarn]
yarn add -D @shikijs/magic-move shiki
```

```sh [pnpm]
pnpm add -D @shikijs/magic-move shiki
```

```sh [bun]
bun add -D @shikijs/magic-move shiki
```

```sh [deno]
deno add npm:@shikijs/magic-move npm:shiki
```

:::

## Usage

### Vue

Import `@shikijs/magic-move/vue` and pass the highlighter instance to the `ShikiMagicMove` component.

```vue
<script setup>
import { ShikiMagicMove } from '@shikijs/magic-move/vue'
import { createHighlighter } from 'shiki'
import { ref } from 'vue'

import '@shikijs/magic-move/style.css'

const highlighter = await createHighlighter({
  themes: ['nord'],
  langs: ['javascript', 'typescript'],
})

const code = ref(`const hello = 'world'`)

function animate() {
  code.value = `let hi = 'hello'`
}
</script>

<template>
  <ShikiMagicMove
    lang="ts"
    theme="nord"
    :highlighter="highlighter"
    :code="code"
    :options="{ duration: 800, stagger: 0.3, lineNumbers: true }"
  />
  <button @click="animate">
    Animate
  </button>
</template>
```

### React

Import `@shikijs/magic-move/react` and pass the highlighter instance to the `ShikiMagicMove` component.

```tsx
import type { HighlighterCore } from 'shiki'
import { ShikiMagicMove } from '@shikijs/magic-move/react'
import { useEffect, useState } from 'react'
import { createHighlighter } from 'shiki'

import '@shikijs/magic-move/style.css'

function App() {
  const [code, setCode] = useState(`const hello = 'world'`)
  const [highlighter, setHighlighter] = useState<HighlighterCore>()

  useEffect(() => {
    async function initializeHighlighter() {
      const h = await createHighlighter({
        themes: ['nord'],
        langs: ['javascript', 'typescript'],
      })
      setHighlighter(h)
    }
    initializeHighlighter()
  }, [])

  function animate() {
    setCode(`let hi = 'hello'`)
  }

  return (
    <div>
      {highlighter && (
        <>
          <ShikiMagicMove
            lang="ts"
            theme="nord"
            highlighter={highlighter}
            code={code}
            options={{ duration: 800, stagger: 0.3, lineNumbers: true }}
          />
          <button onClick={animate}>Animate</button>
        </>
      )}
    </div>
  )
}
```

### Solid

Import `@shikijs/magic-move/solid` and pass the highlighter instance to the `ShikiMagicMove` component.

```tsx
import { ShikiMagicMove } from '@shikijs/magic-move/solid'
import { bundledLanguages, bundledThemes, createHighlighter } from 'shiki'
import { createResource, createSignal, Show } from 'solid-js'

import '@shikijs/magic-move/style.css'

function App() {
  const [code, setCode] = createSignal(`const hello = 'world'`)

  const [highlighter] = createResource(async () => {
    return await createHighlighter({
      themes: Object.keys(bundledThemes),
      langs: Object.keys(bundledLanguages),
    })
  })

  function animate() {
    setCode(`let hi = 'hello'`)
  }

  return (
    <div>
      <Show when={highlighter()}>
        {h => (
          <>
            <ShikiMagicMove
              lang="ts"
              theme="nord"
              highlighter={h()}
              code={code()}
              options={{ duration: 800, stagger: 0.3, lineNumbers: true }}
            />
            <button onClick={animate}>Animate</button>
          </>
        )}
      </Show>
    </div>
  )
}
```

### Svelte

Import `@shikijs/magic-move/svelte` and pass the highlighter instance to the `ShikiMagicMove` component.

```svelte
<script lang="ts">
  import { ShikiMagicMove } from '@shikijs/magic-move/svelte'
  import { createHighlighter } from 'shiki'

  import '@shikijs/magic-move/style.css'

  const highlighter = createHighlighter({
    themes: ['nord'],
    langs: ['javascript', 'typescript'],
  })

  let code = $state(`const hello = 'world'`)

  function animate() {
    code = `let hi = 'hello'`
  }
</script>

{#await highlighter then highlighter}
  <ShikiMagicMove
    lang="ts"
    theme="nord"
    {highlighter}
    {code}
    options={{ duration: 800, stagger: 0.3, lineNumbers: true }}
  />
  <button onclick={animate}>Animate</button>
{/await}
```

## `ShikiMagicMovePrecompiled`

`ShikiMagicMovePrecompiled` is a lighter variant of `ShikiMagicMove` that doesn't need Shiki at runtime — useful when you want to ship pre-tokenized step data (e.g. produced at build time) and animate between steps in the browser.

```vue
<script setup>
import { ShikiMagicMovePrecompiled } from '@shikijs/magic-move/vue'
import { ref } from 'vue'

const step = ref(1)
const compiledSteps = [/* Compiled token steps */]
</script>

<template>
  <ShikiMagicMovePrecompiled
    :steps="compiledSteps"
    :step="step"
  />
  <button @click="step++">
    Next
  </button>
</template>
```

To produce the compiled tokens, run this somewhere with access to Shiki (build script, server, etc.) and serialize the result:

```ts
import { codeToKeyedTokens, createMagicMoveMachine } from '@shikijs/magic-move/core'
import { createHighlighter } from 'shiki'

const shiki = await createHighlighter({
  themes: ['nord'],
  langs: ['javascript', 'typescript'],
})

const codeSteps = [
  `const hello = 'world'`,
  `let hi = 'hello'`,
]

const machine = createMagicMoveMachine(
  code => codeToKeyedTokens(shiki, code, {
    lang: 'ts',
    theme: 'nord',
  }),
  {
    // options
  },
)

const compiledSteps = codeSteps.map(code => machine.commit(code).current)

// Pass `compiledSteps` to the precompiled component.
// Since these are plain serialisable objects, you can stringify them at build time
// and rehydrate them in the browser without needing Shiki.
```

## How it works

For a deep dive into the algorithm behind the animations, see Anthony's article [**The Magic In Shiki Magic Move**](https://antfu.me/posts/shiki-magic-move).
