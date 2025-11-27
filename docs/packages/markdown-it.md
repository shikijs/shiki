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
// @twoslash-cache: {"v":1,"hash":"da29e172d7cec4c12a3722eda8a864c17b5def349eeb2dbc85a81a10c6a7bc7d","data":"N4Igdg9gJgpgziAXAbVAFwJ4AcZJACwgDcYAnEAGhDRgA808AKAQwBsBLZuASgAIAzAK5gAxmnYQwvAMr52Aa3aMIWcZLiJeAWWal5UCAHcwASTSyF7APKqJYHpoAKpCAFt2cGAB5Gr3fqMwdjRNHT0DYzM+AF4APl4iCHYoWIAdINcsCFI0GTlFShA4NF0GRAB2KlYYMABzNHwkAFYqEtJamDKQCwKq9jBcRAAGKhF8XWYxMiRygF8KdGxBgmJp1roulg4uPhF1XLCAyJDtfwjTNABhfdJBMWz09kzsg7PAs0Li0qQAFgAOKo1eqNRAARhG1F0HS6h3OHz6AyQoNG41Ikxo5Aq80WODwhBI5HW9Dwe3suVcUFCb2OnzaZT+AJA1TqDSQACZWlDOngKYUOIjEABmFETKaYgBs2OoSzxq0J1A2TDYnB4p3C7zQjCwpHgnQAcsxXDAAPyaYqkfq1XgAHzVRwuNjU9govBUTrgprtcLQjrsDi9GsezxyAZpVC+OSQAE5hUygaywRC2tC8LCNXz+oNY2NRRikaCpZhcYgVgTCjRiSXScVeBSqeqw0U6UihpU4yyQRzIe1uSXeQjBi0QDm0WKkENCzKS/i1grKyAtS4cDkMHw08cAHSCTyaLWsQS1fr1+1mRz7w9gF0b69YCauDS8YTySDGZAAXRi8XXF1p3zB4MBDskFjZNexAbdcAHZoRVHPMhUnYtS1nCtNmVHY8ksZRbHUY9vR6axsPsbgnBcdxPB8PwGyCE5vyiXg4gSJIUiDLIQ3w39IzBNkIWZYFoO7FMS3YqDECHEd0WmMFBQQ5YZ3lFCmG1FQyEwPhrlgX11C0QRWHELBqgAFXwGAjTgLwACFhCgaooCMkyYFiDcGnsh9HFKThWC8AAlGA9lIKAvHNS0XTso0fMPc1mCdABBMAMBtGQ0AtOoABlgjINgAFUgkkCyrJs0KYBdIK6liMrCgMEQEBLaLa2YLBXX4Xg9lYbJeDAQ14F4NAIG64zTI3dIjI8Xg2Faww4F4DAIEEbrergHARHYfh4tcHS9OqPqXIENrnN4DoBjRGgoGa6AYEGsB0gAAxutA4HSORanwDgnoxDc9lgAyIAACTQVxWEYD6it4YB0l4XhWGYOpNAAcgAKzgGGKDBrbTM0UGpHBiH2Fe2GiHSuBPAAWhe/A0CRlHwagfw8YJ4nqb0CnMdmdJZm4a6bvSdIAHV2FYVh9pqDKaEQLmwBuq6yf+9JAtvKRigwapolSYcIFa0hEAAYlBHWAG4iaJuB8nYImGfkLX+Et3WVdiIGvAAegWqG0nFm7y2YWpquQZAihgSCCDQNAsA0e37cPBpBAAI3etxHeNhG48sTXSbQM3TcENgiec0yQDfN9w2bKSePjEFxU5Hsumz+AMwFMvh1RCTMTZGTZTLIlNiU5dVOx3HeBV/GaEJmASZxsmVY4spQR+H5AL40Ty8EplR4YES23EsdEB+FvpzlctFRLRdlJXPgzc0fu6eHs3x4Lv9QXKLteITGeBLAs2a8GRl17grf89V2A8CeKxXI+EBCkV4DDAAAkbSwCdKL2iJsEGGLEXihguKAtw4C4HnAQWgLOiMxbVnJCdaIqCzCMHZpdMAFItyeBYIYZgwQMKKEYBjcGVcHysKxinWmg9iYpyZljXgp9wED3gPTfwAjeAszAGzbghQjQlCQKADYNQ4B2DwHdEAsxZhAA==="}
import Shiki from '@shikijs/markdown-it'
import MarkdownIt from 'markdown-it-ts'

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
// @twoslash-cache: {"v":1,"hash":"6ff145cb63dd6b3d186553123c0f198227db271b2208fec73e29032b5e7f6c17","data":"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"}
// @noErrors: true
import { fromHighlighter } from '@shikijs/markdown-it/core'
import MarkdownIt from 'markdown-it-ts'
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
// @twoslash-cache: {"v":1,"hash":"c6a15ff8efeb2ef9967f069b8e240708777731f92fab17121276bea3f426790d","data":"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"}
import { fromAsyncCodeToHtml } from '@shikijs/markdown-it/async'
import MarkdownIt from 'markdown-it-ts'
import { codeToHtml } from 'shiki' // Or your custom shorthand bundle

// Initialize MarkdownIt instance with markdown-it-ts
const md = MarkdownIt()

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
