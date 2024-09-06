import * as shikiLegacy from 'shiki-legacy'
import { expect, it } from 'vitest'
import * as shiki from '../src/index'

it('getBackgroundColor', async () => {
  const s = await shikiLegacy.getHighlighter({
    theme: 'nord',
    langs: ['javascript'],
  })

  const sj = await shiki.getHighlighter({
    theme: 'nord',
    langs: ['javascript'],
  })

  expect(s.getBackgroundColor('nord')).toMatchInlineSnapshot(`"#2e3440ff"`)
  expect(sj.getBackgroundColor('nord')).toMatchInlineSnapshot(`"#2e3440ff"`)

  expect(s.getForegroundColor('nord')).toMatchInlineSnapshot(`"#d8dee9ff"`)
  expect(sj.getForegroundColor('nord')).toMatchInlineSnapshot(`"#d8dee9ff"`)
})
