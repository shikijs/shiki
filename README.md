We are working towards 1.0, which means:

- 0.13.0 will be the last minor version
- No new features, only minor bug fixes
- Work will happen in `dev` branch
- If you want to help, or ask for features, comment in [#424](https://github.com/shikijs/shiki/issues/424)

---

<p>
  <h2 align="center">Shiki</h2>
</p>
<p align="center">
  Shiki is a beautiful syntax highlighter. <a href="http://shiki.matsu.io">Demo</a>.
</p>

[![Github Workflow](https://github.com/shikijs/shiki/workflows/CI/badge.svg?branch=main)](https://github.com/shikijs/shiki/actions) [![Version](https://img.shields.io/npm/v/shiki.svg)](https://npmjs.org/package/shiki) [![npm](https://img.shields.io/npm/dw/shiki.svg)](https://www.npmjs.com/package/shiki)

## About

Shiki uses TextMate grammar's to tokenize strings, and colors the tokens via VS Code themes. In short, Shiki generates HTML that looks exactly like your code in VS Code, and it works great in your static website generator (or your dynamic website).

No custom RegEx to maintain, no custom CSS to maintain, no custom HTML to maintain. And as your favorite languages and themes in VS Code evolve - your syntax highlighting will evolve too.

## Basic usage

Get a quick start in Node.js or in plain websites with the instructions below.

### Node.js

To use Shiki in Node.js, install it with npm (or your favorite package manager):

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

// <pre class="shiki nord" style="background-color: #2e3440"><code>
//   <!-- Highlighted Code -->
// </code></pre>
```

### CDN

If you don't have a Node.js project, or if you just want to use the build in the browser, you can use one of the CDN builds:

```html
<script src="https://unpkg.com/shiki"></script>
<!-- or -->
<script src="https://cdn.jsdelivr.net/npm/shiki"></script>

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

For more custom usage, learn about [Shiki's architecture](#shikis-architecture), and take a look at the [Configuration and Options](#configuration-and-options) section.

And after that you can (and should) check out the reference docs for deeper dives:

- [Themes](./docs/themes.md)
- [Languages](./docs/languages.md)
- [SVG Renderer](./packages/renderer-svg/README.md)
- [vuepress-plugin-shiki](./packages/vuepress-plugin/README.md)

## Shiki's architecture

Shiki has a lot of points for customization notably: themes, languages, and custom renderers.

Shiki leverages the [TextMate](https://macromates.com/manual/en/language_grammars) grammar system to tokenize code. It uses the [VS Code Oniguruma](https://github.com/vscode-oniguruma/vscode-oniguruma) library to do the heavy lifting of matching the grammar rules to code.

At the core is Shiki's [highlighter](./packages/shiki/src/highlighter.ts). The highlighter is a class which takes a theme and languages, and exposes functions like `codeToHtml` which converts string of arbitrary code and returns a string of HTML for rendering on the web.

When you call `getHighlighter`, Shiki will:

- load the theme and the languages you've requested
- load the WebAssembly file from Oniguruma

and return a `Highlighter` object.

The default locations where the files are loaded from depend on the environment:

- In Node.js:

  - Languages are loaded from `node_modules/shiki/languages`. Similarly, the themes are loaded from `node_modules/shiki/themes`.
  - The Oniguruma WebAssembly file is loaded from the `node_modules/vscode-oniguruma/release/onig.wasm`.

- In the browser:
  - Languages are loaded from `/languages`, **relative to your site's root**. Similarly, the themes are loaded from `/themes`.
  - The Oniguruma WebAssembly file is loaded from `/dist/onig.wasm` path **relative to your site's root**.

After that you can use the highlighter to generate HTML using `highlighter.codeToHtml`. This works by converting the code into tokens and then rendering the tokens using a default renderer which applies the theme's colors to the tokens.

As with all things, there are more details, so let's take a look at the [Configuration and Options](#configuration-and-options) section.

## Configuration and Options

### Creating the highlighter

The exported named function `getHighlighter` returns a Promise, choose either the async/await syntax or the `.then` syntax based on your preference:

```js
// Note no languages are specified. Which then defaults to load all languages.
// Which is probably ok in Node.js, but not something you want in the browser.
const highlighter = await getHighlighter({
  theme: 'nord'
})
```

> This async code is

Load the highlighter with a default theme and a list of languages:

```js
// ONLY the languages specified will be loaded. If you need other languages later,
// you'll need to load them separately (see below).
const highlighter = await getHighlighter({
  theme: 'nord',
  langs: ['javascript', 'python']
})
```

Load the highlighter with a default theme and no languages:

```js
// ONLY the languages specified will be loaded. It's an empty array, so Shiki won't  preload anything.
// For every language that you need later you'll have to load it separately (see down below).
const highlighter = await getHighlighter({
  theme: 'nord',
  langs: []
})
```

Load the highlighter with multiple themes, and a list of languages:

```js
// The first theme in the list will be the default theme.

const highlighter = await getHighlighter({
  themes: ['github-light', 'nord'],
  langs: ['javascript', 'python']
})
```

Load the highlighter with multiple themes, a list of languages, and override the default paths for the languages and themes:

```js
const highlighter = await getHighlighter({
  themes: ['github-light', 'nord'],
  langs: ['javascript', 'python'],
  paths: {
    themes: '/path/to/themes',
    languages: '/path/to/languages'
  }
})
```

> Most likely you won't need to do this, but it's useful to understand the options.

### Convert code to HTML

The `highlighter` exposes a `codeToHtml` method that takes a string of code, an options object, and returns a string of HTML.

Convert code to HTML with the default theme:

```js
const code = `console.log("Here is your code.");`
const output = highlighter.codeToHtml(code, { lang: 'js' })
```

Convert code to HTML with a specific theme:

```js
const code = `console.log("Here is your code.");`
const output = highlighter.codeToHtml(code, { lang: 'js', theme: 'nord' })
```

### Load languages and themes after the highlighter has been created

You can load languages and themes after the highlighter has been created. For that, the highlighter exposes `getLoadedLanguages()`/`getLoadedThemes()` and `loadLanguage()`/`loadTheme()`.

A good practice, especially for browser environments, is to initialize the highlighter with your most used languages and themes, and then load more languages and themes on demand.

You can also access the list of all themes and languages which are bundled using `BUNDLED_LANGUAGES` and `BUNDLED_THEMES`.

```js
import { BUNDLED_LANGUAGES, BUNDLED_THEMES, getHighlighter } from 'shiki'

const highlighter = await getHighlighter({
  theme: 'nord',
  langs: ['javascript', 'python']
})

// Some code that tells you that you now need `ruby` highlighting
const code = imaginaryCodeThatNeedsRubyHighlighting()
const language = imaginaryLanguageDetection(code)
const newTheme = imaginaryCodeThatDefinesTheTheme()

// Check for the loaded languages, and load the language if it's not loaded yet.
if (!highlighter.getLoadedLanguages().includes(language)) {
  // Check if the language is supported by Shiki
  const bundles = BUNDLED_LANGUAGES.filter((bundle) => {
    // Languages are specified by their id, they can also have aliases (i. e. "js" and "javascript")
    return bundle.id === language || bundle.aliases?.includes(language);
  });
  if (bundles.length > 0) {
    await highlighter.loadLanguage(language)
  } else {
    // Do some error handling or default to another language or...
  }
}

// Check for the loaded themes, and load the theme if it's not loaded yet.
if (!highlighter.getLoadedThemes().includes(newTheme)) {
  // Check if the theme is supported by Shiki
  if (BUNDLED_THEMES.includes(newTheme) {
    await highlighter.loadTheme(newTheme)
  } else {
    // Do some error handling or default to another theme or...
  }
}

const output = highlighter.codeToHtml(code, { lang: language, theme: newTheme })
```

### Specify a custom root directory

You can specify a custom root directory for your languages and themes. This is useful if you want to use Shiki in a browser environment and want to specify a different host (and/or path), or if you want to specify a dedicated directory structure for the current host.

> If used, `setCDN` must be invoked before `getHighlighter` is called.
> You won't have to use `setCDN` if you use the pre-built packages on [unpkg](https://unpkg.com/shiki") or [jsDelivr](https://cdn.jsdelivr.net/npm/shiki).

Set a custom root path:

```js
import { getHighlighter, setCDN } from 'shiki'

// Assets will be loaded from the host root + asset path, for example `/assets/shiki/languages/'
setCDN('/assets/shiki/')

const highlighter = await getHighlighter({
  theme: 'nord',
  langs: ['javascript', 'python']
})
```

Set a custom host and root path:

```js
import { getHighlighter, setCDN } from 'shiki'

// Assets will be loaded from remote host + asset path, for example `https://your.cdn.com/your/path/languages/`
setCDN('https://your.cdn.com/your/path/')

const highlighter = await getHighlighter({
  theme: 'nord',
  langs: ['javascript', 'python']
})
```

Set a custom root path and a custom asset path:

```js
import { getHighlighter, setCDN } from 'shiki'

setCDN('/assets/shiki/')

// Languages will be loaded from `/assets/shiki/imported/` instead of `/languages/`.
// Themes will be loaded from `/assets/shiki/themes/` (as their default is not overridden).

const highlighter = await getHighlighter({
  theme: 'nord',
  langs: ['javascript', 'python']
  paths: {
    languages: 'imported/',
  }
})
```

### Specify how to load WebAssembly

Shiki makes use of [VS Code Oniguruma](https://github.com/microsoft/vscode-oniguruma) for tokenization (see [Shiki's Architecture](#shikis-architecture) for more information). Oniguruma is written in C and compiled to WebAssembly. Which means that the WebAssembly file needs to be loaded.

For Node.js environments the WASM file is automatically loaded, for browser environments you can specify how to load the WASM file.

> If used, `setWASM` must be invoked before `getHighlighter` is called.

> If you make use of a reverse proxy like [nginx](https://www.nginx.com/) or [traefik](https://traefik.io/traefik/) you may have to specify in its configuration the MIME type for wasm files.

Use the default loader: (applies to Node.js and browser environments)

```js
import { getHighlighter } from 'shiki'

// With the default settings, the WASM file will be loaded from `/dist/´.
const highlighter = await getHighlighter({
  theme: 'nord',
  langs: ['javascript', 'python']
})
```

Use the default loader, and override the default path for the WASM file:

```js
import { getHighlighter } from 'shiki'

const highlighter = await getHighlighter({
  theme: 'nord',
  langs: ['javascript', 'python'],
  paths: {
    wasm: 'your/path/' // If you use `setCDN`, this path will be relative to the CDN root.
  }
})
```

Load the WASM file yourself, and provide a `Response` object:

```js
import { getHighlighter, setWasm } from 'shiki'

// It is recommended to use a Response object. Oniguruma will then use WebAssembly.instantiateStreaming(), which
// means it can start parsing the file while it's still downloading.
const wasmResponse = await fetch('/your/path/onig.wasm')
setWasm(wasmResponse)

const highlighter = await getHighlighter({
  theme: 'nord',
  langs: ['javascript', 'python']
})
```

Load the WASM file yourself, and provide an `ArrayBuffer`:

```js
import { getHighlighter, setWasm } from 'shiki'

// It is recommended to use a Response object. Oniguruma will then use WebAssembly.instantiateStreaming(), which
// means it can start parsing the file while it's still downloading.
//
// With an ArrayBuffer this is not possible, so the file will be fully downloaded before parsing starts.
const wasmBuffer = await fetch('/your/path/onig.wasm').then(res => res.arrayBuffer())
setWasm(wasmBuffer)

const highlighter = await getHighlighter({
  theme: 'nord',
  langs: ['javascript', 'python']
})
```

## Custom rendering of code blocks

The default functionality of rendering code blocks would use `codeToHtml` from the `Highlighter` instance.

If you want to render the tokens into a code yourself, Shiki exposes two key methods to do that.

- `codeToThemedTokens` takes a code string and a language id and returns an array of tokens. A token represents a single part of the code, for example a keyword, a string, a comment, etc.
- `renderToHTML` takes an array of tokens and returns an HTML string that represents the provided code.

```js
import shiki, { getHighlighter } from 'shiki'

const highlighter = await getHighlighter({
  theme: 'nord',
  langs: ['javascript', 'python']
})

const code = `console.log("Here is your code.");`

// This will return an array of tokens for the provided code.
// A token represents a single part of the code, for example a keyword, a string, a comment, etc.
const tokens = highlighter.codeToThemedTokens(code, 'javascript')

// This will return an HTML string that represents the provided code.
const html = shiki.renderToHTML(tokens)
```

Alternatively you can add to `renderToHTML` the desired element shape for `pre`, `code`, `line (span)`, and `token (span)`, and override the theme colors for background and foreground.

For more about that, or to build your own renderer, check out the implementation in [shiki](./packages/shiki/src/renderer.ts).

```js
const html = shiki.renderToHTML(tokens, {
  fg: highlighter.getForegroundColor('nord'), // Set a specific foreground color.
  bg: highlighter.getBackgroundColor('nord'), // Set a specific background color.
  // Specified elements override the default elements.
  elements: {
    pre({ className, style, children }) {
      return `${children}`
    },
    code({ className, style, children }) {
      return `${children}`
    }
  }
})
```

There are multiple Shiki renderers out there in the wild. You can see a bunch linked below.

## Multiple Shiki instances on the same page

If you want to use Shiki in a browser multiple times on the same page, you should make sure that there is only a single `Highlighter` instance. Use cases are for example a markdown editor and a preview, or wrapping Shiki within a web component.

Common scenarios are to use the Observable pattern, or to use a singleton pattern.

In both cases you've to ensure that the `Highlighter` instance is only created once, and that it is bootstrapped asynchronously before calling any of the exposed functions.

## Seen

- Shiki Docs: https://shiki.matsu.io
- Interactive Demo on CodeSandbox (with Next.js): https://codesandbox.io/s/shiki-next-js-cir0y
- [VS Code website](https://code.visualstudio.com), such as in the [Notebook API page](https://code.visualstudio.com/api/extension-guides/notebook).
- [TypeScript website](https://www.typescriptlang.org), such as in the [Basic Types documentation page](https://www.typescriptlang.org/docs/handbook/basic-types.html#tuple).
- [Markdown Preview Shiki Highlighting](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-Shiki), a VS Code plugin to use Shiki's highlighting in Markdown preview.
- [Fatih Kalifa's website](https://fatihkalifa.com/typescript-twoslash)
- [Blockstack Documentation](https://docs.blockstack.org/)
- [Torchlight](https://torchlight.dev/), a syntax highlighting API powered by the Shiki tokenizer.
- [CodeChalk](https://github.com/a20185/codechalk), A neat terminal code highlighting tool powered by Shiki tokenizer and Chalk.
- [Code Hike](https://codehike.org/), a collection of components and mods for MDX codeblocks.

## Custom Renderers

- Shiki Twoslash: https://shikijs.github.io/twoslash/ Playground: https://shikijs.github.io/twoslash/playground
- [Shiki LaTeX](https://www.npmjs.com/package/shiki-latex), a Shiki renderer for [LaTeX](https://www.latex-project.org). Compatible with [minted](https://github.com/gpoore/minted), replacing [Pygments](https://pygments.org).
- [Scarbon](https://www.npmjs.com/package/scarbon), an elegant code renderer made using Shiki for highlighting, [Prettier](https://prettier.io/) for formatting, and [Canvas](https://www.npmjs.com/package/canvas) for rendering
- [VPC Shiki](https://github.com/Vap0r1ze/vpc-shiki), Shiki codeblocks on Discord. Powered by [Powercord](http://powercord.dev/)
- [shiki-renderer-canvas](https://www.npmjs.com/package/shiki-renderer-canvas), a Canvas renderer for Shiki that works in Node.js and the browser
- [shiki-renderer-pdf](https://github.com/sachinraja/shiki-renderer-pdf), a Shiki renderer for PDFs. Used in [pdfc](https://github.com/sachinraja/pdfc) to compile your source code to PDFs.

## Contributing

See the [Contributing Guide](.github/CONTRIBUTING.md).

## Credits

- Shiki uses [vscode-oniguruma](https://github.com/microsoft/vscode-oniguruma)
- A lot of code is based on [vscode-textmate](https://github.com/Microsoft/vscode-textmate)

## Sponsorship

If you find Shiki useful, please consider sponsoring my Open Source development. Thank you 🙏

https://github.com/sponsors/octref

## License

MIT © [Pine Wu](https://github.com/octref)
