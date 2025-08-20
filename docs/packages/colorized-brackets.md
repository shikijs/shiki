---
outline: deep
---

# @shikijs/colorized-brackets

<Badges name="@shikijs/colorized-brackets" />

VSCode-style colorized brackets transformer for Shiki.

## Install

::: code-group

```sh [npm]
npm i -D @shikijs/colorized-brackets
```

```sh [yarn]
yarn add -D @shikijs/colorized-brackets
```

```sh [pnpm]
pnpm add -D @shikijs/colorized-brackets
```

```sh [bun]
bun add -D @shikijs/colorized-brackets
```

```sh [deno]
deno add npm:@shikijs/colorized-brackets
```

:::

## Usage

Add to your Shiki transformers:

```ts colorize-brackets
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets'
import { codeToHtml } from 'shiki'

const html = await codeToHtml('let values: number[] = [];', {
  lang: 'ts',
  theme: 'dark-plus',
  transformers: [transformerColorizedBrackets()],
})
```

### Colors

Brackets are automatically colored according to your Shiki theme (or themes if using [dual themes](https://shiki.style/guide/dual-themes)), with support for all of Shiki's built-in themes. However, you can customize colors if you've added custom themes to Shiki, or if you want to override the colors of a built-in theme:

```ts colorize-brackets
const html = await codeToHtml('let values: number[] = [];', {
  lang: 'ts',
  theme: myCustomTheme,
  transformers: [transformerColorizedBrackets({
    themes: {
      'my-custom-theme': ['goldenrod', 'blueviolet', 'dodgerblue', 'crimson'],
    },
  })],
})
```

The final color is the mismatched bracket color. The other colors are for each "level" of bracket pair. Any valid CSS color can be used.

If no bracket colors are found for a theme, it falls back to the default `dark-plus` theme.

### Brackets

You can customize the bracket pairs:

```ts colorize-brackets
const transformer = transformerColorizedBrackets({
  bracketPairs: [{ opener: '{', closer: '}' }],
})
```

The above would only colorize `{}` curly brackets. The default config colorizes `[]` square brackets, `{}` curly brackets, `()` parentheses, and `<>` angle brackets (only in TS type annotations).

For advanced usage, you can specify which TextMate scopes a bracket pair is allowed or denied in, using `scopesAllowList` and `scopesDenyList`. For example, the default config for `<>` angle brackets is:

```ts colorize-brackets
const bracketPair = {
  opener: '<',
  closer: '>',
  scopesAllowList: [
    'punctuation.definition.typeparameters.begin.ts',
    'punctuation.definition.typeparameters.end.ts',
  ],
}
```

### Language-specific Overrides

All settings can be overridden for specific languages using the `langs` option:

```ts colorize-brackets
const transformer = transformerColorizedBrackets({
  langs: { ts: myCustomTypescriptConfig },
})
```

### Explicit Trigger

If you do not want colorized brackets for all code blocks, you can enable the `explicitTrigger` option:

```ts colorize-brackets
const transformer = transformerColorizedBrackets({
  explicitTrigger: true,
})
```

Then, only code blocks with the `colorize-brackets` [meta string](/guide/transformers#meta) will have bracket colorizing enabled.

````md
```ts
// no bracket colorizing
```

```ts colorize-brackets
// brackets will be colorized
```
````
