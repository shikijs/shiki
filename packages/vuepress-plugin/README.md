# vuepress-plugin-shiki

```bash
yarn global add vuepress@next 
yarn add -D vuepress-plugin-shiki
```

`.vuepress/config.js`

```js
module.exports = {
  plugins: {
    shiki: { theme: 'nord' } // theme: TTheme
  }
}
```

[`TTheme` values](../themes/README.md#literal-values)

```ts
export type TVSCode =
  | 'abyss'
  | 'dark_vs'
  | 'light_vs'
  | 'hc_black'
  | 'dark_plus'
  | 'light_plus'
  | 'kimbie_dark'
  | 'monokai'
  | 'monokai_dimmed'
  | 'quietlight'
  | 'red'
  | 'solarized_dark'
  | 'solarized_light'

export type TMaterial =
  | 'Darker-High-Contrast'
  | 'Darker'
  | 'Default-High-Contrast'
  | 'Default'
  | 'Lighter-High-Contrast'
  | 'Lighter'
  | 'Ocean-High-Contrast'
  | 'Ocean'
  | 'Palenight-High-Contrast'
  | 'Palenight'

export type TNice =
  | 'nord'
  | 'min-light'
  | 'min-dark'
  | 'white'
  | 'white-night'

export type TTheme = TVSCode | TMaterial | TNice
```