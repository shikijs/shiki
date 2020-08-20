# shiki-themes

## Collections

- [vscode](https://github.com/Microsoft/vscode/tree/master/extensions)
- [material](https://github.com/equinusocio/vsc-material-theme)

## Good ones

- [nord](https://github.com/arcticicestudio/nord-visual-studio-code)
- [min](https://github.com/misolori/min-theme)

## Literal Values

```ts
export type TVSCode =
  | 'dark-plus'
  | 'light-plus'
  | 'monokai'
  | 'solarized-dark'
  | 'solarized-light'

export type TMaterial =
  | 'material-theme-darker'
  | 'material-theme-default'
  | 'material-theme-lighter'
  | 'material-theme-ocean'
  | 'material-theme-palenight'

export type TNice = 'nord' | 'min-light' | 'min-dark'

export type TTheme = TVSCode | TMaterial | TNice
```

## Yours

```js
const shiki  = require('shiki')

const t = shiki.loadTheme('./my-theme.json')

shiki.getHighlighter({
  theme: t
})
```

## Add

First, please open an issue to discuss including a new theme.

Here are the places you need to change:

- [/scripts/pullThemesFromGitHub.js](/scripts/pullThemesFromGitHub.js)
- `yarn update:themes`
- [./src/index.ts](./src/index.ts)
- [./src/types.ts](./src/types.ts)
- [Literal Values](./README.md#literal-values)