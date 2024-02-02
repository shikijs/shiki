import { describe, expect, it, vi } from 'vitest'
import { codeToHtml } from '../src'

const style = `
<style>
.highlighted {
  background-color: #ff000050;
  display: inline;
}
.highlighted-body {
  background-color: #8883;
}
</style>`

const code = `/**
 * Get highlighted code in HTML.
 */
export function codeToHtml(
  internal: ShikiInternal,
  code: string,
  options: CodeToHastOptions,
): string {
  let result = hastToHtml(codeToHast(internal, code, options, context))
  return result
}
`

describe('decorations', () => {
  it('works', async () => {
    const transformMock = vi.fn()

    const html = await codeToHtml(code, {
      theme: 'vitesse-light',
      lang: 'ts',
      decorations: [
        // The `e` letter in `export` is highlighted.
        // Testing decorations that break tokens.
        {
          start: { line: 3, character: 0 },
          end: { line: 3, character: 1 },
          tagName: 'div',
          properties: { class: 'highlighted' },
        },
        // The space below `export` is highlighted.
        // Testing decorations with whitespace.
        {
          start: { line: 4, character: 1 },
          end: { line: 4, character: 2 },
          tagName: 'div',
          properties: { class: 'highlighted' },
        },
        // The space combined with `co` in `code` is highlighted.
        // Testing decorations with multiple tokens.
        {
          start: { line: 5, character: 1 },
          end: { line: 5, character: 4 },
          properties: { class: 'highlighted', style: 'filter: invert(1)' },
        },
        // The starting comment
        // Testing indexed offsets
        {
          start: 0,
          end: 20,
          properties: { class: 'highlighted' },
        },
        // The function body
        // Testing decorations that span multiple lines.
        {
          start: { line: 7, character: 10 },
          end: { line: 10, character: 1 },
          properties: { class: 'highlighted-body' },
          transform: transformMock,
        },
        // "hastToHtml"
        // Testing nested decorations.
        {
          start: { line: 8, character: 15 },
          end: { line: 8, character: 25 },
          properties: { class: 'highlighted' },
        },
      ],
    })

    expect(transformMock).toBeCalledTimes(4)

    expect(style + html)
      .toMatchFileSnapshot('./out/decorations/basic.html')
  })
})

describe('decorations errors', () => {
  it('throws when start is higher than end', async () => {
    expect(async () => {
      await codeToHtml(code, {
        theme: 'vitesse-light',
        lang: 'ts',
        decorations: [
          { start: 10, end: 0 },
        ],
      })
    }).rejects
      .toThrowErrorMatchingInlineSnapshot(`[ShikiError: Invalid decoration range: {"line":1,"character":6,"offset":10} - {"line":0,"character":0,"offset":0}]`)
  })

  it('throws when decorations intersect', async () => {
    expect(async () => {
      await codeToHtml(code, {
        theme: 'vitesse-light',
        lang: 'ts',
        decorations: [
          { start: 0, end: 10 },
          { start: 5, end: 15 },
        ],
      })
    }).rejects
      .toThrowErrorMatchingInlineSnapshot(`[ShikiError: Decorations {"line":0,"character":0,"offset":0} and {"line":1,"character":1,"offset":5} intersect.]`)
  })

  it('throws when lines overflow', async () => {
    expect(async () => {
      await codeToHtml(code, {
        theme: 'vitesse-light',
        lang: 'ts',
        decorations: [
          { start: { line: 100, character: 0 }, end: { line: 100, character: 1 } },
        ],
      })
    }).rejects
      .toThrowErrorMatchingInlineSnapshot(`[TypeError: Cannot read properties of undefined (reading 'length')]`)
  })

  it('throws when chars overflow', async () => {
    expect(async () => {
      await codeToHtml(code, {
        theme: 'vitesse-light',
        lang: 'ts',
        decorations: [
          { start: { line: 0, character: 0 }, end: { line: 0, character: 10 } },
        ],
      })
    }).rejects
      .toThrowErrorMatchingInlineSnapshot(`[ShikiError: Failed to find end index for decoration {"line":0,"character":10,"offset":10}]`)
  })
})
