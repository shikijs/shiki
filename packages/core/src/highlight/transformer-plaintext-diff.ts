import type { ShikiTransformer } from '@shikijs/types'

export const transformerPlaintextDiff = (): ShikiTransformer => {
  return {
    name: 'plaintext-diff',

    span(hast, line, col, lineElement, token) {
      if (this.options.lang !== 'txt' && this.options.lang !== 'markdown')
        return

      const node = hast.children?.[0]
      if (!node || node.type !== 'text')
        return

      const value = node.value.trim()

      if (value.endsWith('[!code ++]')) {
        node.value = node.value.replace('[!code ++]', '').trim()
        this.addClassToHast(this.pre, 'has-diff')
        this.addClassToHast(lineElement, ['diff', 'add'])
      }
      else if (value.endsWith('[!code --]')) {
        node.value = node.value.replace('[!code --]', '').trim()
        this.addClassToHast(this.pre, 'has-diff')
        this.addClassToHast(lineElement, ['diff', 'remove'])
      }
    }
  }
}
