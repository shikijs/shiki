import type {
  ThemedToken,
  ThemeRegistrationResolved,
  TokenizeWithThemeOptions,
} from '@shikijs/types'

import { FontStyle } from '@shikijs/vscode-textmate'
import { createAnsiSequenceParser, createColorPalette, namedColors } from 'ansi-sequence-parser'

import { applyColorReplacements, resolveColorReplacements, splitLines } from '../utils'

/**
 * Default ANSI palette (VSCode compatible fallbacks)
 * Used when the theme does not define terminal.ansi* colors.
 */
const defaultAnsiColors: Record<string, string> = {
  black: '#000000',
  red: '#cd3131',
  green: '#0DBC79',
  yellow: '#E5E510',
  blue: '#2472C8',
  magenta: '#BC3FBC',
  cyan: '#11A8CD',
  white: '#E5E5E5',

  brightBlack: '#666666',
  brightRed: '#F14C4C',
  brightGreen: '#23D18B',
  brightYellow: '#F5F543',
  brightBlue: '#3B8EEA',
  brightMagenta: '#D670D6',
  brightCyan: '#29B8DB',
  brightWhite: '#FFFFFF',
}

export function tokenizeAnsiWithTheme(
  theme: ThemeRegistrationResolved,
  fileContents: string,
  options?: TokenizeWithThemeOptions,
): ThemedToken[][] {
  const colorReplacements = resolveColorReplacements(theme, options)
  const lines = splitLines(fileContents)

  const ansiPalette = Object.fromEntries(
    namedColors.map((name) => {
      const key = `terminal.ansi${name[0].toUpperCase()}${name.substring(1)}`
      const themeColor = theme.colors?.[key]
      return [name, themeColor || defaultAnsiColors[name]]
    }),
  ) as Record<string, string>

  const colorPalette = createColorPalette(ansiPalette)
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

      if (token.decorations.has('strikethrough'))
        fontStyle |= FontStyle.Strikethrough

      return {
        content: token.value,
        offset: line[1],
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
function dimColor(color: string): string {
  const hexMatch = color.match(/#([0-9a-f]{3,8})/i)
  if (hexMatch) {
    const hex = hexMatch[1]
    if (hex.length === 8) {
      // #rrggbbaa -> #rrggbb(aa/2)
      const alpha = Math
        .round(Number.parseInt(hex.slice(6, 8), 16) / 2)
        .toString(16)
        .padStart(2, '0')
      return `#${hex.slice(0, 6)}${alpha}`
    }
    else if (hex.length === 6) {
      // #rrggbb -> #rrggbb80
      return `#${hex}80`
    }
    else if (hex.length === 4) {
      // #rgba -> #rrggbb(aa/2)
      const r = hex[0]
      const g = hex[1]
      const b = hex[2]
      const a = hex[3]
      const alpha = Math
        .round(Number.parseInt(`${a}${a}`, 16) / 2)
        .toString(16)
        .padStart(2, '0')
      return `#${r}${r}${g}${g}${b}${b}${alpha}`
    }
    else if (hex.length === 3) {
      // #rgb -> #rrggbb80
      const r = hex[0]
      const g = hex[1]
      const b = hex[2]
      return `#${r}${r}${g}${g}${b}${b}80`
    }
  }

  const cssVarMatch = color.match(/var\((--[\w-]+-ansi-[\w-]+)\)/)
  if (cssVarMatch)
    return `var(${cssVarMatch[1]}-dim)`

  return color
}
