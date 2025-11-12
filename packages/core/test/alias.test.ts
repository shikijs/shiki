import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript'
import { createHighlighter } from 'shiki'
import { it } from 'vitest'

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
