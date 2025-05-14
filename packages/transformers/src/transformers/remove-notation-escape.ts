import type { ShikiTransformer } from '@shikijs/types'
import type { ElementContent } from 'hast'

/**
 * Remove notation escapes.
 * Useful when you want to write `// [!code` in markdown.
 * If you process `// [\!code ...]` expression, you can get `// [!code ...]` in the output.
 */
export function transformerRemoveNotationEscape(): ShikiTransformer {
  return {
    name: '@shikijs/transformers:remove-notation-escape',
    code(hast) {
      function replace(node: ElementContent): void {
        if (node.type === 'text') {
          node.value = node.value.replace('\\[!code', '[!code')
        }
        else if ('children' in node) {
          for (const child of node.children) {
            replace(child)
          }
        }
      }

      replace(hast)
      return hast
    },
  }
}
