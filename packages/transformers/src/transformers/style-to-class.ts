import type { ShikiTransformer } from '@shikijs/types'

export interface TransformerStyleToClassOptions {
  /**
   * Prefix for class names.
   * @default '__shiki_'
   */
  classPrefix?: string
  /**
   * Suffix for class names.
   * @default ''
   */
  classSuffix?: string
  /**
   * Callback to replace class names.
   * @default (className) => className
   */
  classReplacer?: (className: string) => string
}

export interface ShikiTransformerStyleToClass extends ShikiTransformer {
  getClassRegistry: () => Map<string, Record<string, string> | string>
  getCSS: () => string
  clearRegistry: () => void
}

/**
 * Convert inline `style` attributes on tokens to equivalent CSS class names.
 * Use `getCSS()` on the returned transformer to retrieve the generated stylesheet.
 */
export function transformerStyleToClass(options: TransformerStyleToClassOptions = {}): ShikiTransformerStyleToClass {
  const {
    classPrefix = '__shiki_',
    classSuffix = '',
    classReplacer = (className: string) => className,
  } = options

  const classToStyle = new Map<string, Record<string, string> | string>()

  function stringifyStyle(style: Record<string, string>): string {
    return Object.entries(style)
      .map(([key, value]) => `${key}:${value}`)
      .join(';')
  }

  function registerStyle(style: Record<string, string> | string): string {
    const str = typeof style === 'string'
      ? style
      : stringifyStyle(style)
    let className = classPrefix + cyrb53(str) + classSuffix
    className = classReplacer(className)
    if (!classToStyle.has(className)) {
      classToStyle.set(
        className,
        typeof style === 'string'
          ? style
          : { ...style },
      )
    }
    return className
  }

  return {
    name: '@shikijs/transformers:style-to-class',
    pre(t) {
      if (!t.properties.style)
        return
      const className = registerStyle(t.properties.style as string)
      delete t.properties.style
      this.addClassToHast(t, className)
    },
    tokens(lines) {
      for (const line of lines) {
        for (const token of line) {
          if (!token.htmlStyle)
            continue

          const className = registerStyle(token.htmlStyle)
          token.htmlStyle = {}
          token.htmlAttrs ||= {}
          if (!token.htmlAttrs.class)
            token.htmlAttrs.class = className
          else
            token.htmlAttrs.class += ` ${className}`
        }
      }
    },
    getClassRegistry() {
      return classToStyle
    },
    getCSS() {
      let css = ''
      for (const [className, style] of classToStyle.entries()) {
        css += `.${className}{${typeof style === 'string' ? style : stringifyStyle(style)}}`
      }
      return css
    },
    clearRegistry() {
      classToStyle.clear()
    },
  }
}

/**
 * A simple hash function.
 *
 * @see https://stackoverflow.com/a/52171480
 */
function cyrb53(str: string, seed = 0): string {
  let h1 = 0xDEADBEEF ^ seed
  let h2 = 0x41C6CE57 ^ seed
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)

  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36).slice(0, 6)
}
