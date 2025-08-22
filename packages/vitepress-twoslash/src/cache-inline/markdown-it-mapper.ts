import type { MarkdownFenceSourceMap, MarkdownFencesSourceMapper } from './markdown-fence'
import MarkdownIt from 'markdown-it'

export const markdownItMapper: MarkdownFencesSourceMapper = function (code, path) {
  const md = new MarkdownIt()
  const result = md.parse(code, {})
  const pos = getLineStartPositions(code)

  // create inject position map (key is insert position)
  const injects = new Map<number, MarkdownFenceSourceMap>()

  for (const token of result) {
    if (token.type === 'fence') {
      if (!token.map)
        continue

      if (token.map[0] + 1 >= pos.length)
        continue

      // next line of code block
      const codeStart = pos[token.map[0] + 1].from

      // start of end codeblock mark
      const codeEnd = pos[token.map[1] - 1].from

      injects.set(codeStart, { path, from: codeStart, to: codeEnd })
    }
  }

  return injects
}

function getLineStartPositions(text: string): { from: number, to: number }[] {
  const positions: { from: number, to: number }[] = []
  let pos = 0

  while (true) {
    const [idx, len] = findNextNewLine(text, pos)
    if (idx === -1) {
      positions.push({ from: pos, to: text.length })
      break
    }
    positions.push({ from: pos, to: idx })
    pos = idx + len
  }

  return positions
}

/**
 * Finds the next newline starting at or after `position`.
 * Supports \n, \r, and \r\n (treated as one newline).
 * @returns [newlineStartIndex, newlineLength] or [-1, 0] if none found.
 */
function findNextNewLine(str: string, position: number): [number, number] {
  const nIdx = str.indexOf('\n', position)
  const rIdx = str.indexOf('\r', position)

  if (nIdx === -1 && rIdx === -1)
    return [-1, 0]

  let idx: number
  if (nIdx === -1)
    idx = rIdx
  else if (rIdx === -1)
    idx = nIdx
  else idx = nIdx < rIdx ? nIdx : rIdx

  // CRLF case
  if (str.charCodeAt(idx) === 13 /* \r */ && str.charCodeAt(idx + 1) === 10 /* \n */) {
    return [idx, 2]
  }
  return [idx, 1]
}
