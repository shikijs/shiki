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

export function createTransformerFactory(
  defaultTwoslasher: TwoSlashFunction,
  defaultRenderer?: TwoSlashRenderer,
) {
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
      tokens(tokens) {
        if (!this.meta.twoslash)
          return

        // Break tokens at the boundaries of twoslash nodes
        const breakpoints = Array.from(new Set(this.meta.twoslash.nodes.flatMap(i =>
          ['hover', 'error', 'query', 'highlight'].includes(i.type)
            ? [i.start, i.start + i.length]
            : [],
        ))).sort()

        return tokens.map((line) => {
          return line.flatMap((token) => {
            const breakpointsInToken = breakpoints
              .filter(i => token.offset < i && i < token.offset + token.content.length)
              .map(i => i - token.offset)

            if (!breakpointsInToken.length)
              return token

            breakpointsInToken.push(token.content.length)
            breakpointsInToken.sort((a, b) => a - b)
            let lastDelta = 0
            return breakpointsInToken.map((i) => {
              const n = {
                ...token,
                content: token.content.slice(lastDelta, i),
                offset: token.offset + lastDelta,
              }
              lastDelta = i
              return n
            })
          })
        })
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

        const tokensSkipHover = new Set<Element | Text>()
        const postActions: (() => void)[] = []

        for (const node of twoslash.nodes) {
          if (node.type === 'tag') {
            if (renderer.lineCustomTag)
              insertAfterLine(node.line, renderer.lineCustomTag.call(this, node))
            continue
          }

          const token = locateTextToken(node.line, node.character)

          switch (node.type) {
            case 'error': {
              if (token && renderer.nodeError) {
                tokensSkipHover.add(token)
                const clone = { ...token }
                Object.assign(token, renderer.nodeError.call(this, node, clone))
              }
              if (renderer.lineError)
                insertAfterLine(node.line, renderer.lineError.call(this, node))
              break
            }
            case 'query': {
              if (token && renderer.nodeQuery) {
                tokensSkipHover.add(token)
                const clone = { ...token }
                Object.assign(token, renderer.nodeQuery.call(this, node, clone))
              }
              if (renderer.lineQuery)
                insertAfterLine(node.line, renderer.lineQuery.call(this, node, token))
              break
            }
            case 'completion': {
              if (token && renderer.nodeCompletion) {
                tokensSkipHover.add(token)
                const clone = { ...token }
                Object.assign(token, renderer.nodeCompletion.call(this, node, clone))
              }
              if (renderer.lineCompletion)
                insertAfterLine(node.line, renderer.lineCompletion.call(this, node))
              break
            }
            case 'highlight': {
              if (token && renderer.nodeHightlight) {
                tokensSkipHover.add(token)
                const clone = { ...token }
                Object.assign(token, renderer.nodeHightlight.call(this, node, clone))
              }
              if (renderer.lineHighlight)
                insertAfterLine(node.line, renderer.lineHighlight.call(this, node))
              break
            }
            case 'hover': {
              // Hover will be handled after all other nodes are processed
              if (token && renderer.nodeStaticInfo) {
                postActions.push(() => {
                  if (tokensSkipHover.has(token))
                    return
                  const clone = { ...token }
                  Object.assign(token, renderer.nodeStaticInfo.call(this, node, clone))
                })
              }
              break
            }
            default: {
              if (throws)
                // @ts-expect-error Unknown node type
                throw new Error(`[shikiji-twoslash] Unknown node type: ${node.type}`)
            }
          }
        }
        postActions.forEach(i => i())
      },
    }
  }
}
