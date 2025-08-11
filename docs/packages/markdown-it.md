# @shikijs/markdown-it

<Badges name="@shikijs/markdown-it" />

[markdown-it](https://markdown-it.github.io/) plugin for Shiki.

## Install

::: code-group

```sh [npm]
npm i -D @shikijs/markdown-it
```

```sh [yarn]
yarn add -D @shikijs/markdown-it
```

```sh [pnpm]
pnpm add -D @shikijs/markdown-it
```

```sh [bun]
bun add -D @shikijs/markdown-it
```

```sh [deno]
deno add npm:@shikijs/markdown-it
```

:::

## Usage

```ts twoslash
import Shiki from '@shikijs/markdown-it'
import MarkdownIt from 'markdown-it'

const md = MarkdownIt()

md.use(await Shiki({
  themes: {
    light: 'vitesse-light',
    dark: 'vitesse-dark',
  }
}))
```

## Fine-grained Bundle

By default, the full bundle of `shiki` will be imported. If you are using a [fine-grained bundle](/guide/bundles#fine-grained-bundle), you can import from `@shikijs/markdown-it/core` and pass your own highlighter:

```ts twoslash
// @noErrors: true
import { fromHighlighter } from '@shikijs/markdown-it/core'
import MarkdownIt from 'markdown-it'
import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

const highlighter = await createHighlighterCore({
  themes: [
    import('@shikijs/themes/vitesse-light')
  ],
  langs: [
    import('@shikijs/langs/javascript'),
  ],
  engine: createOnigurumaEngine(() => import('shiki/wasm'))
})

const md = MarkdownIt()

md.use(fromHighlighter(highlighter, { /* options */ }))
```

## With Shorthands

Shiki's [shorthands](/guide/shorthands) provides on-demand loading of themes and languages, but also makes the highlighting process asynchronous. Unfortunately, `markdown-it` itself [does NOT support async highlighting](https://github.com/markdown-it/markdown-it/blob/master/docs/development.md#i-need-async-rule-how-to-do-it) out of the box.

To workaround this, you can use [`markdown-it-async`](https://github.com/antfu/markdown-it-async) by [Anthony Fu](https://github.com/antfu). Where Shiki also provides an integration with it, you can import `fromAsyncCodeToHtml` from `@shikijs/markdown-it/async`.

````ts twoslash
import { fromAsyncCodeToHtml } from '@shikijs/markdown-it/async'
import MarkdownItAsync from 'markdown-it-async'
import { codeToHtml } from 'shiki' // Or your custom shorthand bundle

// Initialize MarkdownIt instance with markdown-it-async
const md = MarkdownItAsync()

md.use(
  fromAsyncCodeToHtml(
    // Pass the codeToHtml function
    codeToHtml,
    {
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      }
    }
  )
)

// Use `md.renderAsync` instead of `md.render`
const html = await md.renderAsync('# Title\n```ts\nconsole.log("Hello, World!")\n```')
````

## Transformer Caveats

`markdown-it` defaults to enforcing `<pre><code>` as the outermost wrappers of code block html. If you use a custom Shiki [transformer](/guide/transformers), this behavior may be undesirable. For example, if the transformer produces

```html
<div class="fenced-code-block">
  <pre>
    <code>
      …
    </code>
  </pre>
</div>
```

the result after `markdown-it` processing will be

```html
<pre>
  <code>
    <div class="fenced-code-block">
      <pre>
        <code>
          …
        </code>
      </pre>
    </div>
  </code>
</pre>
```

Work around this by adding [olets/markdown-it-wrapperless-fence-rule](https://github.com/olets/markdown-it-wrapperless-fence-rule) to your `markdown-it` configuration, or by writing your own `markdown-it` fence rule (see [markdown-it#269](https://github.com/markdown-it/markdown-it/issues/269)).
