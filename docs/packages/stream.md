---
outline: deep
---

# @shikijs/stream

<Badges name="@shikijs/stream" />

Streaming colorization for Shiki. Useful for highlighting text streams like LLM outputs, where code arrives incrementally and you want each chunk highlighted as it lands without re-tokenizing the whole document.

## Install

::: code-group

```sh [npm]
npm i -D @shikijs/stream
```

```sh [yarn]
yarn add -D @shikijs/stream
```

```sh [pnpm]
pnpm add -D @shikijs/stream
```

```sh [bun]
bun add -D @shikijs/stream
```

```sh [deno]
deno add npm:@shikijs/stream
```

:::

## Usage

Create a transform stream with `CodeToTokenTransformStream` and `.pipeThrough` your text stream:

```ts
import { CodeToTokenTransformStream } from '@shikijs/stream'
import { createHighlighter, createJavaScriptRegexEngine } from 'shiki'

// Initialize the Shiki highlighter somewhere in your app
const highlighter = await createHighlighter({
  langs: [/* ... */],
  themes: [/* ... */],
  engine: createJavaScriptRegexEngine(),
})

// The ReadableStream<string> you want to highlight
const textStream = getTextStreamFromSomewhere()

// Pipe the text stream through the token stream
const tokensStream = textStream
  .pipeThrough(new CodeToTokenTransformStream({
    highlighter,
    lang: 'javascript',
    theme: 'nord',
    allowRecalls: true, // see explanation below
  }))
```

### `allowRecalls`

Due to the fact that highlighting may change based on the context of the code, themed tokens can be re-evaluated as the stream progresses. Because streams are one-directional, `@shikijs/stream` emits a special **recall** token that tells the receiver to discard the last N tokens that changed.

By default, `CodeToTokenTransformStream` only emits **stable** tokens — no recalls. The trade-off is coarser granularity, usually one line at a time.

For stream consumers that can handle recalls (e.g. the bundled Vue, React, and Solid components), set `allowRecalls: true` to get finer-grained tokens.

Typically recalls should be handled like:

```ts
import type { RecallToken } from '@shikijs/stream'
import type { ThemedToken } from 'shiki'

const receivedTokens: ThemedToken[] = []

tokensStream.pipeTo(new WritableStream<ThemedToken | RecallToken>({
  async write(token) {
    if ('recall' in token) {
      // discard the last `token.recall` tokens
      receivedTokens.length -= token.recall
    }
    else {
      receivedTokens.push(token)
    }
  },
}))
```

## Consume the Token Stream

### Manually

```ts
tokensStream.pipeTo(new WritableStream({
  async write(token) {
    console.log(token)
  },
}))
```

Or in Node.js:

```ts
for await (const token of tokensStream) {
  console.log(token)
}
```

### Vue

```vue
<script setup lang="ts">
import { ShikiStreamRenderer } from '@shikijs/stream/vue'

// get the token stream
</script>

<template>
  <ShikiStreamRenderer :stream="tokensStream" />
</template>
```

### React

```tsx
import { ShikiStreamRenderer } from '@shikijs/stream/react'

export function MyComponent() {
  // get the token stream
  return <ShikiStreamRenderer stream={tokensStream} />
}
```

### Solid

```tsx
import { ShikiStreamRenderer } from '@shikijs/stream/solid'

export function MyComponent() {
  // get the token stream
  return <ShikiStreamRenderer stream={tokensStream} />
}
```

## Cached Renderer

`@shikijs/stream` also ships a simplified renderer for the common case of an incrementally-updated code string (rather than a token stream).

::: warning Experimental
This API is experimental and may change.
:::

### Vue

```vue
<script setup lang="ts">
import { ShikiCachedRenderer } from '@shikijs/stream/vue'
import { createHighlighter, createJavaScriptRegexEngine } from 'shiki'
import { onMounted, ref } from 'vue'

const highlighter = await createHighlighter({
  langs: [/* ... */],
  themes: [/* ... */],
  engine: createJavaScriptRegexEngine(),
})

const code = ref('') // code should only be updated incrementally

// for demo purposes
onMounted(() => {
  setInterval(() => {
    code.value += '\nconsole.log("Hello, world!");'
  }, 1000)
})
</script>

<template>
  <ShikiCachedRenderer
    :highlighter="highlighter"
    :code="code"
    lang="js"
    theme="vitesse-light"
  />
</template>
```
