# Theme Colors Manipulation

## Arbitrary Color Values

Usually, TextMate themes expect the color values of each token to be a valid hex color value. This limitation is inherited from [`vscode-textmate`](https://github.com/microsoft/vscode-textmate). However, in Shikiji v0.9.15 we introduced an automatic workaround by replacing non-hex color values with a placeholder and replacing them back on tokenization. This would allows you to use themes with arbitrary color values for rendering without worrying about the technical details:

```ts twoslash
import { getHighlighter } from 'shikiji'

const highlighter = await getHighlighter({
  langs: ['javascript'],
  themes: [
    {
      name: 'my-theme',
      settings: [
        {
          scope: ['comment'],
          settings: {
            // use `rgb`, `hsl`, `hsla`, // [!code hl:3]
            // or any anything supported by your renderer
            foreground: 'rgb(128, 128, 128)'
          }
        },
        {
          scope: ['string'],
          settings: {
            foreground: 'var(--code-string)' // CSS variable // [!code hl:1]
          }
        },
        // ...more
      ],
      // Background and foreground colors // [!code hl:3]
      bg: 'var(--code-bg)',
      fg: 'var(--code-fg)'
    }
  ]
})

const html = highlighter.codeToHtml('const foo = "bar"', { lang: 'javascript', theme: 'my-theme' })
```

::: info Notice
Use this carefully as this will diverge from TextMate theme compatibility.

This may make the theme incompatible with non-web usage such as [`shikiji-cli`](/packages/cli) and [`shikiji-monaco`](/packages/monaco).
:::

Learn more about how to [load themes](./load-theme).

## Color Replacements

You can also use the `colorReplacements` option to replace the color values of the theme. This is useful when you want to use a theme with a different color palette. It can be provided on both the theme object and the `codeToHast` `codeToHtml` options.

## CSS Variables Theme

::: warning Experimental
This feature is experimental and may change without following semver.
:::

Shikiji provides a factory function helper `createCssVariablesTheme` for creating a theme that uses CSS variables easier. Note that this theme is a lot less granular than most of the other themes and requires to define the CSS variables in your app. This is provided for easier migration from Shiki's [`css-variables theme`](https://github.com/shikijs/shiki/blob/main/docs/themes.md#theming-with-css-variables). For better highlighting result, we recommend construct the theme manually with [Arbitrary Color Values](#arbitrary-color-values) or use [Color Replacements](#color-replacements) to override an existing theme.

This theme is **not included by default** and must be registered explicitly:

```ts twoslash
import { createCssVariablesTheme, getHighlighter } from 'shikiji'

// Create a custom CSS variables theme, the following are the default values
const myTheme = createCssVariablesTheme({ // [!code hl:6]
  name: 'css-variables',
  variablePrefix: '--shiki-',
  variableDefaults: {},
  fontStyle: true
})

const highlighter = await getHighlighter({
  langs: ['javascript'],
  themes: [myTheme] // register the theme // [!code hl]
})

const html = highlighter.codeToHtml('const foo = "bar"', {
  lang: 'javascript',
  theme: 'css-variables' // use the theme // [!code hl]
})
```

CSS variables example:

```css
:root {
  --shiki-foreground: #eeeeee;
  --shiki-background: #333333;
  --shiki-token-constant: #660000;
  --shiki-token-string: #770000;
  --shiki-token-comment: #880000;
  --shiki-token-keyword: #990000;
  --shiki-token-parameter: #aa0000;
  --shiki-token-function: #bb0000;
  --shiki-token-string-expression: #cc0000;
  --shiki-token-punctuation: #dd0000;
  --shiki-token-link: #ee0000;

  /* Only required if using lang: 'ansi' */
  --shiki-ansi-black: #000000;
  --shiki-ansi-black-dim: #00000080;
  --shiki-ansi-red: #bb0000;
  --shiki-ansi-red-dim: #bb000080;
  --shiki-ansi-green: #00bb00;
  --shiki-ansi-green-dim: #00bb0080;
  --shiki-ansi-yellow: #bbbb00;
  --shiki-ansi-yellow-dim: #bbbb0080;
  --shiki-ansi-blue: #0000bb;
  --shiki-ansi-blue-dim: #0000bb80;
  --shiki-ansi-magenta: #ff00ff;
  --shiki-ansi-magenta-dim: #ff00ff80;
  --shiki-ansi-cyan: #00bbbb;
  --shiki-ansi-cyan-dim: #00bbbb80;
  --shiki-ansi-white: #eeeeee;
  --shiki-ansi-white-dim: #eeeeee80;
  --shiki-ansi-bright-black: #555555;
  --shiki-ansi-bright-black-dim: #55555580;
  --shiki-ansi-bright-red: #ff5555;
  --shiki-ansi-bright-red-dim: #ff555580;
  --shiki-ansi-bright-green: #00ff00;
  --shiki-ansi-bright-green-dim: #00ff0080;
  --shiki-ansi-bright-yellow: #ffff55;
  --shiki-ansi-bright-yellow-dim: #ffff5580;
  --shiki-ansi-bright-blue: #5555ff;
  --shiki-ansi-bright-blue-dim: #5555ff80;
  --shiki-ansi-bright-magenta: #ff55ff;
  --shiki-ansi-bright-magenta-dim: #ff55ff80;
  --shiki-ansi-bright-cyan: #55ffff;
  --shiki-ansi-bright-cyan-dim: #55ffff80;
  --shiki-ansi-bright-white: #ffffff;
  --shiki-ansi-bright-white-dim: #ffffff80;
}
```

If you are migrating from Shiki, some variables are renamed from Shiki's `css-variables`:

| Shiki                      | Shikiji              |
| -------------------------- | -------------------- |
| `--shiki-color-text`       | `--shiki-foreground` |
| `--shiki-color-background` | `--shiki-background` |
| `--shiki-color-ansi-*`     | `--shiki-ansi-*`     |
