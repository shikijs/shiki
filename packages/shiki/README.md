<p>
  <h2 align="center">Shiki</h2>
</p>
<p align="center">
  Shiki is a beautiful Syntax Highlighter. <a href="http://shiki.matsu.io">Demo</a>.
</p>

## Usage

```sh
npm i shiki
```

```js
const shiki = require('shiki')

shiki
  .getHighlighter({
    theme: 'nord'
  })
  .then(highlighter => {
    console.log(highlighter.codeToHtml(`console.log('shiki');`, { lang: 'js' }))
  })

// <pre class="shiki" style="background-color: #2e3440"><code>
//   <!-- Highlighted Code -->
// </code></pre>
```

```html
<script src="https://unpkg.com/shiki"></script>
<script>
  shiki
    .getHighlighter({
      theme: 'nord'
    })
    .then(highlighter => {
      const code = highlighter.codeToHtml(`console.log('shiki');`, { lang: 'js' })
      document.getElementById('output').innerHTML = code
    })
</script>
```

Clone [shikijs/shiki-starter](https://github.com/shikijs/shiki-starter) to play with Shiki, or try it out on [Repl.it](https://repl.it/@octref/shiki-starter).

Learn more from the GitHub repo: [shikijs/shiki](https://github.com/shikijs/shiki).


## Credits

- Shiki uses [vscode-oniguruma](https://github.com/microsoft/vscode-oniguruma)
- A lot of code is based on [vscode-textmate](https://github.com/Microsoft/vscode-textmate)

## Sponsorship

If you find Shiki useful, please consider sponsoring my Open Source development. Thank you 🙏

https://github.com/sponsors/octref

## License

MIT © [Pine Wu](https://github.com/octref)
