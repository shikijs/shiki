import type { ShikiTransformer } from 'shiki'
import type { Plugin } from 'vite'
import type { UserConfig } from 'vitepress'
import { readFileSync } from 'node:fs'
import MagicString from 'magic-string'
import MarkdownIt from 'markdown-it'

export interface FenceSourceMap {
  path: string
  from: number
  to: number
}

declare module '@shikijs/core' {
  interface ShikiTransformerContextMeta {
    sourceMap?: FenceSourceMap | null
  }
}

export function createFenceSourceMap(): {
  inject: (code: string, path?: string) => { code: string }
  extract: (code: string) => { code: string, sourceMap: FenceSourceMap | null }
} {
  const FENCE_SOURCE_WRAP = `<fsm-${Math.random().toString(36).slice(2)}>`
  const FENCE_SOURCE_REGEX = new RegExp(`${FENCE_SOURCE_WRAP}(.+?)${FENCE_SOURCE_WRAP}`)

  function stringifyFenceSourceMap(source: FenceSourceMap): string {
    const data = JSON.stringify(source)
    return `${FENCE_SOURCE_WRAP}${data}${FENCE_SOURCE_WRAP}`
  }

  function inject(code: string, path: string = ''): { code: string } {
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

        const payload: FenceSourceMap = { path, from: codeStart, to: codeEnd }
        s.appendRight(codeStart, stringifyFenceSourceMap(payload))
      }
    }

    return {
      code: s.toString(),
    }
  }

  function extract(code: string): { code: string, sourceMap: FenceSourceMap | null } {
    let sourceMap: FenceSourceMap | null = null

    try {
      code = code.replace(FENCE_SOURCE_REGEX, (_, p1: string) => {
        sourceMap = JSON.parse(p1) as FenceSourceMap
        return ''
      })
    }
    catch {
    // ignore
    }

    return { code, sourceMap }
  }

  return {
    inject,
    extract,
  }
}

export function withFenceSourceMap(config: UserConfig): UserConfig {
  const { inject: injectFenceSourceMap, extract: extractFenceSourceMap } = createFenceSourceMap()

  // inject source map to all fences on load
  const InjectPlugin: Plugin = {
    name: 'vitepress-twoslash:inject-fence-source-map',
    enforce: 'pre',
    load(id) {
      if (id.endsWith('.md')) {
        const code = readFileSync(id, 'utf-8')
        return injectFenceSourceMap(code, id)
      }
    },
  }

  // extract and remove source map from fence
  const transformer: ShikiTransformer = {
    name: 'vitepress-twoslash:extract-fence-source-map',
    enforce: 'pre',
    preprocess(code) {
      const { code: transformedCode, sourceMap } = extractFenceSourceMap(code)
      this.meta.sourceMap = sourceMap
      return transformedCode
    },
  }

  // config markdown code transformers
  const codeTransformers = (config.markdown ??= {}).codeTransformers ??= []
  codeTransformers.unshift(transformer)

  // config vite plugins
  const plugins = (config.vite ??= {}).plugins ??= []
  plugins.push(InjectPlugin)

  return config
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
