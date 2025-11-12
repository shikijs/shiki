import type { ShikiTransformer } from '@shikijs/types'
import type { Element } from 'hast'

export interface TransformerRenderIndentGuidesOptions {
  indent?: number | false
}

/**
 * Render indentations as separate tokens.
 * Apply with CSS, it can be used to render indent guides visually.
 */
export function transformerRenderIndentGuides(
  options: TransformerRenderIndentGuidesOptions = {},
): ShikiTransformer {
  return {
    name: '@shikijs/transformers:render-indent-guides',
    code(hast) {
      const indent = Number(
        this.options.meta?.indent
        ?? this.options.meta?.__raw?.match(/\{indent:(\d+|false)\}/)?.[1]
        ?? options.indent
        ?? 2,
      )

      if (Number.isNaN(indent) || indent <= 0) {
        return hast
      }
      const indentRegex = new RegExp(` {${indent}}| {0,${indent - 1}}\t| {1,}$`, 'g')

      const emptyLines: [Element, number][] = []
      let level = 0

      for (const line of hast.children) {
        if (line.type !== 'element') {
          continue
        }

        const first = line.children[0]
        if (first?.type !== 'element' || first?.children[0]?.type !== 'text') {
          emptyLines.push([line, level])
          continue
        }

        const text = first.children[0]
        const blanks = text.value.split(/[^ \t]/, 1)[0]

        const ranges: [number, number][] = []
        for (const match of blanks.matchAll(indentRegex)) {
          const start = match.index
          const end = start + match[0].length
          ranges.push([start, end])
        }

        for (const [line, level] of emptyLines) {
          line.children.unshift(...Array.from({ length: Math.min(ranges.length, level + 1) }, (_, i) => ({
            type: 'element',
            tagName: 'span',
            properties: {
              class: 'indent',
              style: `--indent-offset: ${i * indent}ch;`,
            },
            children: [],
          } satisfies Element)))
        }
        emptyLines.length = 0
        level = ranges.length

        if (ranges.length) {
          line.children.unshift(
            ...ranges.map(([start, end]) => ({
              type: 'element',
              tagName: 'span',
              properties: {
                class: 'indent',
              },
              children: [{
                type: 'text',
                value: text.value.slice(start, end),
              }],
            } satisfies Element)),
          )
          text.value = text.value.slice(ranges.at(-1)![1])
        }
      }
      return hast
    },
  }
}
