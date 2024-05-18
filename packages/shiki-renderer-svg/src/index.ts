import type { ThemedToken } from 'shiki'
import { measureFont } from './measureFont'

interface RenderOptions {
  /**
   * The rendered font family.
   *
   * @default '"Lucida Console", Courier, monospace'
   */
  fontFamily?: string

  /**
   * The rendered font size.
   *
   * @default 16
   */
  fontSize?: number

  /**
   * The svg background color.
   *
   * @default '#eee'
   */
  backgroundColor?: string

  /**
   * The svg border-radius.
   *
   * @default 0
   */
  borderRadius?: number

  /**
   * The text background color when you select text.
   *
   * @default '#b4d5ea'
   */
  selectionbgColor?: string

  /**
   * The font color when you select text.
   *
   * @default ''
   */
  selectionColor?: string

  /**
   * The cursor style when the mouse is placed on the svg text.
   *
   * @default 'default'
   */
  cursor?: string

  /**
   * Svg opacity.
   *
   * @default 1
   */
  opacity?: number

  /**
   * Used for measuring the width and height of the text
   *  when not in browser environment.
   *
   * @default ''
   */
  remoteFontCSSURL?: string
}

type RequiredRenderOptions = Required<RenderOptions>
const defaultRenderOptions: RequiredRenderOptions = {
  fontFamily: '"Lucida Console", Courier, monospace',
  fontSize: 20,
  backgroundColor: '#eee',
  borderRadius: 0,
  opacity: 1,
  remoteFontCSSURL: '',
  cursor: 'default',
  selectionColor: '',
  selectionbgColor: '#b4d5ea',
}

export async function getSVGRenderer(renderOptions: RenderOptions) {
  const options = { ...defaultRenderOptions, ...renderOptions }

  const svgId = getId()
  const styleStr = generateStyle(svgId, options)
  const { width: fontWidth, height: fontHeight } = await measureFont(
    options.fontSize,
    options.fontFamily,
  )

  return {
    renderToSVG(tokenLines: ThemedToken[][]) {
      const [svgWidth, svgHeight] = getAdaptiveWidthAndHeight(
        tokenLines,
        fontWidth,
        fontHeight,
      )

      let svg = `<svg ${svgId} viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`
      svg += styleStr

      const x = Math.floor(fontWidth / 2)
      let y = Math.floor(fontHeight / 4) + fontHeight
      for (const line of tokenLines) {
        if (line.length === 0) {
          svg += `<text x="${x}" y="${y}"><tspan fill="#000">&nbsp;</tspan></text>`
        }
        else {
          svg += `<text x="${x}" y="${y}">`

          for (const token of line) {
            svg += `<tspan fill="${token.color}">${decodeContent(
              token.content!,
            )}</tspan>`
          }

          svg += '</text>'
        }
        y += fontHeight
      }

      svg += '</svg>'

      return svg
    },
  }
}

function generateStyle(svgId: string, options: RequiredRenderOptions) {
  const {
    fontFamily,
    fontSize,
    backgroundColor,
    borderRadius,
    cursor,
    opacity,
    selectionbgColor,
    selectionColor,
  } = options

  // svg css
  let svgStyle = `svg[${svgId}]`
  svgStyle += '{'
  svgStyle += (`font-family:${fontFamily};font-size:${fontSize};`
  + `background-color:${backgroundColor};cursor:${cursor};`)
  if (opacity < 1 && opacity >= 0)
    svgStyle += `opacity:${opacity};`

  if (borderRadius > 0)
    svgStyle += `border-radius:${borderRadius}px;`

  svgStyle += `}`

  // selection css
  let svgStyleSelection = `svg[${svgId}] tspan::selection`
  svgStyleSelection += '{'
  svgStyleSelection += `background-color:${selectionbgColor};`
  if (selectionColor.length > 0)
    svgStyleSelection += `fill:${selectionColor};`

  svgStyleSelection += `}`

  return `<style>${svgStyle + svgStyleSelection}</style>`
}

function getId() {
  return `data-svg-${Math.random().toString(36).substring(2, 9)}`
}

const contentMap = new Map<string, string>([
  [' ', '&nbsp;'],
  ['<', '&lt;'],
  ['>', '&gt;'],
  ['&', '&amp;'],
  ['"', '&quot;'],
  ['\'', '&#39;'],
])

function decodeContent(str: string) {
  let res: string = ''
  for (let i = 0; i < str.length; i++) {
    if (contentMap.has(str[i]))
      res += contentMap.get(str[i])!
    else
      res += str[i]
  }
  return res
}

function getAdaptiveWidthAndHeight(
  tokenLines: ThemedToken[][],
  fontWidth: number,
  fontHeight: number,
) {
  const height = (tokenLines.length + 1) * fontHeight
  const maxCharNum = Math.max(
    ...tokenLines.map(line =>
      line.reduce((acc, val) => acc + val.content!.length, 0),
    ),
  )
  const width = (maxCharNum + 1) * fontWidth
  return [width, height]
}
