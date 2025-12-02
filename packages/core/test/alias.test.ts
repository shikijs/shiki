import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript'
import { createHighlighter } from 'shiki'
import { expect, it } from 'vitest'

it('langAlias', async () => {
  const highlighter = await createHighlighter({
    langs: ['javascript'],
    langAlias: {
      mylang: 'javascript',
    },
    themes: ['nord'],
    engine: createJavaScriptRegexEngine(),
  })

  await highlighter.loadLanguage('mylang' as any)
})

it('langAlias for text', async () => {
  const highlighter = await createHighlighter({
    langs: [],
    langAlias: {
      'my-text': 'text',
    },
    themes: ['nord'],
    engine: createJavaScriptRegexEngine(),
  })

  const html = highlighter.codeToHtml('hello world', { lang: 'my-text', theme: 'nord' })
  expect(html).toContain('hello world')
})
