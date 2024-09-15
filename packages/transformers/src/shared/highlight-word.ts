import type { Element, ElementContent, Text } from 'hast'
import type { ShikiTransformerContext } from 'shiki/core'

export function highlightWordInLine(this: ShikiTransformerContext, line: Element, ignoredElement: Element | null, word: string, className: string): void {
  const content = getTextContent(line)
  let index = content.indexOf(word)

  while (index !== -1) {
    highlightRange.call(this, line.children, ignoredElement, index, word.length, className)
    index = content.indexOf(word, index + 1)
  }
}

function getTextContent(element: ElementContent): string {
  if (element.type === 'text')
    return element.value
  if (element.type === 'element' && element.tagName === 'span')
    return element.children.map(getTextContent).join('')
  return ''
}

/**
 * @param elements
 * @param ignoredElement
 * @param index highlight beginning index
 * @param len highlight length
 */
function highlightRange(
  this: ShikiTransformerContext,
  elements: ElementContent[],
  ignoredElement: Element | null,
  index: number,
  len: number,
  className: string,
): void {
  let currentIdx = 0

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    if (element.type !== 'element' || element.tagName !== 'span' || element === ignoredElement)
      continue
    const textNode = element.children[0]
    if (textNode.type !== 'text')
      continue

    // check if it is overlapped with highlight range
    if (hasOverlap([currentIdx, currentIdx + textNode.value.length - 1], [index, index + len])) {
      const start = Math.max(0, index - currentIdx)
      const length = len - Math.max(0, currentIdx - index)

      if (length === 0)
        continue

      const separated = separateToken(element, textNode, start, length)
      this.addClassToHast(separated[1], className)

      // insert
      const output = separated.filter(Boolean) as Element[]
      elements.splice(i, 1, ...output)
      i += output.length - 1
    }

    currentIdx += textNode.value.length
  }
}

function hasOverlap(range1: [number, number], range2: [ number, number]): boolean {
  return (range1[0] <= range2[1]) && (range1[1]) >= range2[0]
}

function separateToken(span: Element, textNode: Text, index: number, len: number): [
  before: Element | undefined,
  med: Element,
  after: Element | undefined,
] {
  const text = textNode.value

  const createNode = (value: string): Element => inheritElement(span, {
    children: [
      {
        type: 'text',
        value,
      },
    ],
  })

  return [
    index > 0 ? createNode(text.slice(0, index)) : undefined,
    createNode(text.slice(index, index + len)),
    index + len < text.length ? createNode(text.slice(index + len)) : undefined,
  ]
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
