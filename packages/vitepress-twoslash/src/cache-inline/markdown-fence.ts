export interface MarkdownFenceRange {
  from: number
  to: number
}

export interface MarkdownFenceSourceMap extends MarkdownFenceRange {
  path: string
}

export type MarkdownFencesLocator = (code: string) => MarkdownFenceRange[]

export type MarkdownInjectPosition = number

export function createMarkdownFenceSourceCodec(): {
  inject: (code: string, injects: Map<MarkdownInjectPosition, MarkdownFenceSourceMap>) => string
  extract: (code: string) => { code: string, sourceMap: MarkdownFenceSourceMap | null }
} {
  const FENCE_SOURCE_WRAP = `<fsm-${Math.random().toString(36).slice(2)}>`
  const FENCE_SOURCE_REGEX = new RegExp(`\/\/ ${FENCE_SOURCE_WRAP}(.+?)${FENCE_SOURCE_WRAP}\\n`)

  function stringifyFenceSourceMap(sourceMap: MarkdownFenceSourceMap): string {
    const data = JSON.stringify(sourceMap)
    return `// ${FENCE_SOURCE_WRAP}${data}${FENCE_SOURCE_WRAP}\n`
  }

  /**
   * Injects source map data into the markdown source.
   * @param code markdown source
   * @param injects map of inject positions to source maps
   * @returns markdown source with injected source maps
   */
  function inject(code: string, injects: Map<number, MarkdownFenceSourceMap>): string {
    let newCode = code

    // process in descending order to preserve offsets
    const injectAts = Array.from(injects.keys()).sort((a, b) => b - a)

    for (const at of injectAts) {
      const sourceMap = injects.get(at)!
      const data = stringifyFenceSourceMap(sourceMap)

      // insert data to `at` position
      newCode = newCode.slice(0, at) + data + newCode.slice(at)
    }

    return newCode
  }

  /**
   * Extract source map from fence code snippet.
   * @param code fence code snippet
   * @returns extracted code and source map
   */
  function extract(code: string): { code: string, sourceMap: MarkdownFenceSourceMap | null } {
    let sourceMap: MarkdownFenceSourceMap | null = null

    try {
      code = code.replace(FENCE_SOURCE_REGEX, (_, p1: string) => {
        sourceMap = JSON.parse(p1) as MarkdownFenceSourceMap
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
