import type { ShikijiTransformer } from 'shikiji'

/**
 * Remove line breaks between lines.
 * Useful when you override `display: block` to `.line` in CSS.
 */
export function transformerRemoveLineBreak(): ShikijiTransformer {
  return {
    name: 'shikiji-transformers:remove-line-break',
    code(code) {
      code.children = code.children.filter(line => !(line.type === 'text' && line.value === '\n'))
    },
  }
}
