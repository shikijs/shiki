import { expect, it } from 'vitest'
import * as shiki from 'shiki'
import * as shikiji from '../src/index'

it('getBackgroundColor', async () => {
  const s = await shiki.getHighlighter({
    theme: 'nord',
    langs: ['javascript'],
  })

  const sj = await shikiji.getHighlighter({
    theme: 'nord',
    langs: ['javascript'],
  })

  expect(s.getBackgroundColor('nord')).toMatchInlineSnapshot(`"#2e3440ff"`)
  expect(sj.getBackgroundColor('nord')).toMatchInlineSnapshot(`"#2e3440ff"`)

  expect(s.getForegroundColor('nord')).toMatchInlineSnapshot(`"#d8dee9ff"`)
  expect(sj.getForegroundColor('nord')).toMatchInlineSnapshot(`"#d8dee9ff"`)
})
