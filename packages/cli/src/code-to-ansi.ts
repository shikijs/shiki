import type { BundledLanguage, BundledTheme } from 'shiki'
import { FontStyle } from '@shikijs/vscode-textmate'
import { Ansis } from 'ansis'
import { codeToTokensBase, getSingletonHighlighter } from 'shiki'
import { hexApplyAlpha } from './colors'

/**
 * The ANSI color level of the emitted escape codes, matching the levels
 * understood by `ansis`: `0` no color, `1` basic (16 colors), `2` 256 colors,
 * `3` truecolor (24-bit).
 */
export type ANSIColorLevel = 0 | 1 | 2 | 3

export interface CodeToANSIOptions {
  /**
   * The color level to emit.
   *
   * Defaults to `3` (truecolor), so the result does not depend on the
   * environment this code happens to run in.
   */
  colorLevel?: ANSIColorLevel
}

/**
 * Converts code to a string containing ANSI escape codes.
 *
 * The color level is explicit and does not depend on the current environment,
 * as the result is not necessarily printed to the terminal that runs this
 * code. Pass {@link CodeToANSIOptions.colorLevel} to target a different level.
 */
export async function codeToANSI(code: string, lang: BundledLanguage, theme: BundledTheme, options: CodeToANSIOptions = {}): Promise<string> {
  // The default `ansis` instance infers color support from the environment
  // (`NO_COLOR`, `FORCE_COLOR`, TTY detection, ...), which silently strips all
  // highlighting when it guesses "wrong". Use an instance with an explicit
  // level instead.
  const ansi = new Ansis(options.colorLevel ?? 3)

  let output = ''

  const lines = await codeToTokensBase(code, {
    lang,
    theme,
  })

  const highlight = await getSingletonHighlighter()
  const themeReg = highlight.getTheme(theme)

  for (const line of lines) {
    for (const token of line) {
      let text = token.content
      const color = token.color || themeReg.fg
      if (color)
        text = ansi.hex(hexApplyAlpha(color, themeReg.type))(text)
      if (token.fontStyle) {
        if (token.fontStyle & FontStyle.Bold)
          text = ansi.bold(text)
        if (token.fontStyle & FontStyle.Italic)
          text = ansi.italic(text)
        if (token.fontStyle & FontStyle.Underline)
          text = ansi.underline(text)
        if (token.fontStyle & FontStyle.Strikethrough)
          text = ansi.strikethrough(text)
      }
      output += text
    }
    output += '\n'
  }

  return output
}
