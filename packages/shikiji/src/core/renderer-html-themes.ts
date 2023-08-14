import type { HtmlRendererOptions, ThemeRegisteration, ThemedToken } from '../types'
import { renderToHtml } from './renderer-html'

/**
 * Break tokens from multiple themes into same tokenization.
 *
 * For example, given two themes that tokenize `console.log("hello")` as:
 *
 * - `console . log (" hello ")` (6 tokens)
 * - `console .log ( "hello" )` (5 tokens)
 *
 * This function will return:
 *
 * - `console . log ( " hello " )` (8 tokens)
 * - `console . log ( " hello " )` (8 tokens)
 */
export function syncThemesTokenization(...themes: ThemedToken[][][]) {
  const outThemes = themes.map<ThemedToken[][]>(() => [])
  const count = themes.length

  for (let i = 0; i < themes[0].length; i++) {
    const lines = themes.map(t => t[i])

    const outLines = outThemes.map<ThemedToken[]>(() => [])
    outThemes.forEach((t, i) => t.push(outLines[i]))

    const indexes = lines.map(() => 0)
    const current = lines.map(l => l[0])

    while (current.every(t => t)) {
      const minLength = Math.min(...current.map(t => t.content.length))

      for (let n = 0; n < count; n++) {
        const token = current[n]
        if (token.content.length === minLength) {
          outLines[n].push(token)
          indexes[n] += 1
          current[n] = lines[n][indexes[n]]
        }
        else {
          outLines[n].push({
            ...token,
            content: token.content.slice(0, minLength),
          })
          current[n] = {
            ...token,
            content: token.content.slice(minLength),
          }
        }
      }
    }
  }

  return outThemes
}

export function renderToHtmlThemes(
  themeTokens: [string, string, ThemedToken[][]][],
  themeRegs: ThemeRegisteration[],
  cssVariablePrefix = '--shiki-',
  defaultColor = true,
  options: HtmlRendererOptions = {},
) {
  const themeMap = themeTokens.map(t => t[2])
  const merged: ThemedToken[][] = []
  for (let i = 0; i < themeMap[0].length; i++) {
    const lineMap = themeMap.map(t => t[i])
    const lineout: any[] = []
    merged.push(lineout)
    for (let j = 0; j < lineMap[0].length; j++) {
      const tokenMap = lineMap.map(t => t[j])
      const colors = tokenMap.map((t, idx) => `${idx === 0 && defaultColor ? '' : `${cssVariablePrefix + themeTokens[idx][0]}:`}${t.color || 'inherit'}`).join(';')
      lineout.push({
        ...tokenMap[0],
        color: colors,
        htmlStyle: defaultColor ? undefined : colors,
      })
    }
  }

  const fg = options.fg || themeTokens.map((t, idx) => (idx === 0 && defaultColor ? '' : `${cssVariablePrefix + t[0]}:`) + themeRegs[idx].fg).join(';')
  const bg = options.bg || themeTokens.map((t, idx) => (idx === 0 && defaultColor ? '' : `${cssVariablePrefix + t[0]}-bg:`) + themeRegs[idx].bg).join(';')
  return renderToHtml(merged, {
    fg,
    bg,
    themeName: `shiki-themes ${themeRegs.map(t => t.name).join(' ')}`,
    rootStyle: defaultColor ? undefined : [fg, bg].join(';'),
    ...options,
  })
}
