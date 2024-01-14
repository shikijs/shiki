/**
 * This file is the core of the shikiji-twoslash package,
 * Decoupled from twoslash's implementation and allowing to introduce custom implementation or cache system.
 */
import type { TwoSlashExecuteOptions, TwoSlashReturn } from 'twoslash'
import type { ShikijiTransformer } from 'shikiji-core'
import type { Element, ElementContent, Text } from 'hast'
import type { ModuleKind, ScriptTarget } from 'typescript'

import { addClassToHast } from 'shikiji-core'
import type { TransformerTwoSlashOptions, TwoSlashRenderer } from './types'

export * from './types'
export * from './renderer-rich'
export * from './renderer-classic'
export * from './icons'

export function defaultTwoSlashOptions(): TwoSlashExecuteOptions {
  return {
    customTags: ['annotate', 'log', 'warn', 'error'],
    compilerOptions: {
      module: 99 satisfies ModuleKind.ESNext,
      target: 99 satisfies ScriptTarget.ESNext,
    },
  }
}

type TwoSlashFunction = (code: string, lang?: string, options?: TwoSlashExecuteOptions) => TwoSlashReturn

export function createTransformerFactory(defaultTwoslasher: TwoSlashFunction, defaultRenderer?: TwoSlashRenderer) {
  return function transformerTwoSlash(options: TransformerTwoSlashOptions = {}): ShikijiTransformer {
    const {
      langs = ['ts', 'tsx'],
      twoslashOptions = defaultTwoSlashOptions(),
      langAlias = {
        typescript: 'ts',
        json5: 'json',
        yml: 'yaml',
      },
      twoslasher = defaultTwoslasher,
      explicitTrigger = false,
      renderer = defaultRenderer,
      throws = true,
    } = options

    if (!renderer)
      throw new Error('[shikiji-twoslash] Missing renderer')

    const filter = options.filter || ((lang, _, options) => langs.includes(lang) && (!explicitTrigger || /\btwoslash\b/.test(options.meta?.__raw || '')))
    return {
      preprocess(code, shikijiOptions) {
        let lang = shikijiOptions.lang
        if (lang in langAlias)
          lang = langAlias[shikijiOptions.lang]

        if (filter(lang, code, shikijiOptions)) {
          shikijiOptions.mergeWhitespaces = 'never'
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
          if (!nodes.length)
            return
          let index: number
          if (line >= this.lines.length) {
            index = codeEl.children.length
          }
          else {
            const lineEl = this.lines[line]
            index = codeEl.children.indexOf(lineEl)
            if (index === -1) {
              if (throws)
                throw new Error(`[shikiji-twoslash] Cannot find line ${line} in code element`)
              return
            }
          }

          // If there is a newline after this line, remove it because we have the error element take place.
          const nodeAfter = codeEl.children[index + 1]
          if (nodeAfter && nodeAfter.type === 'text' && nodeAfter.value === '\n')
            codeEl.children.splice(index + 1, 1)
          codeEl.children.splice(index + 1, 0, ...nodes)
        }

        const locateTextToken = (
          line: number,
          character: number,
        ) => {
          const lineEl = this.lines[line]
          if (!lineEl) {
            if (throws)
              throw new Error(`[shikiji-twoslash] Cannot find line ${line} in code element`)
            return
          }
          const textNodes = lineEl.children.flatMap(i => i.type === 'element' ? i.children || [] : []) as (Text | Element)[]
          let index = 0
          for (const token of textNodes) {
            if ('value' in token && typeof token.value === 'string')
              index += token.value.length

            if (index > character)
              return token
          }

          if (throws)
            throw new Error(`[shikiji-twoslash] Cannot find token at L${line}:${character}`)
        }

        const skipTokens = new Set<Element | Text>()

        for (const error of twoslash.errors) {
          const token = locateTextToken(error.line, error.character)
          if (!token)
            continue

          skipTokens.add(token)

          if (renderer.nodeError) {
            const clone = { ...token }
            Object.assign(token, renderer.nodeError.call(this, error, clone))
          }

          if (renderer.lineError)
            insertAfterLine(error.line, renderer.lineError.call(this, error))
        }

        for (const query of twoslash.queries) {
          const token = locateTextToken(query.line, query.character)
          if (!token)
            continue

          skipTokens.add(token)

          if (renderer.nodeQuery) {
            const clone = { ...token }
            Object.assign(token, renderer.nodeQuery.call(this, query, clone))
          }

          if (renderer.lineQuery)
            insertAfterLine(query.line, renderer.lineQuery.call(this, query, token))
        }

        for (const completion of twoslash.completions) {
          const token = locateTextToken(completion.line, completion.character)
          if (!token)
            continue

          skipTokens.add(token)

          if (renderer.nodeCompletions) {
            const clone = { ...token }
            Object.assign(token, renderer.nodeCompletions.call(this, completion, clone))
          }

          if (renderer.lineCompletions)
            insertAfterLine(completion.line, renderer.lineCompletions.call(this, completion))
        }

        for (const info of twoslash.hovers) {
          const token = locateTextToken(info.line, info.character)
          if (!token || token.type !== 'text')
            continue

          // If it's already rendered as popup or error, skip it
          if (skipTokens.has(token))
            continue

          const clone = { ...token }
          Object.assign(token, renderer.nodeStaticInfo.call(this, info, clone))
        }

        if (renderer.lineCustomTag) {
          for (const tag of twoslash.tags)
            insertAfterLine(tag.line, renderer.lineCustomTag.call(this, tag))
        }
      },
    }
  }
}
