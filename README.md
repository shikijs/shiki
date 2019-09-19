<p>
  <h2 align="center">Shiki</h2>
</p>
<p align="center">
  Shiki is a beautiful Syntax Highlighter. <a href="http://shiki.matsu.io">Demo</a>.
</p>

## Usage

```sh
npm i shiki
# yarn add shiki
```

```js
const shiki = require('shiki')

shiki
  .getHighlighter({
    theme: 'nord'
  })
  .then(highlighter => {
    console.log(highlighter.codeToHtml(`console.log('shiki');`, 'js'))
  })

// <pre class="shiki" style="background-color: #2e3440"><code>
//   <!-- Highlighted Code -->
// </code></pre>
```

- [Themes](./packages/themes/README.md#literal-values)
- [Languages](./packages/languages/README.md#literal-values)
- [vuepress-plugin-shiki](./packages/vuepress-plugin/README.md)

## Seen

- https://shiki.matsu.io
- [VS Code website](https://code.visualstudio.com), such as in the [Programmatic Language Features page](https://code.visualstudio.com/api/language-extensions/programmatic-language-features).
- [New TypeScript handbook](https://github.com/microsoft/TypeScript-New-Handbook), such as in the [everything page](https://microsoft.github.io/TypeScript-New-Handbook/everything/).
- [Markdown Preview Shiki Highlighting](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-Shiki), a VS Code plugin to use Shiki's highlighting in Markdown preview.

## Credits

- Shiki uses [Onigasm](https://github.com/NeekSandhu/onigasm) by [@NeekSandhu](https://github.com/NeekSandhu)
- A lot of code is based on [vscode-textmate](https://github.com/Microsoft/vscode-textmate)

## License

MIT © [Pine Wu](https://github.com/octref)
