# shiki

[Shiki](https://github.com/octref/shiki) is a beautiful Syntax Highlighter.

It uses TextMate grammar to tokenize strings, and colors the tokens with VS Code themes. In short, Shiki generates HTML that looks exactly like your code in VS Code, and it works great in your static website generator.

It's simple to use:

```js
const shiki = require('shiki')

shiki.getHighlighter({
  theme: 'nord'
}).then(highlighter => {
  console.log(highlighter.codeToHtml(`console.log('shiki');`, 'js'))
})

// <pre class="shiki" style="background-color: #2e3440"><code>
//   <!-- Highlighted Code -->
// </code></pre>
```

Here's me using Shiki and [markdown-it](https://github.com/markdown-it/markdown-it) to [generate](https://github.com/octref/shiki/blob/master/packages/site/gen-index.js) this page:

```js
const fs = require('fs')
const markdown = require('markdown-it')
const shiki = require('shiki')

shiki.getHighlighter({
  theme: 'nord'
}).then(highlighter => {
  const md = markdown({
    html: true,
    highlight: (code, lang) => {
      return highlighter.codeToHtml(code, lang)
    }
  })

  const html = md.render(fs.readFileSync('index.md', 'utf-8'))
  const out = `
    <title>Shiki</title>
    <link rel="stylesheet" href="style.css">
    ${html}
    <script src="index.js"></script>
  `
  fs.writeFileSync('index.html', out)

  console.log('done')
})
```

Why Shiki though? Take a look at this [monstrous TextMate grammar](https://github.com/Microsoft/TypeScript-TmLanguage/blob/master/TypeScriptReact.tmLanguage). It's what highlights TypeScript code in VS Code. Insane, I know. But it gets the color right.

```tsx
import * as React from 'react';
import './App.css';
import Hello from './components/Hello';

const logo = require('./logo.svg');

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to React</h2>
      </div>
      <p className="App-intro">
        To get started, edit <code>src/App.tsx</code> and save to reload.
      </p>
      <Hello name="TypeScript" />
    </div>
  );
}

export default App;
```

Shiki bundles a few good themes. Just change this line:

```js
shiki.getHighlighter({
  theme: 'Material-Theme-Palenight'
})
```

And you get the above code in [Material Palenight](https://github.com/equinusocio/vsc-material-theme). 

<div id="palenight"></div>

<!-- <div id="palenight"></div> -->

You can find all bundled themes in [shiki-themes](https://github.com/octref/shiki/tree/master/packages/themes), and use them like:

```js
shiki.getHighlighter({
  // 'dark_plus' | 'light_plus' => for the classic VS Code feel
  // 'Material-Theme-*'         => for the materialists
  // 'min-light' | 'white'      => for the minimalists
  theme: 'nord'
})
```

But really, any VS Code theme will do:

<div id="solarized"></div>

Embedded language like Vue works great, too:

```vue
<template>
  <div id="app">
    <h1>My Todo App!</h1>
    <TodoList/>
  </div>
</template>

<script>
import TodoList from './components/TodoList.vue'

export default {
  components: {
    TodoList
  }
}
</script>

<style lang="scss">
#app {
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.4;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $vue-blue;

  h1 {
    text-align: center;
  }
}
</style>
```

You can also build custom renderers to generate a different HTML structure, SVG or even images:

```js
const shiki = require('shiki')

shiki.getHighlighter({
  theme: 'nord'
}).then(highlighter => {
  const tokens = highlighter.codeToThemedTokens(`console.log('shiki');`, 'js')
  // default renderer, replace with yours
  const html = shiki.renderToHtml(tokens) 
})
```

Can't find your language? As long as you have a [TextMate grammar](https://macromates.com/manual/en/language_grammars), Shiki can highlight it:

```js
const shiki = require('shiki')

shiki.getHighlighter({
  theme: "nord",
  langs: [{
    id: 'rockstar',
    scopeName: 'source.rockstar',
    path: './rockstar.tmLanguage.json', // or `plist`
    aliases: []
  },
  ...shiki.commonLangIds,
  ...shiki.commonLangAliases
  ]
})
```

Here’s Fizzbuzz in [Rockstar](https://codewithrockstar.com).

<div id="rockstar"></div>

Made by [Pine](https://blog.matsu.io/about).

Enjoy!
