import type { Element, Root } from 'hast'
import type { RehypeShikiCoreOptions } from './types'
import { toString } from 'hast-util-to-string'

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T

export type RehypeShikiHandler = (
  tree: Root,
  node: Element
) => {
  type: 'inline' | 'pre'
  meta?: string
  lang?: string
  code: string
} | undefined

export const InlineCodeHandlers: Record<Truthy<RehypeShikiCoreOptions['inline']>, RehypeShikiHandler> = {
  'tailing-curly-colon': (_tree, node) => {
    const raw = toString(node)
    const match = raw.match(/(.+)\{:([\w-]+)\}$/)
    if (!match)
      return

    return {
      type: 'inline',
      code: match[1] ?? raw,
      lang: match.at(2),
    }
  },
}

const languagePrefix = 'language-'

export const PreHandler: RehypeShikiHandler = (_tree, node) => {
  const head = node.children[0]

  if (
    !head
    || head.type !== 'element'
    || head.tagName !== 'code'
    || !head.properties
  ) {
    return
  }

  const classes = head.properties.className
  const languageClass = Array.isArray(classes)
    ? classes.find(
        d => typeof d === 'string' && d.startsWith(languagePrefix),
      )
    : undefined

  return {
    type: 'pre',
    lang: typeof languageClass === 'string'
      ? languageClass.slice(languagePrefix.length)
      : undefined,
    code: toString(head),
    meta: head.data?.meta ?? head.properties.metastring?.toString() ?? '',
  }
}
