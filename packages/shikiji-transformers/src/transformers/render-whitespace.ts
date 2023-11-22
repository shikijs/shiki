import type { ShikijiTransformer } from 'shikiji'
import { addClassToHast } from 'shikiji'

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

  // TODO: support `positions`

  return {
    name: 'shikiji-transformers:render-whitespace',
    line(node) {
      const first = node.children[0]
      if (!first || first.type !== 'element')
        return
      const textNode = first.children[0]
      if (!textNode || textNode.type !== 'text')
        return
      node.children = node.children.flatMap((child) => {
        if (child.type !== 'element')
          return child
        const node = child.children[0]
        if (node.type !== 'text' || !node.value)
          return child

        // Split by whitespaces
        const parts = node.value.split(/([ \t])/).filter(i => i.length)
        if (parts.length <= 1)
          return child

        return parts.map((part) => {
          const clone = {
            ...child,
            properties: { ...child.properties },
          }
          clone.children = [{ type: 'text', value: part }]
          if (part in classMap) {
            addClassToHast(clone, classMap[part])
            delete clone.properties.style
          }
          return clone
        })
      })
    },
  }
}
