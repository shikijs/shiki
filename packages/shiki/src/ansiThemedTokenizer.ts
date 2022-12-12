import Anser, { AnserJsonEntry } from 'anser'
import { FontStyle } from './stackElementMetadata'
import { IThemedToken } from './themedTokenizer'
import { IShikiTheme } from './types'

export function tokenizeAnsiWithTheme(theme: IShikiTheme, fileContents: string): IThemedToken[][] {
  const ansiTokens = Anser.ansiToJson(fileContents, { use_classes: true })

  const lines: IThemedToken[][] = []
  let currentLine: IThemedToken[] = []

  for (const ansiToken of ansiTokens) {
    const ansiTokenLines = ansiToken.content.split('\n')
    for (let i = 0; i < ansiTokenLines.length; i++) {
      if (i > 0) {
        lines.push(currentLine)
        currentLine = []
      }
      currentLine.push({
        content: ansiTokenLines[i],
        color: getThemeColor(theme, ansiToken),
        fontStyle: getFontStyle(ansiToken)
      })
    }
  }

  return lines
}

function getThemeColor(theme: IShikiTheme, ansiToken: AnserJsonEntry) {
  const colorType = ansiToken.decorations.includes('reverse') ? 'bg' : 'fg'

  if (ansiToken[colorType] === null) {
    return theme[colorType]
  }

  const colorNameCamel = ansiToken[colorType].replace(/-([a-z])/g, g => g[1].toUpperCase())
  return theme.colors[`terminal.${colorNameCamel}`]
}

function getFontStyle(ansiToken: AnserJsonEntry): FontStyle {
  let fontStyle: FontStyle = FontStyle.None

  // TODO: support strikethrough and hidden?
  for (const decoration of ansiToken.decorations) {
    switch (decoration) {
      case 'bold':
        fontStyle |= FontStyle.Bold
        break
      case 'dim':
        fontStyle &= ~FontStyle.Bold
        break
      case 'italic':
        fontStyle |= FontStyle.Italic
        break
      case 'underline':
        fontStyle |= FontStyle.Underline
        break
    }
  }

  return fontStyle
}
