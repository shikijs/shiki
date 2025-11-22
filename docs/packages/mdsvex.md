# mdsvex

[mdsvex](https://mdsvex.pngwn.io/) is a markdown rendering library for Svelte. While Shiki doesn't provide an official integration, it's fairly straightforward to include it in your Svelte apps.

## mdsvex.config.js

```javascript
import { defineMDSveXConfig, escapeSvelte } from 'mdsvex'
import { createHighlighter } from 'shiki'

async function highlighter(code, lang) {
  const highlighter = await createHighlighter({
    langs: [lang],
    themes: ['kanagawa-wave'],
  })

  const html = escapeSvelte(
    highlighter.codeToHtml(code, {
      theme: 'kanagawa-wave',
      lang,
    }),
  )

  return `{@html \`${html}\` }`
}

const mdsvexConfig = defineMDSveXConfig({
  extensions: ['.md'],
  highlight: { highlighter },
})

export default mdsvexConfig
```

## svelte.config.js

```javascript
import { mdsvex } from 'mdsvex'
import mdsvexConfig from './mdsvex.config.js'

const config = {
  preprocess: [
    // Other pre-processors...
    mdsvex(mdsvexConfig),
  ],
  extensions: ['.svelte', '.md'],
  // Rest of config
}

export default config
```

## Fine-grained bundles

If you wish to optimize your bundle size, follow the [fine-grained bundle guide](/guide/bundles#fine-grained-bundle)
