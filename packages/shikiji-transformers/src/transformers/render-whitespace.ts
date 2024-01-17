import type { ShikijiTransformer } from 'shikiji'
import { addClassToHast } from 'shikiji'
import type { Element } from 'hast'
import { splitSpaces } from '../shared/utils'

export interface TransformerRenderWhitespaceOptions {
  /**
   * Class for tab
   *
   * @default 'tab'
   */
  classTab?: string
  /**
   * Class for space
   *
   * @default 'space'
   */
  classSpace?: string

  /**
   * Position of rendered whitespace
   * @default all position
   */
  position?: 'all' | 'boundary' | 'trailing'
}

/**
 * Render whitespaces as separate tokens.
 * Apply with CSS, it can be used to render tabs and spaces visually.
 */
export function transformerRenderWhitespace(
  options: TransformerRenderWhitespaceOptions = {},
): ShikijiTransformer {
  const classMap: Record<string, string> = {
    ' ': options.classSpace ?? 'space',
    '\t': options.classTab ?? 'tab',
  }

  const position = options.position ?? 'all'
  const keys = Object.keys(classMap)

  return {
    name: 'shikiji-transformers:render-whitespace',
    // We use `root` hook here to ensure it runs after all other transformers
    root(root) {
      const pre = root.children[0] as Element
      const code = pre.children[0] as Element
      code.children.forEach((line) => {
        if (line.type !== 'element')
          return
        const elements = line.children.filter(token => token.type === 'element')
        const last = elements.length - 1
        line.children = line.children.flatMap((token) => {
          if (token.type !== 'element')
            return token
          const index = elements.indexOf(token)
          if (position === 'boundary' && index !== 0 && index !== last)
            return token
          if (position === 'trailing' && index !== last)
            return token

          const node = token.children[0]
          if (node.type !== 'text' || !node.value)
            return token

          // Split by whitespaces
          const parts = splitSpaces(
            node.value.split(/([ \t])/).filter(i => i.length),
            (position === 'boundary' && index === last && last !== 0)
              ? 'trailing'
              : position,
            position !== 'trailing',
          )
          if (parts.length <= 1)
            return token

          return parts.map((part) => {
            const clone = {
              ...token,
              properties: { ...token.properties },
            }
            clone.children = [{ type: 'text', value: part }]
            if (keys.includes(part)) {
              addClassToHast(clone, classMap[part])
              delete clone.properties.style
            }
            return clone
          })
        })
      },
      )
    },
  }
}
