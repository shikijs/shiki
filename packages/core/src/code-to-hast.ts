import type { Element, Root, Text } from 'hast'
import type {
  CodeToHastOptions,
  CodeToHastRenderOptions,
  ShikiInternal,
  ShikiTransformerContext,
  ShikiTransformerContextCommon,
  ThemedToken,
} from './types'
import { FontStyle } from './types'
import { codeToTokens } from './code-to-tokens'
import { addClassToHast, getTokenStyleObject, stringifyTokenStyle } from './utils'

export function codeToHast(
  internal: ShikiInternal,
  code: string,
  options: CodeToHastOptions,
  transformerContext: ShikiTransformerContextCommon = {
    meta: {},
    options,
    codeToHast: (_code, _options) => codeToHast(internal, _code, _options),
    codeToTokens: (_code, _options) => codeToTokens(internal, _code, _options),
  },
) {
  let input = code
  for (const transformer of options.transformers || [])
    input = transformer.preprocess?.call(transformerContext, input, options) || input

  let {
    tokens,
    fg,
    bg,
    themeName,
    rootStyle,
  } = codeToTokens(internal, input, options)

  const {
    mergeWhitespaces = true,
  } = options

  if (mergeWhitespaces === true)
    tokens = mergeWhitespaceTokens(tokens)
  else if (mergeWhitespaces === 'never')
    tokens = splitWhitespaceTokens(tokens)

  for (const transformer of options.transformers || [])
    tokens = transformer.tokens?.call(transformerContext, tokens) || tokens

  return tokensToHast(
    tokens,
    {
      ...options,
      fg,
      bg,
      themeName,
      rootStyle,
    },
    transformerContext,
  )
}

export function tokensToHast(
  tokens: ThemedToken[][],
  options: CodeToHastRenderOptions,
  transformerContext: ShikiTransformerContextCommon,
) {
  const {
    transformers = [],
  } = options

  const lines: (Element | Text)[] = []
  const tree: Root = {
    type: 'root',
    children: [],
  }

  let preNode: Element = {
    type: 'element',
    tagName: 'pre',
    properties: {
      class: `shiki ${options.themeName || ''}`,
      style: options.rootStyle || `background-color:${options.bg};color:${options.fg}`,
      tabindex: '0',
      ...Object.fromEntries(
        Array.from(
          Object.entries(options.meta || {}),
        )
          .filter(([key]) => !key.startsWith('_')),
      ),
    },
    children: [],
  }

  let codeNode: Element = {
    type: 'element',
    tagName: 'code',
    properties: {},
    children: lines,
  }

  const lineNodes: Element[] = []

  const context: ShikiTransformerContext = {
    ...transformerContext,
    addClassToHast,
    get tokens() {
      return tokens
    },
    get options() {
      return options
    },
    get root() {
      return tree
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
    if (idx)
      lines.push({ type: 'text', value: '\n' })

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
        properties: {},
        children: [{ type: 'text', value: token.content }],
      }

      const style = token.htmlStyle || stringifyTokenStyle(getTokenStyleObject(token))
      if (style)
        tokenNode.properties.style = style

      for (const transformer of transformers)
        tokenNode = (transformer?.span || transformer?.token)?.call(context, tokenNode, idx + 1, col, lineNode) || tokenNode

      lineNode.children.push(tokenNode)
      col += token.content.length
    }

    for (const transformer of transformers)
      lineNode = transformer?.line?.call(context, lineNode, idx + 1) || lineNode

    lineNodes.push(lineNode)
    lines.push(lineNode)
  })

  for (const transformer of transformers)
    codeNode = transformer?.code?.call(context, codeNode) || codeNode

  preNode.children.push(codeNode)

  for (const transformer of transformers)
    preNode = transformer?.pre?.call(context, preNode) || preNode

  tree.children.push(preNode)

  let result = tree
  for (const transformer of transformers)
    result = transformer?.root?.call(context, result) || result

  return result
}

function mergeWhitespaceTokens(tokens: ThemedToken[][]) {
  return tokens.map((line) => {
    const newLine: ThemedToken[] = []
    let carryOnContent = ''
    let firstOffset = 0
    line.forEach((token, idx) => {
      const isUnderline = token.fontStyle && token.fontStyle & FontStyle.Underline
      const couldMerge = !isUnderline
      if (couldMerge && token.content.match(/^\s+$/) && line[idx + 1]) {
        if (!firstOffset)
          firstOffset = token.offset
        carryOnContent += token.content
      }
      else {
        if (carryOnContent) {
          if (couldMerge) {
            newLine.push({
              ...token,
              content: carryOnContent + token.content,
            })
          }
          else {
            newLine.push(
              {
                content: carryOnContent,
                offset: firstOffset,
              },
              token,
            )
          }
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

function splitWhitespaceTokens(tokens: ThemedToken[][]) {
  return tokens.map((line) => {
    return line.flatMap((token) => {
      if (token.content.match(/^\s+$/))
        return token
      const match = token.content.match(/^(\s*)(.*?)(\s*)$/)
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
