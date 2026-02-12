import { createdBundledHighlighter, createHighlighterCore, createSingletonShorthands, guessEmbeddedLanguages } from '@shikijs/core'
import { createOnigurumaEngine } from '@shikijs/engine-oniguruma'
import { expect, it } from 'vitest'

const markdownWithEmbedded = `
# Markdown with embedded languages

\`\`\`javascript
console.log("hello")
\`\`\`

\`\`\`python
print("hello")
\`\`\`

\`\`\`html
<div class="foo">bar</div>
\`\`\`
`

it('fine-grained bundle - manually load embedded languages', async () => {
  const highlighter = await createHighlighterCore({
    themes: [
      import('@shikijs/themes/nord'),
    ],
    langs: [
      import('@shikijs/langs/markdown'),
      import('@shikijs/langs/javascript'),
      import('@shikijs/langs/python'),
      import('@shikijs/langs/html'),
    ],
    engine: createOnigurumaEngine(import('shiki/wasm')),
  })

  const html = highlighter.codeToHtml(markdownWithEmbedded, {
    lang: 'markdown',
    theme: 'nord',
  })

  // Check that embedded code blocks are highlighted
  expect(html).toContain('console')
  expect(html).toContain('print')
  // HTML entities are escaped in output
  expect(html).toContain('div')

  // Verify syntax highlighting is applied (color styles present)
  expect(html).toMatch(/style="[^"]*color:[^"]*"/)
})

it('fine-grained bundle - dynamically load embedded languages', async () => {
  const highlighter = await createHighlighterCore({
    themes: [
      import('@shikijs/themes/nord'),
    ],
    langs: [
      import('@shikijs/langs/markdown'),
    ],
    engine: createOnigurumaEngine(import('shiki/wasm')),
  })

  // Initially only markdown is loaded
  expect(highlighter.getLoadedLanguages()).toEqual(['markdown', 'md'])

  // Detect embedded languages (don't pass highlighter since it has no bundle)
  const embeddedLangs = guessEmbeddedLanguages(markdownWithEmbedded, 'markdown')

  // Should detect javascript, python, html
  expect(embeddedLangs).toContain('javascript')
  expect(embeddedLangs).toContain('python')
  expect(embeddedLangs).toContain('html')

  // Load them dynamically
  await Promise.all(
    embeddedLangs.map(lang =>
      highlighter.loadLanguage(import(`@shikijs/langs/${lang}`)),
    ),
  )

  const loadedLangs = highlighter.getLoadedLanguages()
  expect(loadedLangs).toContain('javascript')
  expect(loadedLangs).toContain('python')
  expect(loadedLangs).toContain('html')

  const html = highlighter.codeToHtml(markdownWithEmbedded, {
    lang: 'markdown',
    theme: 'nord',
  })

  // Verify embedded code blocks are highlighted
  expect(html).toMatch(/style="[^"]*color:[^"]*"/)
})

it('fine-grained bundle - custom shorthands with auto-loading', async () => {
  // Create a bundled highlighter with custom languages
  const bundledLanguages = {
    javascript: () => import('@shikijs/langs/javascript'),
    python: () => import('@shikijs/langs/python'),
    html: () => import('@shikijs/langs/html'),
    markdown: () => import('@shikijs/langs/markdown'),
  }

  const bundledThemes = {
    nord: () => import('@shikijs/themes/nord'),
  }

  const createHighlighter = createdBundledHighlighter({
    langs: bundledLanguages,
    themes: bundledThemes,
    engine: () => createOnigurumaEngine(import('shiki/wasm')),
  })

  // Create shorthands with auto-loading
  const { codeToHtml, getSingletonHighlighter } = createSingletonShorthands(
    createHighlighter,
    { guessEmbeddedLanguages },
  )

  // Initially no languages loaded
  const initialHighlighter = await getSingletonHighlighter()
  expect(initialHighlighter.getLoadedLanguages()).toEqual([])

  // Use the shorthand - it should auto-load embedded languages
  const html = await codeToHtml(markdownWithEmbedded, {
    lang: 'markdown',
    theme: 'nord',
  })

  // Check that highlighter now has all languages loaded
  const finalHighlighter = await getSingletonHighlighter()
  const loadedLangs = finalHighlighter.getLoadedLanguages()

  expect(loadedLangs).toContain('markdown')
  expect(loadedLangs).toContain('javascript')
  expect(loadedLangs).toContain('python')
  expect(loadedLangs).toContain('html')

  // Verify highlighting worked
  expect(html).toMatch(/style="[^"]*color:[^"]*"/)
})

it('guessEmbeddedLanguages - detects markdown code blocks', () => {
  const code = '```js\ncode\n```\n~~~python\ncode\n~~~'
  const langs = guessEmbeddedLanguages(code, 'markdown')

  expect(langs).toContain('js')
  expect(langs).toContain('python')
})

it('guessEmbeddedLanguages - detects HTML lang attributes', () => {
  const code = '<script lang="ts">code</script><style lang="scss">code</style>'
  const langs = guessEmbeddedLanguages(code, 'vue')

  expect(langs).toContain('ts')
  expect(langs).toContain('scss')
})

it('guessEmbeddedLanguages - only returns bundled languages when highlighter provided', async () => {
  // Create a bundled highlighter with only specific languages
  const bundledLanguages = {
    javascript: () => import('@shikijs/langs/javascript'),
    typescript: () => import('@shikijs/langs/typescript'),
    js: () => import('@shikijs/langs/javascript'),
    ts: () => import('@shikijs/langs/typescript'),
  }

  const createHighlighter = createdBundledHighlighter({
    langs: bundledLanguages,
    themes: { nord: () => import('@shikijs/themes/nord') },
    engine: () => createOnigurumaEngine(import('shiki/wasm')),
  })

  const highlighter = await createHighlighter({
    langs: ['javascript', 'typescript'],
    themes: ['nord'],
  })

  const code = '```js\ncode\n```\n```python\ncode\n```\n```ts\ncode\n```'
  const langs = guessEmbeddedLanguages(code, 'markdown', highlighter)

  // Should include js and ts (bundled) but not python (not bundled)
  expect(langs).toContain('js')
  expect(langs).toContain('ts')
  expect(langs).not.toContain('python')
})
