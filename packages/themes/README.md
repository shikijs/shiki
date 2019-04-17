# shiki-themes

## Collections

- [vscode](https://github.com/Microsoft/vscode/tree/master/extensions)
- [material](https://github.com/equinusocio/vsc-material-theme)

## Good ones

- [nord](https://github.com/arcticicestudio/nord-visual-studio-code)
- [min](https://github.com/misolori/min-theme)
- [white](https://github.com/arthurwhite/white-theme-vscode)
- [zeit](http://zeit-theme.now.sh)

## Literal Values

```ts
export type TVSCode =
  | 'abyss'
  | 'dark_plus'
  | 'dark_vs'
  | 'hc_black'
  | 'kimbie_dark'
  | 'light_plus'
  | 'light_vs'
  | 'monokai'
  | 'monokai_dimmed'
  | 'quietlight'
  | 'red'
  | 'solarized_dark'
  | 'solarized_light'

export type TMaterial =
  | 'Material-Theme-Darker-High-Contrast'
  | 'Material-Theme-Darker'
  | 'Material-Theme-Default-High-Contrast'
  | 'Material-Theme-Default'
  | 'Material-Theme-Lighter-High-Contrast'
  | 'Material-Theme-Lighter'
  | 'Material-Theme-Ocean-High-Contrast'
  | 'Material-Theme-Ocean'
  | 'Material-Theme-Palenight-High-Contrast'
  | 'Material-Theme-Palenight'

export type TNice =
  | 'nord'
  | 'min-light'
  | 'min-dark'
  | 'white'
  | 'white-night'
  | 'zeit'

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