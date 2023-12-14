import type MarkdownIt from 'markdown-it'
import { addClassToHast } from 'shikiji/core'
import type { BuiltinTheme, CodeOptionsMeta, CodeOptionsThemes, CodeToHastOptions, HighlighterGeneric, ShikijiTransformer, TransformerOptions } from 'shikiji'
import { parseHighlightLines } from '../../shared/line-highlight'

export interface MarkdownItShikijiExtraOptions {
  /**
   * Add `highlighted` class to lines defined in after codeblock
   *
   * @default true
   */
  highlightLines?: boolean | string

  /**
   * Custom meta string parser
   * Return an object to merge with `meta`
   */
  parseMetaString?: (
    metaString: string,
    code: string,
    lang: string,
  ) => Record<string, any> | undefined | null
}

export type MarkdownItShikijiSetupOptions =
  & CodeOptionsThemes<BuiltinTheme>
  & TransformerOptions
  & CodeOptionsMeta
  & MarkdownItShikijiExtraOptions

export function setupMarkdownIt(
  markdownit: MarkdownIt,
  highlighter: HighlighterGeneric<any, any>,
  options: MarkdownItShikijiSetupOptions,
) {
  const {
    highlightLines = true,
    parseMetaString,
  } = options

  markdownit.options.highlight = (code, lang = 'text', attrs) => {
    const meta = parseMetaString?.(attrs, code, lang) || {}
    const codeOptions: CodeToHastOptions = {
      ...options,
      lang,
      meta: {
        ...options.meta,
        ...meta,
        __raw: attrs,
      },
    }

    const builtInTransformer: ShikijiTransformer[] = []

    if (highlightLines) {
      const lines = parseHighlightLines(attrs)
      if (lines) {
        const className = highlightLines === true
          ? 'highlighted'
          : highlightLines

        builtInTransformer.push({
          name: 'markdown-it-shikiji:line-class',
          line(node, line) {
            if (lines.includes(line))
              addClassToHast(node, className)
            return node
          },
        })
      }
    }

    builtInTransformer.push({
      name: 'markdown-it-shikiji:block-class',
      code(node) {
        node.properties.class = `language-${lang}`
      },
    })

    return highlighter.codeToHtml(
      code,
      {
        ...codeOptions,
        transformers: [
          ...builtInTransformer,
          ...codeOptions.transformers || [],
        ],
      },
    )
  }
}

export function fromHighlighter(
  highlighter: HighlighterGeneric<any, any>,
  options: MarkdownItShikijiSetupOptions,
) {
  return function (markdownit: MarkdownIt) {
    setupMarkdownIt(markdownit, highlighter, options)
  }
}
