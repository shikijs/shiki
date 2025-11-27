import type {
  CodeToHastOptions,
  HighlighterGeneric,
} from '@shikijs/types'
import type { Root } from 'hast'
import type { Transformer } from 'unified'
import type { RehypeShikiHandler } from './handlers'
import type { RehypeShikiCoreOptions } from './types'
import { isSpecialLang } from 'shiki/core'
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
    const queue: Promise<void>[] = []

    visit(tree, 'element', (node, index, parent) => {
      let handler: RehypeShikiHandler | undefined

      // needed for hast node replacement
      if (!parent || index == null)
        return

      if (node.tagName === 'pre') {
        handler = PreHandler
      }
      else if (node.tagName === 'code' && inline) {
        handler = InlineCodeHandlers[inline]
      }
      else {
        return
      }

      const parsed = handler(tree, node)
      if (!parsed)
        return

      let lang: string | undefined
      let lazyLoad = false

      if (!parsed.lang) {
        lang = defaultLanguage
      }
      else if (highlighter.getLoadedLanguages().includes(parsed.lang) || isSpecialLang(parsed.lang)) {
        lang = parsed.lang
      }
      else if (lazy) {
        lazyLoad = true
        lang = parsed.lang
      }
      else if (fallbackLanguage) {
        lang = fallbackLanguage
      }

      if (!lang)
        return

      const meta = parsed.meta ? parseMetaString?.(parsed.meta, node, tree) : undefined

      const processNode = (targetLang: string): void => {
        const fragment = highlight(targetLang, parsed.code, parsed.meta, meta ?? {})
        if (!fragment)
          return

        if (parsed.type === 'inline') {
          const head = fragment.children[0]
          if (head.type === 'element' && head.tagName === 'pre') {
            head.tagName = 'span'
          }
        }

        parent.children[index] = fragment as any
      }

      if (lazyLoad) {
        try {
          // passed language is checked in sync, promise `.catch()` wouldn't work
          queue.push(highlighter.loadLanguage(lang).then(() => processNode(lang)))
        }
        catch (error) {
          if (fallbackLanguage)
            return processNode(fallbackLanguage)
          else if (onError)
            onError(error)
          else throw error
        }
      }
      else {
        processNode(lang)
      }

      // don't visit processed nodes
      return 'skip'
    })

    if (queue.length > 0) {
      async function run(): Promise<void> {
        await Promise.all(queue)
      }

      return run()
    }
  }
}

export default rehypeShikiFromHighlighter
