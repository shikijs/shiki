import type {
  CodeToHastOptions,
  HighlighterGeneric,
} from '@shikijs/types'
import type { Root } from 'hast'
import type { Transformer } from 'unified'
import type { RehypeShikiHandler } from './handlers'
import type { RehypeShikiCoreOptions } from './types'
import { visit } from 'unist-util-visit'
import { InlineCodeHandlers, PreHandler } from './handlers'

export * from './types'

const languagePrefix = 'language-'

function rehypeShikiFromHighlighter(
  highlighter: HighlighterGeneric<any, any>,
  options: RehypeShikiCoreOptions,
): Transformer<Root, Root> {
  const {
    addLanguageClass = false,
    parseMetaString,
    cache,
    defaultLanguage,
    fallbackLanguage,
    onError,
    stripEndNewline = true,
    inline = false,
    lazy = false,
    ...rest
  } = options

  function highlight(
    lang: string,
    code: string,
    metaString: string = '',
    meta: Record<string, unknown> = {},
  ): Root | undefined {
    const cacheKey = `${lang}:${metaString}:${code}`
    const cachedValue = cache?.get(cacheKey)

    if (cachedValue) {
      return cachedValue
    }

    const codeOptions: CodeToHastOptions = {
      ...rest,
      lang,
      meta: {
        ...rest.meta,
        ...meta,
        __raw: metaString,
      },
    }

    if (addLanguageClass) {
      // always construct a new array, avoid adding the transformer repeatedly
      codeOptions.transformers = [
        ...codeOptions.transformers ?? [],
        {
          name: 'rehype-shiki:code-language-class',
          code(node) {
            this.addClassToHast(node, `${languagePrefix}${lang}`)
            return node
          },
        },
      ]
    }

    if (stripEndNewline && code.endsWith('\n'))
      code = code.slice(0, -1)

    try {
      const fragment = highlighter.codeToHast(code, codeOptions)
      cache?.set(cacheKey, fragment)
      return fragment
    }
    catch (error) {
      if (onError)
        onError(error)
      else
        throw error
    }
  }

  return (tree) => {
    // use this queue if lazy is enabled
    const languageQueue: string[] = []
    const queue: (() => void)[] = []

    function getLanguage(lang: string | undefined): string | undefined {
      if (!lang)
        return defaultLanguage

      if (highlighter.getLoadedLanguages().includes(lang))
        return lang

      if (lazy) {
        languageQueue.push(lang)
        return lang
      }

      if (fallbackLanguage)
        return fallbackLanguage
    }

    visit(tree, 'element', (node, index, parent) => {
      let handler: RehypeShikiHandler | undefined

      // needed for hast node replacement
      if (!parent || index == null)
        return

      if (node.tagName === 'pre') {
        handler = PreHandler
      }

      if (node.tagName === 'code' && inline) {
        handler = InlineCodeHandlers[inline]
      }

      if (!handler)
        return

      const res = handler(tree, node)
      if (!res)
        return

      const lang = getLanguage(res.lang)
      if (!lang)
        return

      const processNode = (): void => {
        const meta = res.meta ? parseMetaString?.(res.meta, node, tree) : undefined

        const fragment = highlight(lang, res.code, res.meta, meta ?? {})
        if (!fragment)
          return

        if (res.type === 'inline') {
          const head = fragment.children[0]
          if (head.type === 'element' && head.tagName === 'pre') {
            head.tagName = 'span'
          }
        }

        parent.children.splice(index, 1, ...fragment.children)
      }

      if (lazy)
        queue.push(processNode)
      else
        processNode()

      // don't visit processed nodes
      return 'skip'
    })

    if (lazy) {
      return highlighter
        .loadLanguage(...languageQueue)
        .then(() => {
          queue.forEach(fn => fn())
        })
    }
  }
}

export default rehypeShikiFromHighlighter
