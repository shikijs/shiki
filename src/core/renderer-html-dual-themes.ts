import type { HtmlRendererOptions, ThemedToken } from '../types'
import { renderToHtml } from './renderer-html'

export function _syncTwoThemedTokens(tokens1: ThemedToken[][], tokens2: ThemedToken[][]) {
  const out1: ThemedToken[][] = []
  const out2: ThemedToken[][] = []

  for (let i = 0; i < tokens1.length; i++) {
    const line1 = tokens1[i]
    const line2 = tokens2[i]

    const line1out: ThemedToken[] = []
    const line2out: ThemedToken[] = []
    out1.push(line1out)
    out2.push(line2out)

    let i1 = 0
    let i2 = 0

    let token1 = line1[i1]
    let token2 = line2[i2]

    while (token1 && token2) {
      if (token1.content.length > token2.content.length) {
        line1out.push(
          {
            ...token1,
            content: token1.content.slice(0, token2.content.length),
          },
        )
        token1 = {
          ...token1,
          content: token1.content.slice(token2.content.length),
        }
        line2out.push(token2)
        i2 += 1
        token2 = line2[i2]
      }
      else if (token1.content.length < token2.content.length) {
        line2out.push(
          {
            ...token2,
            content: token2.content.slice(0, token1.content.length),
          },
        )
        token2 = {
          ...token2,
          content: token2.content.slice(token1.content.length),
        }
        line1out.push(token1)
        i1 += 1
        token1 = line1[i1]
      }
      else {
        line1out.push(token1)
        line2out.push(token2)
        i1 += 1
        i2 += 1
        token1 = line1[i1]
        token2 = line2[i2]
      }
    }
  }

  return [out1, out2]
}

export function renderToHtmlDualThemes(
  tokens1: ThemedToken[][],
  tokens2: ThemedToken[][],
  cssName = '--shiki-dark',
  options: HtmlRendererOptions = {},
) {
  const [synced1, synced2] = _syncTwoThemedTokens(tokens1, tokens2)

  const merged: ThemedToken[][] = []
  for (let i = 0; i < synced1.length; i++) {
    const line1 = synced1[i]
    const line2 = synced2[i]
    const lineout: any[] = []
    merged.push(lineout)
    for (let j = 0; j < line1.length; j++) {
      const token1 = line1[j]
      const token2 = line2[j]
      lineout.push({
        ...token1,
        color: `${token1.color || 'inherit'};${cssName}: ${token2.color || 'inherit'}`,
      })
    }
  }

  return renderToHtml(merged, options)
}
