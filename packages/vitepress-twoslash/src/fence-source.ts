import MagicString from 'magic-string'
import MarkdownIt from 'markdown-it'
import { getLineStartPositions } from './utils'

export interface FenceSource {
  path: string
  from: number
  to: number
}

declare module '@shikijs/core' {
  interface ShikiTransformerContextMeta {
    source?: FenceSource | null
  }
}

const FENCE_SOURCE_PREFIX = `__VPTS__${Math.random().toString(36).slice(2)}`
const FENCE_SOURCE_REGEX = new RegExp(`^${FENCE_SOURCE_PREFIX}:(.*)\n`, 'm')

function generateFenceSourceCode(source: FenceSource): string {
  const data = JSON.stringify(source)
  return `${FENCE_SOURCE_PREFIX}:${data}`
}

export function resolveFenceSource(code: string): { code: string, source: FenceSource | null } {
  let source: FenceSource | null = null

  try {
    code = code.replace(FENCE_SOURCE_REGEX, (_, p1: string) => {
      source = JSON.parse(p1) as FenceSource
      return ''
    })
  }
  catch {
    // ignore
  }

  return { code, source }
}

export function transformFenceSource(code: string, path: string = ''): { code: string } {
  const md = new MarkdownIt()
  const result = md.parse(code, {})
  const pos = getLineStartPositions(code)
  const s = new MagicString(code)

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

      const payload: FenceSource = { path, from: codeStart, to: codeEnd }
      s.appendRight(codeStart, `${generateFenceSourceCode(payload)}\n`)
    }
  }

  return {
    code: s.toString(),
  }
}
