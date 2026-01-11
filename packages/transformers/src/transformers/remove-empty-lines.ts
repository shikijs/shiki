import type { ShikiTransformer } from '@shikijs/types'

/**
 * Remove empty lines from the code.
 */
export function transformerRemoveEmptyLines(): ShikiTransformer {
  return {
    name: '@shikijs/transformers:remove-empty-lines',
    code(code) {
      code.children = code.children.filter((line) => {
        if (line.type !== 'element')
          return true
        const isAllWhitespace = line.children.every((token) => {
          if (token.type !== 'text')
            return false
          return !token.value.trim()
        })
        return !isAllWhitespace
      })
    },
  }
}
