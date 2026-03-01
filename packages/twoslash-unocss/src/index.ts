import type { UserConfig } from '@unocss/core'
import type { NodeHover, NodeWithoutPosition, TwoslashGenericResult } from 'twoslash-protocol'
import { createGenerator } from '@unocss/core'
import { createPositionConverter, resolveNodePositions } from 'twoslash-protocol'

export interface CreateTwoslashUnoCSSOptions {
  /**
   * UnoCSS config used for generating styles.
   *
   * Provide at least one preset (e.g. `presetUno()`) for utility
   * resolution to work.
   *
   * @example
   * ```ts
   * import presetUno from '@unocss/preset-uno'
   *
   * const twoslasher = createTwoslasher({
   *   config: {
   *     presets: [presetUno()],
   *   },
   * })
   * ```
   */
  config?: UserConfig

  /**
   * Pattern used to split code into tokens that may be UnoCSS utilities.
   *
   * Defaults to splitting on whitespace and common quote characters.
   *
   * @default /[\s'"`]+/
   */
  splitPattern?: RegExp
}

export type TwoslashUnoCSSFunction = (code: string, extension?: string) => Promise<TwoslashGenericResult>

/**
 * Create a twoslash-like runner backed by UnoCSS.
 *
 * For every utility-class token found in the input code, the runner
 * generates the corresponding CSS via `@unocss/core` and returns a
 * hover node that Shiki can render as an inline popup.
 *
 * Since UnoCSS is async, the returned function is async as well.
 * You can use the result directly or feed it into
 * `createTransformerFactory` from `@shikijs/twoslash/core` by
 * pre-resolving before highlighting.
 */
export function createTwoslasher(options: CreateTwoslashUnoCSSOptions = {}): TwoslashUnoCSSFunction {
  const {
    config = {},
    splitPattern = /[\s'"`]+/,
  } = options

  let unoPromise: ReturnType<typeof createGenerator> | undefined

  return async (code: string, _extension?: string): Promise<TwoslashGenericResult> => {
    if (!unoPromise)
      unoPromise = createGenerator(config)
    const uno = await unoPromise
    const pc = createPositionConverter(code)

    // Collect whitespace-separated tokens and their positions
    const tokens: { value: string, start: number }[] = []
    let offset = 0

    for (const part of code.split(splitPattern)) {
      if (!part.length)
        continue

      const idx = code.indexOf(part, offset)
      if (idx !== -1) {
        tokens.push({ value: part, start: idx })
        offset = idx + part.length
      }
    }

    if (!tokens.length) {
      return { code, nodes: [] }
    }

    // Generate CSS for all tokens at once to determine which are valid
    const { matched } = await uno.generate(
      tokens.map(t => t.value).join(' '),
      { preflights: false },
    )

    // Build hover nodes for each matched token
    const raws: NodeWithoutPosition[] = []

    for (const token of tokens) {
      if (!matched.has(token.value))
        continue

      const result = await uno.generate(token.value, { preflights: false })
      const css = result.css.trim()
      if (!css)
        continue

      const node: Omit<NodeHover, 'line' | 'character'> = {
        type: 'hover',
        text: css,
        target: token.value,
        start: token.start,
        length: token.value.length,
      }
      raws.push(node)
    }

    const nodes = resolveNodePositions(raws, code)
      .filter(n => n.line < pc.lines.length)

    return { code, nodes }
  }
}
