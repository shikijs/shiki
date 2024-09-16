import type {
  CodeToHastOptions,
  CodeToHastRenderOptions,
  ShikiInternal,
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

import { FontStyle } from '@shikijs/vscode-textmate'

import { addClassToHast, getTokenStyleObject, stringifyTokenStyle } from '../utils'
import { getTransformers } from './_get-transformers'
import { codeToTokens } from './code-to-tokens'

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
): Root {
  let input = code

  for (const transformer of getTransformers(options))
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

  const contextSource = {
    ...transformerContext,
    get source() {
      return input
    },
  }

  for (const transformer of getTransformers(options))
    tokens = transformer.tokens?.call(contextSource, tokens) || tokens

  return tokensToHast(
    tokens,
    {
      ...options,
      fg,
      bg,
      themeName,
      rootStyle,
    },
    contextSource,
  )
}

export function tokensToHast(
  tokens: ThemedToken[][],
  options: CodeToHastRenderOptions,
  transformerContext: ShikiTransformerContextSource,
): Root {
  const transformers = getTransformers(options)

  const lines: (Element | Text)[] = []
  const root: Root = {
    type: 'root',
    children: [],
  }

  const {
    structure = 'classic',
    tabindex = '0',
  } = options

  let preNode: Element = {
    type: 'element',
    tagName: 'pre',
    properties: {
      class: `shiki ${options.themeName || ''}`,
      style: options.rootStyle || `background-color:${options.bg};color:${options.fg}`,
      ...(tabindex !== false && tabindex != null)
        ? {
            tabindex: tabindex.toString(),
          }
        : {},
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
        properties: {},
        children: [{ type: 'text', value: token.content }],
      }

      const style = token.htmlStyle || stringifyTokenStyle(getTokenStyleObject(token))
      if (style)
        tokenNode.properties.style = style

      for (const transformer of transformers)
        tokenNode = transformer?.span?.call(context, tokenNode, idx + 1, col, lineNode) || tokenNode

      if (structure === 'inline')
        root.children.push(tokenNode)
      else if (structure === 'classic')
        lineNode.children.push(tokenNode)
      col += token.content.length
    }

    if (structure === 'classic') {
      for (const transformer of transformers)
        lineNode = transformer?.line?.call(context, lineNode, idx + 1) || lineNode

      lineNodes.push(lineNode)
      lines.push(lineNode)
    }
  })

  if (structure === 'classic') {
    for (const transformer of transformers)
      codeNode = transformer?.code?.call(context, codeNode) || codeNode

    preNode.children.push(codeNode)

    for (const transformer of transformers)
      preNode = transformer?.pre?.call(context, preNode) || preNode

    root.children.push(preNode)
  }

  let result = root
  for (const transformer of transformers)
    result = transformer?.root?.call(context, result) || result

  return result
}

function mergeWhitespaceTokens(tokens: ThemedToken[][]): ThemedToken[][] {
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
              offset: firstOffset,
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
          firstOffset = 0
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
      if (token.content.match(/^\s+$/))
        return token
      // eslint-disable-next-line regexp/no-super-linear-backtracking
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
