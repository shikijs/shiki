import MagicString from 'magic-string'

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
  inject: (code: string, sourceMaps: FenceSourceMap[]) => { code: string }
  extract: (code: string) => { code: string, sourceMap: FenceSourceMap | null }
} {
  const FENCE_SOURCE_WRAP = `<fsm-${Math.random().toString(36).slice(2)}>`
  const FENCE_SOURCE_REGEX = new RegExp(`\/\/ ${FENCE_SOURCE_WRAP}(.+?)${FENCE_SOURCE_WRAP}\\n`)

  function stringifyFenceSourceMap(source: FenceSourceMap): string {
    const data = JSON.stringify(source)
    return `// ${FENCE_SOURCE_WRAP}${data}${FENCE_SOURCE_WRAP}\n`
  }

  function inject(code: string, sourceMaps: FenceSourceMap[]): { code: string } {
    const s = new MagicString(code)

    for (const sourceMap of sourceMaps) {
      s.appendLeft(sourceMap.from, stringifyFenceSourceMap(sourceMap))
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
