# shiki-themes

TextMate/vscode themes for Shiki. Themes are collected from three sources:

- [VS Code](https://github.com/microsoft/vscode)
- A [handpicked list](/scripts/themeSources.ts) from GitHub
- A [handpicked list](/scripts/themeSources.ts) from VS Code marketplace

A [build script](/scripts/pullThemes.sh) runs every day to pull latest themes from the upstream sources.

## Adding Theme

- Find your theme's repository
- If it has a compiled JSON theme, add its link to `githubThemeSources` in [/scripts/themeSources.ts](/scripts/themeSources.ts)
- If it has a precompilation step, add its link to `marketplaceThemeSources` in [/scripts/themeSources.ts](/scripts/themeSources.ts)
- Run `yarn update:themes`

## Loading Theme

```js
const shiki = require('shiki')

const t = shiki.loadTheme('./my-theme.json')

shiki.getHighlighter({
  theme: t
})
```

## All Themes

```ts
export type Theme =
  | 'dark-plus'
  | 'dracula-soft'
  | 'dracula'
  | 'github-dark-dimmed'
  | 'github-dark'
  | 'github-light'
  | 'light-plus'
  | 'material-darker'
  | 'material-default'
  | 'material-lighter'
  | 'material-ocean'
  | 'material-palenight'
  | 'min-dark'
  | 'min-light'
  | 'monokai'
  | 'nord'
  | 'one-dark-pro'
  | 'poimandres'
  | 'slack-dark'
  | 'slack-ochin'
  | 'solarized-dark'
  | 'solarized-light'
  | 'vitesse-dark'
  | 'vitesse-light'
```

You can preview some of these themes on https://vscodethemes.com/.
