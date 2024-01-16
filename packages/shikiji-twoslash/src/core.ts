/**
 * This file is the core of the shikiji-twoslash package,
 * Decoupled from twoslash's implementation and allowing to introduce custom implementation or cache system.
 */
import type { TwoslashExecuteOptions, TwoslashReturn } from 'twoslash'
import type { ShikijiTransformer } from 'shikiji-core'
import type { Element, ElementContent, Text } from 'hast'

import { addClassToHast } from 'shikiji-core'
import type { TransformerTwoslashOptions, TwoslashRenderer } from './types'

export * from './types'
export * from './renderer-rich'
export * from './renderer-classic'
export * from './icons'

export function defaultTwoslashOptions(): TwoslashExecuteOptions {
  return {
    customTags: ['annotate', 'log', 'warn', 'error'],
  }
}

type TwoslashFunction = (code: string, lang?: string, options?: TwoslashExecuteOptions) => TwoslashReturn

export function createTransformerFactory(
  defaultTwoslasher: TwoslashFunction,
  defaultRenderer?: TwoslashRenderer,
) {
  return function transformerTwoslash(options: TransformerTwoslashOptions = {}): ShikijiTransformer {
    const {
      langs = ['ts', 'tsx'],
      twoslashOptions = defaultTwoslashOptions(),
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
      preprocess(code) {
        let lang = this.options.lang
        if (lang in langAlias)
          lang = langAlias[this.options.lang]

        if (filter(lang, code, this.options)) {
          this.options.mergeWhitespaces = 'never'
          const twoslash = twoslasher(code, lang, twoslashOptions)
          this.meta.twoslash = twoslash
          this.options.lang = twoslash.meta.extension || lang
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

        // Build a map of tokens to their line and character position
        const tokensMap: [line: number, charStart: number, charEnd: number, token: Element | Text][] = []
        this.lines.forEach((lineEl, line) => {
          let index = 0
          for (const token of lineEl.children.flatMap(i => i.type === 'element' ? i.children || [] : []) as (Text | Element)[]) {
            if ('value' in token && typeof token.value === 'string') {
              tokensMap.push([line, index, index + token.value.length, token])
              index += token.value.length
            }
          }
        })

        // Find tokens are in range of a node, it can may multiple tokens.
        const locateTextTokens = (
          line: number,
          character: number,
          length: number,
        ) => {
          const start = character
          const end = character + length
          // When the length is 0 (completion), we find the token that contains it
          if (length === 0) {
            return tokensMap
              .filter(([l, s, e]) => l === line && s < start && start <= e)
              .map(i => i[3])
          }
          // Otherwise we find the tokens that are completely inside the range
          // Because we did the breakpoints earlier, we can safely assume that there will be no across-boundary tokens
          return tokensMap
            .filter(([l, s, e]) => l === line && (start <= s && s < end) && (start < e && e <= end))
            .map(i => i[3])
        }

        const tokensSkipHover = new Set<Element | Text>()
        const postActions: (() => void)[] = []

        for (const node of twoslash.nodes) {
          if (node.type === 'tag') {
            if (renderer.lineCustomTag)
              insertAfterLine(node.line, renderer.lineCustomTag.call(this, node))
            continue
          }

          const tokens = locateTextTokens(node.line, node.character, node.length)

          switch (node.type) {
            case 'error': {
              if (renderer.nodeError) {
                tokens.forEach((token) => {
                  tokensSkipHover.add(token)
                  const clone = { ...token }
                  Object.assign(token, renderer.nodeError!.call(this, node, clone))
                })
              }
              if (renderer.lineError)
                insertAfterLine(node.line, renderer.lineError.call(this, node))
              break
            }
            case 'query': {
              const token = tokens[0]
              if (token && renderer.nodeQuery) {
                tokensSkipHover.add(token)
                const clone = { ...token }
                Object.assign(token, renderer.nodeQuery!.call(this, node, clone))
              }
              if (renderer.lineQuery)
                insertAfterLine(node.line, renderer.lineQuery.call(this, node, token))
              break
            }
            case 'completion': {
              if (renderer.nodeCompletion) {
                tokens.forEach((token) => {
                  tokensSkipHover.add(token)
                  const clone = { ...token }
                  Object.assign(token, renderer.nodeCompletion!.call(this, node, clone))
                })
              }
              if (renderer.lineCompletion)
                insertAfterLine(node.line, renderer.lineCompletion.call(this, node))
              break
            }
            case 'highlight': {
              if (renderer.nodeHightlight) {
                tokens.forEach((token) => {
                  tokensSkipHover.add(token)
                  const clone = { ...token }
                  Object.assign(token, renderer.nodeHightlight!.call(this, node, clone))
                })
              }
              if (renderer.lineHighlight)
                insertAfterLine(node.line, renderer.lineHighlight.call(this, node))
              break
            }
            case 'hover': {
              // Hover will be handled after all other nodes are processed
              if (renderer.nodeStaticInfo) {
                postActions.push(() => {
                  tokens.forEach((token) => {
                    if (tokensSkipHover.has(token))
                      return
                    // Already hovered, don't hover again
                    tokensSkipHover.add(token)
                    const clone = { ...token }
                    Object.assign(token, renderer.nodeStaticInfo.call(this, node, clone))
                  })
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
