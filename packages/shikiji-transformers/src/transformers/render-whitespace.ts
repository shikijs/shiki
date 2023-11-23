import type { ShikijiTransformer } from 'shikiji'
import { addClassToHast } from 'shikiji'
import type { Element } from 'hast'

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
   * @default all positions
   */
  positions?: {
    startOfLine?: boolean
    endOfLine?: boolean
    inline?: boolean
  }
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

  const keys = Object.keys(classMap)

  // TODO: support `positions`

  return {
    name: 'shikiji-transformers:render-whitespace',
    root(root) {
      const pre = root.children[0] as Element
      const code = pre.children[0] as Element
      code.children.forEach((line) => {
        if (line.type !== 'element')
          return
        const first = line.children[0]
        if (!first || first.type !== 'element')
          return
        const textNode = first.children[0]
        if (!textNode || textNode.type !== 'text')
          return
        line.children = line.children.flatMap((token) => {
          if (token.type !== 'element')
            return token
          const node = token.children[0]
          if (node.type !== 'text' || !node.value)
            return token

          // Split by whitespaces
          const parts = node.value.split(/([ \t])/).filter(i => i.length)
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
