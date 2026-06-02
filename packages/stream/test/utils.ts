import type { ThemedToken } from '@shikijs/core'
import { getTokenStyleObject, stringifyTokenStyle } from '@shikijs/core'

export function generateRandomTextStream(text: string, inverval = 50): ReadableStream<string> {
  return new ReadableStream<string>({
    async start(controller) {
      let index = 0
      while (index < text.length) {
        await new Promise(r => setTimeout(r, inverval))
        const length = Math.round(Math.random() * 20 + 5)
        const chunk = text.slice(index, index + length)
        index += length
        controller.enqueue(chunk)
      }
      controller.close()
    },
  })
}

export function tokenToHtml(token: ThemedToken): string {
  return `<span style="${stringifyTokenStyle(token.htmlStyle || getTokenStyleObject(token))}">${escapeHtml(token.content)}</span>`
}

export function tokensToHtml(tokens: ThemedToken[]): string {
  return `<pre>${tokens.map(tokenToHtml).join('')}</pre>`
}

export function escapeHtml(html: string): string {
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
