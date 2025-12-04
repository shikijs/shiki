import type { Element, Root } from 'hast'
import { describe, expect, it } from 'vitest'
import { transformerRenderWhitespace } from '../src/transformers/render-whitespace'

describe('render-whitespace-newline unit', () => {
  it('should inject newline spans', () => {
    const transformer = transformerRenderWhitespace({
      classNewline: 'newline',
    })

    // Mock HAST tree for:
    // <pre><code>line1\nline2</code></pre>
    // But shiki splits lines, so it looks more like:
    // <pre><code>
    //   <span class="line">line1</span>
    //   <span class="line">line2</span>
    // </code></pre>

    const line1: Element = {
      type: 'element',
      tagName: 'span',
      properties: { class: 'line' },
      children: [{ type: 'text', value: 'line1' }],
    }

    const line2: Element = {
      type: 'element',
      tagName: 'span',
      properties: { class: 'line' },
      children: [{ type: 'text', value: 'line2' }],
    }

    const code: Element = {
      type: 'element',
      tagName: 'code',
      properties: {},
      children: [line1, line2],
    }

    const pre: Element = {
      type: 'element',
      tagName: 'pre',
      properties: {},
      children: [code],
    }

    const root: Root = {
      type: 'root',
      children: [pre],
    }

    // @ts-expect-error - mock context
    transformer.root.call({ addClassToHast: () => {} }, root)

    // Check line1 children
    expect(line1.children).toHaveLength(2)
    expect(line1.children[1]).toEqual({
      type: 'element',
      tagName: 'span',
      properties: { class: 'newline' },
      children: [{ type: 'text', value: '\n' }],
    })

    // Check line2 children (should NOT have newline as it is the last line)
    expect(line2.children).toHaveLength(1)
  })
})
