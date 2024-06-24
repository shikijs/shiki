import type { ShikiTransformer } from 'shiki'

/**
 * Remove notation escapes.
 * Useful when you want to write `// [!code` in markdown.
 * If you process `// [\!code ...]` expression, you can get `// [!code ...]` in the output.
 */
export function transformerRemoveNotationEscape(): ShikiTransformer {
  return {
    name: '@shikijs/transformers:remove-notation-escape',
    postprocess(code) {
      return code.replace(/\[\\!code/g, '[!code')
    },
  }
}
