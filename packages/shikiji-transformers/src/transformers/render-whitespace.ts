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
  const renderStart = position === 'all' || position === 'boundary'
  const renderEnd = position === 'all' || position === 'trailing' || position === 'boundary'
  const renderMiddle = position === 'all'

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
        const total = line.children.length
        line.children = line.children.flatMap((token, idx) => {
          if (token.type !== 'element')
            return token
          if (idx === 0 && !renderStart)
            return token
          if (idx === total - 1 && !renderEnd)
            return token
          if (idx > 0 && idx < total - 1 && !renderMiddle)
            return token

          const node = token.children[0]
          if (node.type !== 'text' || !node.value)
            return token

          // Split by whitespaces
          const parts = mergeSpaces(
            node.value.split(/([ \t])/).filter(i => i.length),
            position,
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

function isSpace(part: string) {
  return part === ' ' || part === '\t'
}

function mergeSpaces(parts: string[], type: 'all' | 'boundary' | 'trailing') {
  if (type === 'all')
    return parts
  let leftCount = 0
  let rightCount = 0
  if (type === 'boundary') {
    for (let i = 0; i < parts.length; i++) {
      if (isSpace(parts[i]))
        leftCount++
      else
        break
    }
  }
  if (type === 'boundary' || type === 'trailing') {
    for (let i = parts.length - 1; i >= 0; i--) {
      if (isSpace(parts[i]))
        rightCount++
      else
        break
    }
  }
  return [
    ...parts.slice(0, leftCount),
    parts.slice(leftCount, parts.length - rightCount).join(''),
    ...parts.slice(parts.length - rightCount),
  ]
}
