import type { Element } from 'hast'
import { describe, expect, it } from 'vitest'
import { parseComments } from '../src/shared/parse-comments'

describe('parseComments multi-token handling', () => {
  it('handles multi-token comments where comment is split across tokens', () => {
    // Simulate how rose-pine theme splits "// [!code --]" into separate tokens
    const lines: Element[] = [{
      type: 'element',
      tagName: 'span',
      properties: { class: 'line' },
      children: [
        {
          type: 'element',
          tagName: 'span',
          properties: {},
          children: [{ type: 'text', value: 'const a = 1 ' }],
        },
        {
          type: 'element',
          tagName: 'span',
          properties: {},
          children: [{ type: 'text', value: '//' }],
        },
        {
          type: 'element',
          tagName: 'span',
          properties: {},
          children: [{ type: 'text', value: ' [!code --]' }],
        },
      ],
    }]

    const result = parseComments(lines, false, 'v3')

    expect(result).toHaveLength(1)
    expect(result[0].info[1]).toBe(' [!code --]')
    expect(result[0].additionalTokens).toHaveLength(1)
  })

  it('handles case where previous token does not contain comment prefix', () => {
    const lines: Element[] = [{
      type: 'element',
      tagName: 'span',
      properties: { class: 'line' },
      children: [
        {
          type: 'element',
          tagName: 'span',
          properties: {},
          children: [{ type: 'text', value: 'const a = 1' }],
        },
        {
          type: 'element',
          tagName: 'span',
          properties: {},
          children: [{ type: 'text', value: ' [!code --]' }],
        },
      ],
    }]

    const result = parseComments(lines, false, 'v3')

    expect(result).toHaveLength(0)
  })
})
