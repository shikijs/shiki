# Shorthands

The easier way to get started with `shiki` is to use the provided shorthand functions. These will load the necessary themes and languages on demand, and automatically cache them in memory. Different from `createHighlighter` and `createHighlighterCore`, the operations are asynchronous.

```ts twoslash
import { codeToHtml } from 'shiki'

const code = 'const a = 1' // input code
const html = await codeToHtml(code, {
  lang: 'javascript',
  theme: 'vitesse-dark'
})

console.log(html) // highlighted html string
```

## Create Shorthands with Fine-Grained Bundles

You can create your own shorthands with fine-grained bundles. Here is an example of creating shorthands with fine-grained bundles:

```ts
import { createdBundledHighlighter, createSingletonShorthands } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

const BundledLanguage = {
  typescript: () => import('@shikijs/langs/typescript'),
  javascript: () => import('@shikijs/langs/javascript'),
  vue: () => import('@shikijs/langs/vue'),
}

const BundledTheme = {
  'light-plus': () => import('@shikijs/themes/light-plus'),
  'dark-plus': () => import('@shikijs/themes/dark-plus'),
}

// This creates your custom 'createHighlighter' function with fine-grained bundles
export const createHighlighter = /* @__PURE__ */ createdBundledHighlighter<
  BundledLanguage,
  BundledTheme
>({
  langs: bundledLanguages,
  themes: bundledThemes,
  engine: () => createJavaScriptRegexEngine(),
})

// This creates the shorthands for you
export const {
  codeToHtml,
  codeToHast,
  codeToTokensBase,
  codeToTokens,
  codeToTokensWithThemes,
  getSingletonHighlighter,
  getLastGrammarState,
} = /* @__PURE__ */ createSingletonShorthands(
  createHighlighter,
)
```

You can also use [`shiki-codegen`](/packages/codegen) to generate the fine-grained bundles for you.
