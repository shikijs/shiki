import * as shikiLegacy from 'shiki-legacy'
import { expect, it } from 'vitest'
import * as shiki from '../src/index'

it('run', async () => {
  const s = await shikiLegacy.getHighlighter({
    theme: 'nord',
    langs: ['javascript'],
  })

  const sj = await shiki.getHighlighter({
    theme: 'nord',
    langs: ['javascript'],
  })

  expect(s.getLoadedThemes()).toEqual(sj.getLoadedThemes())
  // expect(s.getLoadedLanguages()).toEqual(sj.getLoadedLanguages())

  expect(sj.codeToThemedTokens('const a = 1', 'javascript', 'nord', { includeExplanation: false }))
    .toEqual(s.codeToThemedTokens('const a = 1', 'javascript', 'nord', { includeExplanation: false }))

  s.codeToHtml('const a = 1', 'javascript')
  sj.codeToHtml('const a = 1', 'javascript')
  s.codeToHtml('const a = 1', 'javascript', 'nord')
  sj.codeToHtml('const a = 1', 'javascript', 'nord')

  s.codeToHtml('const a = 1', { lang: 'javascript' })
  sj.codeToHtml('const a = 1', { lang: 'javascript' })

  s.ansiToHtml('const a = 1', { theme: 'nord' })
  sj.ansiToHtml('const a = 1', { theme: 'nord' })

  const shikiLegacyKeys = Object.keys(s)
  const shikiKeys = Object.keys(sj)
  const keysDiff = shikiLegacyKeys.filter(k => !shikiKeys.includes(k))

  expect.soft(keysDiff).toMatchInlineSnapshot(`[]`)

  const shikiLegacyExports = Object.keys(shikiLegacy)
  const shikiExports = Object.keys(shiki)
  const exportsDiff = shikiLegacyExports.filter(k => !shikiExports.includes(k))

  expect.soft(exportsDiff).toMatchInlineSnapshot(`
    [
      "FontStyle",
      "renderToHtml",
    ]
  `)
})
