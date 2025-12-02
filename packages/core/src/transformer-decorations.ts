import type {
  DecorationItem,
  DecorationTransformType,
  OffsetOrPosition,
  ResolvedDecorationItem,
  ResolvedPosition,
  ShikiTransformer,
  ShikiTransformerContextMeta,
  ShikiTransformerContextSource,
} from '@shikijs/types'
import type { Element, ElementContent } from 'hast'
import { ShikiError } from '@shikijs/types'
import { addClassToHast, createPositionConverter, splitTokens } from './utils'

interface TransformerDecorationsInternalContext {
  decorations: ResolvedDecorationItem[]
  converter: ReturnType<typeof createPositionConverter>
  source: string
}

/**
 * A built-in transformer to add decorations to the highlighted code.
 */
export function transformerDecorations(): ShikiTransformer {
  const map = new WeakMap<ShikiTransformerContextMeta, TransformerDecorationsInternalContext>()

  function getContext(shiki: ShikiTransformerContextSource): TransformerDecorationsInternalContext {
    if (!map.has(shiki.meta)) {
      const converter = createPositionConverter(shiki.source)

      function normalizePosition(p: OffsetOrPosition): ResolvedPosition {
        if (typeof p === 'number') {
          if (p < 0 || p > shiki.source.length)
            throw new ShikiError(`Invalid decoration offset: ${p}. Code length: ${shiki.source.length}`)

          return {
            ...converter.indexToPos(p),
            offset: p,
          }
        }
        else {
          const line = converter.lines[p.line]
          if (line === undefined)
            throw new ShikiError(`Invalid decoration position ${JSON.stringify(p)}. Lines length: ${converter.lines.length}`)

          let character = p.character
          // Negative numbers are positions from the end of the line
          if (character < 0)
            character = line.length + character

          if (character < 0 || character > line.length)
            throw new ShikiError(`Invalid decoration position ${JSON.stringify(p)}. Line ${p.line} length: ${line.length}`)

          return {
            ...p,
            character,
            offset: converter.posToIndex(p.line, character),
          }
        }
      }

      const decorations = (shiki.options.decorations || [])
        .map((d): ResolvedDecorationItem => ({
          ...d,
          start: normalizePosition(d.start),
          end: normalizePosition(d.end),
        }))

      if (shiki.options.checkIntersections !== false)
        verifyIntersections(decorations)

      map.set(shiki.meta, {
        decorations,
        converter,
        source: shiki.source,
      })
    }

    return map.get(shiki.meta)!
  }

  return {
    name: 'shiki:decorations',
    tokens(tokens) {
      if (!this.options.decorations?.length)
        return
      const ctx = getContext(this)
      const breakpoints = ctx.decorations.flatMap(d => [d.start.offset, d.end.offset])
      const splitted = splitTokens(tokens, breakpoints)
      return splitted
    },
    code(codeEl) {
      if (!this.options.decorations?.length)
        return
      const ctx = getContext(this)

      const lines = Array.from(codeEl.children).filter(i => i.type === 'element' && i.tagName === 'span') as Element[]

      if (lines.length !== ctx.converter.lines.length)
        throw new ShikiError(`Number of lines in code element (${lines.length}) does not match the number of lines in the source (${ctx.converter.lines.length}). Failed to apply decorations.`)

      function applyLineSection(line: number, start: number, end: number, decoration: DecorationItem): void {
        const lineEl = lines[line]

        let startIndex = -1
        let endIndex = -1

        if (start === 0)
          startIndex = 0
        if (end === 0)
          endIndex = 0
        if (end === Number.POSITIVE_INFINITY)
          endIndex = lineEl.children.length

        if (startIndex === -1 || endIndex === -1) {
          let cumLength = 0
          let i = 0
          while (i < lineEl.children.length) {
            const child = lineEl.children[i]
            const childLength = stringify(child).length

            if (startIndex === -1) {
              if (cumLength + childLength === start) {
                startIndex = i + 1
              }
              else if (cumLength < start && cumLength + childLength > start) {
                const offset = start - cumLength
                const [head, tail] = splitElement(child, offset)
                lineEl.children.splice(i, 1, head, tail)
                startIndex = i + 1
                cumLength += stringify(head).length
                i++
                continue
              }
            }

            if (endIndex === -1) {
              if (cumLength + childLength === end) {
                endIndex = i + 1
              }
              else if (cumLength < end && cumLength + childLength > end) {
                const offset = end - cumLength
                const [head, tail] = splitElement(child, offset)
                lineEl.children.splice(i, 1, head, tail)
                endIndex = i + 1
                cumLength += stringify(head).length
                i++
                continue
              }
            }

            cumLength += childLength
            i++
          }
        }

        if (startIndex === -1)
          throw new ShikiError(`Failed to find start index for decoration ${JSON.stringify(decoration.start)}`)
        if (endIndex === -1)
          throw new ShikiError(`Failed to find end index for decoration ${JSON.stringify(decoration.end)}`)

        const children = lineEl.children.slice(startIndex, endIndex)

        // Full line decoration
        if (!decoration.alwaysWrap && children.length === lineEl.children.length) {
          applyDecoration(lineEl, decoration, 'line')
        }
        // Single token decoration
        else if (!decoration.alwaysWrap && children.length === 1 && children[0].type === 'element') {
          applyDecoration(children[0], decoration, 'token')
        }
        // Create a wrapper for the decoration
        else {
          if (children.length === 0) {
            const wrapper: Element = {
              type: 'element',
              tagName: 'span',
              properties: {},
              children: [],
            }
            applyDecoration(wrapper, decoration, 'wrapper')
            lineEl.children.splice(startIndex, 0, wrapper)
          }
          else {
            const newChildren: ElementContent[] = []
            for (const child of children) {
              if (child.type === 'element') {
                newChildren.push(applyDecoration(child, decoration, 'token'))
              }
              else if (child.type === 'text') {
                const wrapper: Element = {
                  type: 'element',
                  tagName: 'span',
                  properties: {},
                  children: [child],
                }
                newChildren.push(applyDecoration(wrapper, decoration, 'token'))
              }
            }
            lineEl.children.splice(startIndex, children.length, ...newChildren)
          }
        }
      }

      function applyLine(line: number, decoration: DecorationItem): void {
        lines[line] = applyDecoration(lines[line], decoration, 'line')
      }

      function applyDecoration(el: Element, decoration: DecorationItem, type: DecorationTransformType): Element {
        const properties = decoration.properties || {}
        const transform = decoration.transform || (i => i)

        el.tagName = decoration.tagName || 'span'
        el.properties = {
          ...el.properties,
          ...properties,
          class: el.properties.class,
        }
        if (decoration.properties?.class)
          addClassToHast(el, decoration.properties.class as string[])
        el = transform(el, type) || el
        return el
      }

      const lineApplies: (() => void)[] = []

      // Apply decorations in reverse order so the nested ones get applied first.
      const sorted = ctx.decorations.sort((a, b) => b.start.offset - a.start.offset || a.end.offset - b.end.offset)
      for (const decoration of sorted) {
        const { start, end } = decoration
        if (start.line === end.line) {
          applyLineSection(start.line, start.character, end.character, decoration)
        }
        else if (start.line < end.line) {
          applyLineSection(start.line, start.character, Number.POSITIVE_INFINITY, decoration)
          for (let i = start.line + 1; i < end.line; i++)
            lineApplies.unshift(() => applyLine(i, decoration))
          applyLineSection(end.line, 0, end.character, decoration)
        }
      }

      lineApplies.forEach(i => i())
    },
  }
}

function verifyIntersections(items: ResolvedDecorationItem[]): void {
  for (let i = 0; i < items.length; i++) {
    const foo = items[i]
    if (foo.start.offset > foo.end.offset)
      throw new ShikiError(`Invalid decoration range: ${JSON.stringify(foo.start)} - ${JSON.stringify(foo.end)}`)

    for (let j = i + 1; j < items.length; j++) {
      const bar = items[j]
      const isFooHasBarStart = foo.start.offset <= bar.start.offset && bar.start.offset < foo.end.offset
      const isFooHasBarEnd = foo.start.offset < bar.end.offset && bar.end.offset <= foo.end.offset
      const isBarHasFooStart = bar.start.offset <= foo.start.offset && foo.start.offset < bar.end.offset
      const isBarHasFooEnd = bar.start.offset < foo.end.offset && foo.end.offset <= bar.end.offset
      if (isFooHasBarStart || isFooHasBarEnd || isBarHasFooStart || isBarHasFooEnd) {
        if (isFooHasBarStart && isFooHasBarEnd)
          continue // nested
        if (isBarHasFooStart && isBarHasFooEnd)
          continue // nested
        if (isBarHasFooStart && foo.start.offset === foo.end.offset)
          continue // leading adjacent empty
        if (isFooHasBarEnd && bar.start.offset === bar.end.offset)
          continue // trailing adjacent empty
        throw new ShikiError(`Decorations ${JSON.stringify(foo.start)} and ${JSON.stringify(bar.start)} intersect.`)
      }
    }
  }
}

function stringify(el: ElementContent): string {
  if (el.type === 'text')
    return el.value
  if (el.type === 'element')
    return el.children.map(stringify).join('')
  return ''
}

function splitElement(element: ElementContent, offset: number): [ElementContent, ElementContent] {
  if (element.type === 'text') {
    return [
      { type: 'text', value: element.value.slice(0, offset) },
      { type: 'text', value: element.value.slice(offset) },
    ]
  }
  if (element.type === 'element') {
    let cumLength = 0
    for (let i = 0; i < element.children.length; i++) {
      const child = element.children[i]
      const childLength = stringify(child).length
      if (cumLength + childLength > offset) {
        const [head, tail] = splitElement(child, offset - cumLength)
        const headChildren = [...element.children.slice(0, i), head]
        const tailChildren = [tail, ...element.children.slice(i + 1)]
        return [
          { ...element, children: headChildren },
          { ...element, children: tailChildren },
        ]
      }
      cumLength += childLength
    }
  }
  throw new ShikiError(`Failed to split element at offset ${offset}`)
}
