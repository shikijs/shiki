# shiki

[Shiki](https://github.com/octref/shiki) is a beautiful Syntax Highlighter.

It uses TextMate grammar to tokenize strings, and theme the tokens with VS Code themes.

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
// </code></pre
```

Here's roughly the js that generated this HTML page:

```js
const markdown = require('markdown-it')
const shiki = require('shiki')

shiki.getHighlighter({
  theme: 'nord'
}).then(highlighter => {
  markdown({
    highlight: (code, lang) => highlighter.codeToHtml(code, lang)
  })
})
```

And here's the referenced CSS:

```css
body {
  max-width: 800px;
  margin: 4rem auto 4rem auto;
  font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, sans-serif;
}
pre {
  padding: 2rem;
  margin-bottom: 3rem;
}
pre code {
  font-family: 'Input Mono', Inconsolata, monospace;
  font-size: 12px;
}
h1, h2 {
  font-weight: 300;
}
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

With proper embedded language support, too, so Shiki works great with Vue files:

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

Shiki bundles a few good themes. I'm using [Nord](https://github.com/arcticicestudio/nord-visual-studio-code) here, but I like [Material Palenight](https://github.com/equinusocio/vsc-material-theme) too.

<div id="palenight"></div>

You can find all themes in [shiki-themes](https://github.com/octref/shiki/tree/master/packages/themes), and use them like:

```js
shiki.getHighlighter({
  // 'dark_plus' | 'light_plus' for the classic VS Code feel
  // 'Material-Theme-Ocean' | 'Material-Theme-Palenight' for the materialists
  // 'min-light' | 'white' for the minimalists
  theme: 'nord'
})
```

Or, load your own theme:

<div id="solarized"></div>

Made by [Pine](https://blog.matsu.io/about) when he was working on the revamped [VS Code API doc](https://code.visualstudio.com/api), which is now highlighted with the Light Plus theme.

Enjoy!