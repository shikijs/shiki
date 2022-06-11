import { load, parse } from 'opentype.js'
import type { IThemedToken } from 'shiki'

interface PathRendererOptions {
  /**
   * A monospace font.
   */
  fontFile: string | ArrayBuffer
  /**
   * Default to 16px.
   */
  fontSize?: number
  /**
   * How high should a line be, in relation to `fontSize`. Default to 1.4.
   * Extra spaces are distributed evenly on top/bottom of each line.
   */
  lineHeightToFontSizeRatio?: number
  /**
   * Background color. Default to `#fff`.
   */
  bg?: string
  /**
   * Background corner radius. Default to `4px`.
   */
  bgCornerRadius?: number
  /**
   * How much padding should be left to the left/right in relation to font width. Default to 4.
   */
  bgSideCharPadding?: number
  /**
   * How much padding should be left to the top/bottom in relation to
   * line height (`fontSize * lineHeightToFontSizeRatio`). Default to 2.
   */
  bgVerticalCharPadding?: number
}

export async function getPathRenderer(options: PathRendererOptions) {
  const font =
    typeof options.fontFile === 'string' ? await load(options.fontFile) : parse(options.fontFile)

  if (!font.supported) throw new Error(`The font "${options.fontFile}" is not supported`)

  const fontSize = options.fontSize || 16
  const lineHeightToFontSizeRatio = options.lineHeightToFontSizeRatio || 1.4
  const _bg = options.bg || '#fff'
  const bgCornerRadius = options.bgCornerRadius || 4
  const bgSideCharPadding = options.bgSideCharPadding || 4
  const bgVerticalCharPadding = options.bgVerticalCharPadding || 2

  const singleCharWidth = font.getAdvanceWidth('X', fontSize)
  const lineHeight = fontSize * lineHeightToFontSizeRatio

  return {
    renderToSVG(lines: IThemedToken[][], { bg } = { bg: _bg }) {
      const linePaths: string[] = []
      let longestLineWidth = 0

      for (const [currentLine, line] of lines.entries()) {
        const coloredTokens: string[] = []
        let left = 0

        for (const token of line) {
          const path = font.getPath(token.content, left, fontSize, fontSize)

          path.fill = token.color
          coloredTokens.push(path.toSVG(4))

          left += font.getAdvanceWidth(token.content, fontSize)
          if (left > longestLineWidth) {
            longestLineWidth = left
          }
        }

        linePaths.push(
          `<g transform="translate(${bgSideCharPadding * singleCharWidth}, ${
            lineHeight * (bgVerticalCharPadding + currentLine)
          })">${coloredTokens.join('')}</g>`
        )
      }

      /**
       * longest line + left/right 4 char width
       */
      const bgWidth = longestLineWidth + bgSideCharPadding * 2 * singleCharWidth
      /**
       * all rows + 2 rows top/bot
       */
      const bgHeight = (lines.length + bgVerticalCharPadding * 2) * lineHeight

      return [
        `<svg viewBox="0 0 ${bgWidth} ${bgHeight}" width="${bgWidth}" height="${bgHeight}" xmlns="http://www.w3.org/2000/svg">`,
        `<rect id="bg" fill="${bg}" width="${bgWidth}" height="${bgHeight}" rx="${bgCornerRadius}"></rect>`,
        ...linePaths,
        `</svg>`
      ].join('')
    }
  }
}
