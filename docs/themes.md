# shiki-themes

TextMate/vscode themes for Shiki. Themes are collected from three sources:

- [VS Code](https://github.com/microsoft/vscode)
- A [handpicked list](/scripts/themeSources.ts) from GitHub
- A [handpicked list](/scripts/themeSources.ts) from VS Code marketplace

A [build script](/scripts/pullThemes.sh) runs every day to pull latest themes from the upstream sources.


## Not Actively Adding New Themes

Because all themes are included in npm builds of Shiki, we rarely accept PRs adding new themes. It's very easy to add your own themes via the Shiki [config](https://github.com/shikijs/shiki/blob/main/packages/shiki/src/types.ts#L6).

## Adding Theme

- Find your theme's repository
- If it has a compiled JSON theme, add its link to `githubThemeSources` in [/scripts/themeSources.ts](/scripts/themeSources.ts)
- If it has a precompilation step, add its link to `marketplaceThemeSources` in [/scripts/themeSources.ts](/scripts/themeSources.ts)
- Run `pnpm update:themes`
- Review the diffs in git. You should see:
  - `docs/themes.md`: Your theme id added
  - `packages/shiki/themes/<theme>.json`: The theme downloaded
  - `packages/shiki/src/themes.ts`: Your language added to `type Theme` and `const themes`
  - `scripts/themeSources.ts`: The theme's id and URL
- 🚀 Send in the PR!

## Loading Theme

```js
const shiki = require('shiki')

const t = shiki.loadTheme('./my-theme.json')

shiki.getHighlighter({
  theme: t
})
```
## Dark Mode Support

Because Shiki generates themes at build time, client-side theme switching support is not built in. There are two popular two options for supporting something like Dark Mode with Shiki.

#### 1. Use the "css-variables" theme.

This gives you access to CSS variable styling, which you can control across Dark and Light mode. See the [Theming with CSS Variables](#theming-with-css-variables) section below for more details.
#### 2. Generate two Shiki code blocks, one for each theme.

```css
@media (prefers-color-scheme: light) {
  .shiki.dark-plus {
    display: none;
  }
}
@media (prefers-color-scheme: dark) {
  .shiki.light-plus {
    display: none;
  }
}
```

## Theming with CSS Variables

Shiki handles all theme logic at build-time, so that the browser only ever sees already-computed `style="color: #XXXXXX"` attributes. This allows more granular theme support in a way that doesn't require any additional steps to add global CSS to your page.

In some cases, a user may require custom client-side theming via CSS. To support this, you may use the `css-variables` theme with Shiki. This is a special theme that uses CSS variables for colors instead of hardcoded values. Each token in your code block is given an attribute of `style="color: var(--shiki-XXX)"` which you can use to style your code blocks using CSS.


```js
const shiki = require('shiki')
shiki.getHighlighter({theme: 'css-variables'})
```

Note that this client-side theme is less granular than most other supported VSCode themes. Also, be aware that this will generate unstyled code if you do not define these CSS variables somewhere else on your page:

```html
<style>
  :root {
    --shiki-color-text: #EEEEEE;
    --shiki-color-background: #333333;
    --shiki-token-constant: #660000;
    --shiki-token-string: #770000;
    --shiki-token-comment: #880000;
    --shiki-token-keyword: #990000;
    --shiki-token-parameter: #AA0000;
    --shiki-token-function: #BB0000;
    --shiki-token-string-expression: #CC0000;
    --shiki-token-punctuation: #DD0000;
    --shiki-token-link: #EE0000;

    /* Only required if using ansiToHtml function */
    --shiki-color-ansi-black: #000000;
    --shiki-color-ansi-black-dim: #00000080;
    --shiki-color-ansi-red: #bb0000;
    --shiki-color-ansi-red-dim: #bb000080;
    --shiki-color-ansi-green: #00bb00;
    --shiki-color-ansi-green-dim: #00bb0080;
    --shiki-color-ansi-yellow: #bbbb00;
    --shiki-color-ansi-yellow-dim: #bbbb0080;
    --shiki-color-ansi-blue: #0000bb;
    --shiki-color-ansi-blue-dim: #0000bb80;
    --shiki-color-ansi-magenta: #ff00ff;
    --shiki-color-ansi-magenta-dim: #ff00ff80;
    --shiki-color-ansi-cyan: #00bbbb;
    --shiki-color-ansi-cyan-dim: #00bbbb80;
    --shiki-color-ansi-white: #eeeeee;
    --shiki-color-ansi-white-dim: #eeeeee80;
    --shiki-color-ansi-bright-black: #555555;
    --shiki-color-ansi-bright-black-dim: #55555580;
    --shiki-color-ansi-bright-red: #ff5555;
    --shiki-color-ansi-bright-red-dim: #ff555580;
    --shiki-color-ansi-bright-green: #00ff00;
    --shiki-color-ansi-bright-green-dim: #00ff0080;
    --shiki-color-ansi-bright-yellow: #ffff55;
    --shiki-color-ansi-bright-yellow-dim: #ffff5580;
    --shiki-color-ansi-bright-blue: #5555ff;
    --shiki-color-ansi-bright-blue-dim: #5555ff80;
    --shiki-color-ansi-bright-magenta: #ff55ff;
    --shiki-color-ansi-bright-magenta-dim: #ff55ff80;
    --shiki-color-ansi-bright-cyan: #55ffff;
    --shiki-color-ansi-bright-cyan-dim: #55ffff80;
    --shiki-color-ansi-bright-white: #ffffff;
    --shiki-color-ansi-bright-white-dim: #ffffff80;
  }
</style>
```

## All Themes

```ts
export type Theme =
  | 'css-variables'
  | 'dark-plus'
  | 'dracula-soft'
  | 'dracula'
  | 'github-dark-dimmed'
  | 'github-dark'
  | 'github-light'
  | 'hc_light'
  | 'light-plus'
  | 'material-theme-darker'
  | 'material-theme-lighter'
  | 'material-theme-ocean'
  | 'material-theme-palenight'
  | 'material-theme'
  | 'min-dark'
  | 'min-light'
  | 'monokai'
  | 'nord'
  | 'one-dark-pro'
  | 'plastic'
  | 'poimandres'
  | 'rose-pine-dawn'
  | 'rose-pine-moon'
  | 'rose-pine'
  | 'slack-dark'
  | 'slack-ochin'
  | 'solarized-dark'
  | 'solarized-light'
  | 'vitesse-dark'
  | 'vitesse-light'
```

You can preview some of these themes on https://vscodethemes.com/.
