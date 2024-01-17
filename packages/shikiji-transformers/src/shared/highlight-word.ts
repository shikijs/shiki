import type { Element } from 'hast'
import { addClassToHast } from 'shikiji/core'

export function highlightWordInLine(line: Element, ignoredElement: Element | null, word: string, className: string): void {
  line.children = line.children.flatMap((span) => {
    if (span.type !== 'element' || span.tagName !== 'span' || span === ignoredElement)
      return span

    const textNode = span.children[0]

    if (textNode.type !== 'text')
      return span

    return replaceSpan(span, textNode.value, word, className) ?? span
  })
}

function inheritElement(original: Element, overrides: Partial<Element>): Element {
  return {
    ...original,
    properties: {
      ...original.properties,
    },
    ...overrides,
  }
}

function replaceSpan(span: Element, text: string, word: string, className: string): Element[] | undefined {
  const index = text.indexOf(word)

  if (index === -1)
    return

  const createNode = (value: string) => inheritElement(span, {
    children: [
      {
        type: 'text',
        value,
      },
    ],
  })

  const nodes: Element[] = []

  if (index > 0)
    nodes.push(createNode(text.slice(0, index)))

  const highlightedNode = createNode(word)
  addClassToHast(highlightedNode, className)
  nodes.push(highlightedNode)

  if (index + word.length < text.length)
    nodes.push(createNode(text.slice(index + word.length)))

  return nodes
}
