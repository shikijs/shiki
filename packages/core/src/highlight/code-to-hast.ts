import type {
  CodeToHastOptions,
  CodeToHastRenderOptions,
  GrammarState,
  ShikiPrimitive,
  ShikiTransformerContext,
  ShikiTransformerContextCommon,
  ShikiTransformerContextSource,
  ThemedToken,
} from '@shikijs/types'
import type {
  Element,
  Root,
  Text,
} from 'hast'

import { getLastGrammarStateFromMap, setLastGrammarStateToMap } from '@shikijs/primitive'
import { FontStyle } from '@shikijs/vscode-textmate'
import { addClassToHast, getTokenStyleObject, stringifyTokenStyle } from '../utils'
import { resolveTransformers } from './_get-transformers'
import { codeToTokens } from './code-to-tokens'

const RE_WHITESPACE_ONLY = /^\s+$/
// eslint-disable-next-line regexp/no-super-linear-backtracking
const RE_LEADING_TRAILING_WHITESPACE = /^(\s*)(.*?)(\s*)$/

export function codeToHast(
  primitive: ShikiPrimitive,
  code: string,
  options: CodeToHastOptions,
  transformerContext: ShikiTransformerContextCommon = {
    meta: {},
    options,
    codeToHast: (_code, _options) => codeToHast(primitive, _code, _options),
    codeToTokens: (_code, _options) => codeToTokens(primitive, _code, _options),
  },
): Root {
  let input = code

  const transformers = resolveTransformers(options)

  for (const transformer of transformers.preprocess)
    input = transformer.preprocess!.call(transformerContext, input, options) || input

  let {
    tokens,
    fg,
    bg,
    themeName,
    rootStyle,
    grammarState,
  } = codeToTokens(primitive, input, options)

  const {
    mergeWhitespaces = true,
    mergeSameStyleTokens = false,
  } = options

  if (mergeWhitespaces === true)
    tokens = mergeWhitespaceTokens(tokens)
  else if (mergeWhitespaces === 'never')
    tokens = splitWhitespaceTokens(tokens)

  if (mergeSameStyleTokens) {
    tokens = mergeAdjacentStyledTokens(tokens)
  }

  const contextSource = {
    ...transformerContext,
    get source() {
      return input
    },
  }

  for (const transformer of transformers.tokens)
    tokens = transformer.tokens!.call(contextSource, tokens) || tokens

  return tokensToHast(
    tokens,
    {
      ...options,
      fg,
      bg,
      themeName,
      rootStyle: options.rootStyle === false
        ? false
        : options.rootStyle ?? rootStyle,
    },
    contextSource,
    grammarState,
    transformers,
  )
}

export function tokensToHast(
  tokens: ThemedToken[][],
  options: CodeToHastRenderOptions,
  transformerContext: ShikiTransformerContextSource,
  grammarState: GrammarState | undefined = getLastGrammarStateFromMap(tokens),
  transformersView?: ReturnType<typeof resolveTransformers>,
): Root {
  const transformers = transformersView ?? resolveTransformers(options)

  const lines: (Element | Text)[] = []
  const root: Root = {
    type: 'root',
    children: [],
  }

  const {
    structure = 'classic',
    tabindex = '0',
  } = options

  const properties: Element['properties'] = {
    class: `shiki ${options.themeName || ''}`,
  }

  if (options.rootStyle !== false) {
    if (options.rootStyle != null)
      properties.style = options.rootStyle
    else
      properties.style = `background-color:${options.bg};color:${options.fg}`
  }

  if (tabindex !== false && tabindex != null)
    properties.tabindex = tabindex.toString()

  for (const [key, value] of Object.entries(options.meta || {})) {
    if (!key.startsWith('_'))
      properties[key] = value
  }

  let preNode: Element = {
    type: 'element',
    tagName: 'pre',
    properties,
    children: [],
    data: options.data as any,
  }

  let codeNode: Element = {
    type: 'element',
    tagName: 'code',
    properties: {},
    children: lines,
  }

  const lineNodes: Element[] = []

  // Per-call style intern table — typical code only uses ~5-20 distinct
  // `(color, bgColor, fontStyle)` triples; without caching every token
  // re-builds the same intermediate object and re-joins the style string.
  // The cache is local to `tokensToHast`, so cross-call mutation can't
  // affect output.
  const styleCache = new Map<string, string>()

  function getStyle(token: ThemedToken): string {
    if (typeof token.htmlStyle === 'string')
      return token.htmlStyle
    if (token.htmlStyle) {
      // Object-htmlStyle is built by the multi-theme code path per token
      // (and is per-token identity-stable); skip caching there since each
      // object is unique.
      return stringifyTokenStyle(token.htmlStyle)
    }
    // No htmlStyle → key by raw (color, bgColor, fontStyle) so two tokens
    // with identical styling hit the cache.
    const key = (token.color || token.bgColor || token.fontStyle)
      ? `${token.color || ''}|${token.bgColor || ''}|${token.fontStyle || 0}`
      : ''
    let cached = styleCache.get(key)
    if (cached === undefined) {
      cached = stringifyTokenStyle(getTokenStyleObject(token))
      styleCache.set(key, cached)
    }
    return cached
  }

  const context: ShikiTransformerContext = {
    ...transformerContext,
    structure,
    addClassToHast,
    get source() {
      return transformerContext.source
    },
    get tokens() {
      return tokens
    },
    get options() {
      return options
    },
    get root() {
      return root
    },
    get pre() {
      return preNode
    },
    get code() {
      return codeNode
    },
    get lines() {
      return lineNodes
    },
  }

  tokens.forEach((line, idx) => {
    if (idx) {
      if (structure === 'inline')
        root.children.push({ type: 'element', tagName: 'br', properties: {}, children: [] })
      else if (structure === 'classic')
        lines.push({ type: 'text', value: '\n' })
    }

    let lineNode: Element = {
      type: 'element',
      tagName: 'span',
      properties: { class: 'line' },
      children: [],
    }

    let col = 0

    for (const token of line) {
      let tokenNode: Element = {
        type: 'element',
        tagName: 'span',
        properties: {
          ...token.htmlAttrs,
        },
        children: [{ type: 'text', value: token.content }],
      }

      const style = getStyle(token)
      if (style)
        tokenNode.properties.style = style

      for (const transformer of transformers.span)
        tokenNode = transformer.span!.call(context, tokenNode, idx + 1, col, lineNode, token) || tokenNode

      if (structure === 'inline')
        root.children.push(tokenNode)
      else if (structure === 'classic')
        lineNode.children.push(tokenNode)
      col += token.content.length
    }

    if (structure === 'classic') {
      for (const transformer of transformers.line)
        lineNode = transformer.line!.call(context, lineNode, idx + 1) || lineNode

      lineNodes.push(lineNode)
      lines.push(lineNode)
    }
    else if (structure === 'inline') {
      lineNodes.push(lineNode)
    }
  })

  if (structure === 'classic') {
    for (const transformer of transformers.code)
      codeNode = transformer.code!.call(context, codeNode) || codeNode

    preNode.children.push(codeNode)

    for (const transformer of transformers.pre)
      preNode = transformer.pre!.call(context, preNode) || preNode

    root.children.push(preNode)
  }
  else if (structure === 'inline') {
    // For inline structure, we need to invoke code hooks for transformers like decorations
    // Build a synthetic code structure from the root's children
    const syntheticLines: Element[] = []
    let currentLine: Element = {
      type: 'element',
      tagName: 'span',
      properties: { class: 'line' },
      children: [],
    }

    for (const child of root.children) {
      if (child.type === 'element' && child.tagName === 'br') {
        syntheticLines.push(currentLine)
        currentLine = {
          type: 'element',
          tagName: 'span',
          properties: { class: 'line' },
          children: [],
        }
      }
      else if (child.type === 'element' || child.type === 'text') {
        currentLine.children.push(child)
      }
    }
    syntheticLines.push(currentLine)

    const syntheticCode: Element = {
      type: 'element',
      tagName: 'code',
      properties: {},
      children: syntheticLines,
    }

    let transformedCode = syntheticCode
    for (const transformer of transformers.code)
      transformedCode = transformer.code!.call(context, transformedCode) || transformedCode

    // Extract the transformed children back to root
    root.children = []
    for (let i = 0; i < transformedCode.children.length; i++) {
      if (i > 0)
        root.children.push({ type: 'element', tagName: 'br', properties: {}, children: [] })

      const line = transformedCode.children[i]
      if (line.type === 'element')
        root.children.push(...line.children)
    }
  }

  let result = root
  for (const transformer of transformers.root)
    result = transformer.root!.call(context, result) || result

  if (grammarState)
    setLastGrammarStateToMap(result, grammarState)

  return result
}

function mergeWhitespaceTokens(tokens: ThemedToken[][]): ThemedToken[][] {
  return tokens.map((line) => {
    const newLine: ThemedToken[] = []
    let carryOnContent = ''
    let firstOffset: number | undefined
    line.forEach((token, idx) => {
      const isDecorated = token.fontStyle && (
        (token.fontStyle & FontStyle.Underline)
        || (token.fontStyle & FontStyle.Strikethrough)
      )
      const couldMerge = !isDecorated
      if (couldMerge && RE_WHITESPACE_ONLY.test(token.content) && line[idx + 1]) {
        if (firstOffset === undefined)
          firstOffset = token.offset
        carryOnContent += token.content
      }
      else {
        if (carryOnContent) {
          if (couldMerge) {
            newLine.push({
              ...token,
              offset: firstOffset!,
              content: carryOnContent + token.content,
            })
          }
          else {
            newLine.push(
              {
                content: carryOnContent,
                offset: firstOffset!,
              },
              token,
            )
          }
          firstOffset = undefined
          carryOnContent = ''
        }
        else {
          newLine.push(token)
        }
      }
    })
    return newLine
  })
}

function splitWhitespaceTokens(tokens: ThemedToken[][]): ThemedToken[][] {
  return tokens.map((line) => {
    return line.flatMap((token) => {
      if (RE_WHITESPACE_ONLY.test(token.content))
        return token
      const match = token.content.match(RE_LEADING_TRAILING_WHITESPACE)
      if (!match)
        return token
      const [, leading, content, trailing] = match
      if (!leading && !trailing)
        return token

      const expanded = [{
        ...token,
        offset: token.offset + leading.length,
        content,
      }]
      if (leading) {
        expanded.unshift({
          content: leading,
          offset: token.offset,
        })
      }
      if (trailing) {
        expanded.push({
          content: trailing,
          offset: token.offset + leading.length + content.length,
        })
      }
      return expanded
    })
  })
}

function mergeAdjacentStyledTokens(tokens: ThemedToken[][]): ThemedToken[][] {
  return tokens.map((line) => {
    const newLine: ThemedToken[] = []
    // Carry the previous token's style string across iterations instead of
    // recomputing it from scratch each loop turn (it equals last iteration's
    // `currentStyle`). Halves the work in this function on the hot path.
    let prevStyle: string | undefined
    let prevIsDecorated = false
    for (const token of line) {
      const isDecorated = !!(token.fontStyle && (
        (token.fontStyle & FontStyle.Underline)
        || (token.fontStyle & FontStyle.Strikethrough)
      ))

      if (newLine.length === 0) {
        newLine.push({ ...token })
        prevStyle = stringifyTokenStyle(token.htmlStyle || getTokenStyleObject(token))
        prevIsDecorated = isDecorated
        continue
      }

      const currentStyle = stringifyTokenStyle(token.htmlStyle || getTokenStyleObject(token))

      if (!prevIsDecorated && !isDecorated && prevStyle === currentStyle) {
        newLine.at(-1)!.content += token.content
        // prevStyle stays the same, prevIsDecorated already false
      }
      else {
        newLine.push({ ...token })
        prevStyle = currentStyle
        prevIsDecorated = isDecorated
      }
    }
    return newLine
  })
}
