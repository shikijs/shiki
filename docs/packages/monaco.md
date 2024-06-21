# @shikijs/monaco

<Badges name="@shikijs/monaco" />

Use Shiki to highlight [Monaco Editor](https://microsoft.github.io/monaco-editor/).

Monaco's built-in highlighter does not use the full TextMate grammar, which in some cases is not accurate enough. This package allows you to use Shiki's syntax highlighting engine to highlight Monaco, with shared grammars and themes from Shiki.

Heavily inspired by [`monaco-editor-textmate`](https://github.com/zikaari/monaco-editor-textmate).

## Install

```bash
npm i -D @shikijs/monaco
```

```ts
import { createHighlighter } from 'shiki'
import { shikiToMonaco } from '@shikijs/monaco'
import * as monaco from 'monaco-editor-core'

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
