# Monaco Editor Integration

Shiki uses the same TextMate grammar and themes as VS Code, so it can be used to highlight Monaco Editor. Shiki provides an official integration for Monaco Editor. You can also use [modern-monaco](https://github.com/esm-dev/modern-monaco) that includes built-in Shiki integration.

## @shikijs/monaco

<Badges name="@shikijs/monaco" />

Use Shiki to highlight [Monaco Editor](https://microsoft.github.io/monaco-editor/).

Monaco's built-in highlighter does not use the full TextMate grammar, which in some cases is not accurate enough. This package allows you to use Shiki's syntax highlighting engine to highlight Monaco, with shared grammars and themes from Shiki.

Heavily inspired by [`monaco-editor-textmate`](https://github.com/zikaari/monaco-editor-textmate).

### Install

::: code-group

```sh [npm]
npm i -D @shikijs/monaco
```

```sh [yarn]
yarn add -D @shikijs/monaco
```

```sh [pnpm]
pnpm add -D @shikijs/monaco
```

```sh [bun]
bun add -D @shikijs/monaco
```

```sh [deno]
deno add npm:@shikijs/monaco
```

:::

### Usage

```ts
import { shikiToMonaco } from '@shikijs/monaco'
import * as monaco from 'monaco-editor-core'
import { createHighlighter } from 'shiki'

// Create the highlighter, it can be reused
const highlighter = await createHighlighter({
  themes: [
    'vitesse-dark',
    'vitesse-light',
  ],
  langs: [
    'javascript',
    'typescript',
    'vue'
  ],
})

// Register the languageIds first. Only registered languages will be highlighted.
monaco.languages.register({ id: 'vue' })
monaco.languages.register({ id: 'typescript' })
monaco.languages.register({ id: 'javascript' })

// Register the themes from Shiki, and provide syntax highlighting for Monaco. // [!code highlight:2]
shikiToMonaco(highlighter, monaco)

// Create the editor
const editor = monaco.editor.create(document.getElementById('container'), {
  value: 'const a = 1',
  language: 'javascript',
  theme: 'vitesse-dark',
})

// ...As you use the editor normally
```

## modern-monaco

<Badges name="modern-monaco" />

We highly recommend using [modern-monaco](https://github.com/esm-dev/modern-monaco?tab=readme-ov-file#modern-monaco) that includes built-in Shiki integration. It provides a more convenient API for building Monaco Editor.

### Install

::: code-group

```sh [npm]
npm i -D modern-monaco
```

```sh [yarn]
yarn add -D modern-monaco
```

```sh [pnpm]
pnpm add -D modern-monaco
```

```sh [bun]
bun add -D modern-monaco
```

```sh [deno]
deno add npm:modern-monaco
```

:::

Or import it from [esm.sh](https://esm.sh) CDN in the browser without a build step:

```js
import * as monaco from 'https://esm.sh/modern-monaco'
```

### Usage

```html
<!-- index.html -->
<monaco-editor theme="vitesse-dark"></monaco-editor>
<script src="app.js" type="module"></script>
```

```js
// app.js
import { lazy, Workspace } from 'modern-monaco'

// create a workspace with initial files
const workspace = new Workspace({
  initialFiles: {
    'index.html': `<html><body>...</body></html>`,
    'main.js': `console.log('Hello, world!')`,
  },
  entryFile: 'index.html',
})

// initialize the editor lazily
await lazy({ workspace })

// write a file and open it in the editor
workspace.fs.writeFile('util.js', 'export function add(a, b) { return a + b; }')
workspace.openTextDocument('util.js')
```

More usage please see the [modern-monaco](https://github.com/esm-dev/modern-monaco) repository.
