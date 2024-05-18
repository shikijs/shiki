import { createAnsiSequenceParser, createColorPalette, namedColors } from 'ansi-sequence-parser'
import type { ThemeRegistrationResolved, ThemedToken, TokenizeWithThemeOptions } from './types'
import { FontStyle } from './types'
import { applyColorReplacements, resolveColorReplacements, splitLines } from './utils'

export function tokenizeAnsiWithTheme(
  theme: ThemeRegistrationResolved,
  fileContents: string,
  options?: TokenizeWithThemeOptions,
): ThemedToken[][] {
  const colorReplacements = resolveColorReplacements(theme, options)
  const lines = splitLines(fileContents)

  const colorPalette = createColorPalette(
    Object.fromEntries(
      namedColors.map(name => [
        name,
        theme.colors?.[`terminal.ansi${name[0].toUpperCase()}${name.substring(1)}`],
      ]),
    ) as any,
  )

  const parser = createAnsiSequenceParser()

  return lines.map(line =>
    parser.parse(line[0]).map((token): ThemedToken => {
      let color: string
      let bgColor: string | undefined
      if (token.decorations.has('reverse')) {
        color = token.background ? colorPalette.value(token.background) : theme.bg
        bgColor = token.foreground ? colorPalette.value(token.foreground) : theme.fg
      }
      else {
        color = token.foreground ? colorPalette.value(token.foreground) : theme.fg
        bgColor = token.background ? colorPalette.value(token.background) : undefined
      }

      color = applyColorReplacements(color, colorReplacements)
      bgColor = applyColorReplacements(bgColor, colorReplacements)

      if (token.decorations.has('dim'))
        color = dimColor(color)

      let fontStyle: FontStyle = FontStyle.None
      if (token.decorations.has('bold'))
        fontStyle |= FontStyle.Bold

      if (token.decorations.has('italic'))
        fontStyle |= FontStyle.Italic

      if (token.decorations.has('underline'))
        fontStyle |= FontStyle.Underline

      return {
        content: token.value,
        offset: line[1], // TODO: more accurate offset? might need to fork ansi-sequence-parser
        color,
        bgColor,
        fontStyle,
      }
    }),
  )
}

/**
 * Adds 50% alpha to a hex color string or the "-dim" postfix to a CSS variable
 */
function dimColor(color: string) {
  const hexMatch = color.match(/#([0-9a-f]{3})([0-9a-f]{3})?([0-9a-f]{2})?/)
  if (hexMatch) {
    if (hexMatch[3]) {
      // convert from #rrggbbaa to #rrggbb(aa/2)
      const alpha = Math.round(Number.parseInt(hexMatch[3], 16) / 2)
        .toString(16)
        .padStart(2, '0')
      return `#${hexMatch[1]}${hexMatch[2]}${alpha}`
    }
    else if (hexMatch[2]) {
      // convert from #rrggbb to #rrggbb80
      return `#${hexMatch[1]}${hexMatch[2]}80`
    }
    else {
      // convert from #rgb to #rrggbb80
      return `#${Array.from(hexMatch[1])
        .map(x => `${x}${x}`)
        .join('')}80`
    }
  }

  const cssVarMatch = color.match(/var\((--[\w-]+-ansi-[\w-]+)\)/)
  if (cssVarMatch)
    return `var(${cssVarMatch[1]}-dim)`

  return color
}
