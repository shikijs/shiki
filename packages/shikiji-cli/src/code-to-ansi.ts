import c from 'chalk'
import type { BundledLanguage, BundledTheme } from 'shikiji'
import { FontStyle, codeToThemedTokens, getSingletonHighlighter } from 'shikiji'
import { hexApplyAlpha } from './colors'

export async function codeToANSI(code: string, lang: BundledLanguage, theme: BundledTheme): Promise<string> {
  let output = ''

  const lines = await codeToThemedTokens(code, {
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
        text = c.hex(hexApplyAlpha(color, themeReg.type))(text)
      if (token.fontStyle === FontStyle.Bold)
        text = c.bold(text)
      if (token.fontStyle === FontStyle.Italic)
        text = c.italic(text)
      output += text
    }
    output += '\n'
  }

  return output
}
