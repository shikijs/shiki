<p>
  <h2 align="center">Shiki</h2>
</p>
<p align="center">
  Shiki is a beautiful Syntax Highlighter. <a href="http://shiki.matsu.io">Demo</a>.
</p>

## Usage

```js
const shiki = require('shiki')

shiki.getHighlighter({
  theme: 'nord'
}).then(highlighter => {
  console.log(highlighter.codeToHtml(`console.log('shiki');`, 'js'))
})

// <pre class="shiki" style="background-color: #2e3440"><code>
//   <!-- Highlighted Code -->
// </code></pre
```

- [Themes](./packages/themes/README.md#literal-values)

## License

MIT © [Pine Wu](https://github.com/octref) 