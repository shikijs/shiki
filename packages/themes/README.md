# shiki-themes

## Collections

- [vscode](https://github.com/Microsoft/vscode/tree/master/extensions)
- [material](https://github.com/equinusocio/vsc-material-theme)

## Single

- [nord](https://github.com/arcticicestudio/nord-visual-studio-code)
- [min](https://github.com/misolori/min-theme)
- [white](https://github.com/arthurwhite/white-theme-vscode)
- [zeit](http://zeit-theme.now.sh)

## Yours

```js
const { Shiki }  = require('shiki')
const { loadTheme }  = require('shiki-themes')

const t = loadTheme('./my-theme.json')
const h = await new Shiki(t)
h.codeToHtml(code, lang)
```