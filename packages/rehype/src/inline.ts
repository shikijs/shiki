import type { Element, Root } from 'hast'
import type { RehypeShikiCoreOptions } from './types'
import { toString } from 'hast-util-to-string'

interface InlineCodeProcessorContext {
  node: Element
  getLanguage: (lang?: string) => string | undefined
  highlight: (
    lang: string,
    code: string,
    metaString?: string,
    meta?: Record<string, unknown>
  ) => Root | undefined
}

type InlineCodeProcessor = (context: InlineCodeProcessorContext) => Root | undefined

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T

export const InlineCodeProcessors: Record<Truthy<RehypeShikiCoreOptions['inline']>, InlineCodeProcessor> = {
  'tailing-curly-colon': ({ node, getLanguage, highlight }) => {
    const raw = toString(node)
    const match = raw.match(/(.+)\{:([\w-]+)\}$/)
    if (!match)
      return
    const lang = getLanguage(match[2])
    if (!lang)
      return

    const code = match[1] ?? raw
    const fragment = highlight(lang, code)
    if (!fragment)
      return

    const head = fragment.children[0]
    if (head.type === 'element' && head.tagName === 'pre') {
      head.tagName = 'span'
    }

    return fragment
  },
}
