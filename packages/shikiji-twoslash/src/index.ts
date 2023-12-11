import { twoslasher } from '@typescript/twoslash'
import type { ShikijiTransformer, ShikijiTransformerContext } from 'shikiji'
import { addClassToHast } from 'shikiji'
import type { Element, ElementContent, Text } from 'hast'
import { rendererClassic } from './renderer-classic'
import type { TransformerTwoSlashOptions } from './types'

export * from './types'
export * from './renderer-classic'

export function transformerTwoSlash(options: TransformerTwoSlashOptions = {}): ShikijiTransformer {
  const {
    langs = ['ts', 'tsx'],
    twoslashOptions = {
      customTags: ['annotate', 'log', 'warn', 'error'],
    },
    langAlias = {
      typescript: 'ts',
      json5: 'json',
      yml: 'yaml',
    },
    renderer = rendererClassic,
  } = options
  const filter = options.filter || (lang => langs.includes(lang))
  return {
    preprocess(code, shikijiOptions) {
      let lang = shikijiOptions.lang
      if (lang in langAlias)
        lang = langAlias[shikijiOptions.lang]

      if (filter(lang, code, shikijiOptions)) {
        shikijiOptions.mergeWhitespaces = false
        const twoslash = twoslasher(code, lang, twoslashOptions)
        this.meta.twoslash = twoslash
        return twoslash.code
      }
    },
    pre(pre) {
      if (this.meta.twoslash)
        addClassToHast(pre, 'twoslash lsp')
    },
    code(codeEl) {
      const twoslash = this.meta.twoslash
      if (!twoslash)
        return

      const insertAfterLine = (line: number, nodes: ElementContent[]) => {
        let index: number
        if (line >= this.lines.length) {
          index = codeEl.children.length
        }
        else {
          const lineEl = this.lines[line]
          index = codeEl.children.indexOf(lineEl)
          if (index === -1)
            return false
        }

        // If there is a newline after this line, remove it because we have the error element take place.
        const nodeAfter = codeEl.children[index + 1]
        if (nodeAfter && nodeAfter.type === 'text' && nodeAfter.value === '\n')
          codeEl.children.splice(index + 1, 1)
        codeEl.children.splice(index + 1, 0, ...nodes)
        return true
      }

      for (const info of twoslash.staticQuickInfos) {
        const token = locateTextToken(this, info.line, info.character)
        if (!token || token.type !== 'text')
          continue

        const clone = { ...token }
        Object.assign(token, renderer.nodeStaticInfo(info, clone))
      }

      for (const error of twoslash.errors) {
        if (error.line == null || error.character == null)
          return
        const token = locateTextToken(this, error.line, error.character)
        if (!token)
          continue

        const clone = { ...token }
        Object.assign(token, renderer.nodeError(error, clone))

        insertAfterLine(error.line, renderer.lineError(error))
      }

      for (const query of twoslash.queries) {
        insertAfterLine(
          query.line,
          query.kind === 'completions'
            ? renderer.lineCompletions(query)
            : query.kind === 'query'
              ? renderer.lineQuery(query, locateTextToken(this, query.line, query.offset))
              : [],
        )
      }

      for (const tag of twoslash.tags)
        insertAfterLine(tag.line, renderer.lineCustomTag(tag))
    },
  }
}

function locateTextToken(
  context: ShikijiTransformerContext,
  line: number,
  character: number,
) {
  const lineEl = context.lines[line]
  if (!lineEl)
    return
  const textNodes = lineEl.children.flatMap(i => i.type === 'element' ? i.children || [] : []) as (Text | Element)[]
  let index = 0
  for (const token of textNodes) {
    if ('value' in token && typeof token.value === 'string')
      index += token.value.length

    if (index > character)
      return token
  }
}
