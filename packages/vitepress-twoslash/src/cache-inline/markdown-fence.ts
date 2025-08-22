export interface MarkdownFenceSourceMap {
  path: string
  from: number
  to: number
}

/**
 * Maps markdown code to its source map positions.
 * @param code markdown source
 * @param path markdown file path
 * @returns map of inject positions to source maps
 */
export type MarkdownFencesSourceMapper = (code: string, path: string) => Map<number, MarkdownFenceSourceMap>

export interface MarkdownFenceSourceMapCodec {
  /**
   * Injects source map data into the markdown source.
   * @param code markdown source
   * @param injects map of inject positions to source maps
   * @returns markdown source with injected source maps
   */
  injectToMarkdown: (code: string, path: string) => string

  /**
   * Extract source map from fence code snippet.
   * @param code fence code snippet
   * @returns extracted code and source map
   */
  extractFromFence: (code: string) => { code: string, sourceMap: MarkdownFenceSourceMap | null }
}

export function createMarkdownFenceSourceCodec(mapper: MarkdownFencesSourceMapper): MarkdownFenceSourceMapCodec {
  const FENCE_SOURCE_WRAP = `<fsm-${Math.random().toString(36).slice(2)}>`
  const FENCE_SOURCE_REGEX = new RegExp(`\/\/ ${FENCE_SOURCE_WRAP}(.+?)${FENCE_SOURCE_WRAP}\\n`)

  function stringifyFenceSourceMap(sourceMap: MarkdownFenceSourceMap): string {
    const data = JSON.stringify(sourceMap)
    return `// ${FENCE_SOURCE_WRAP}${data}${FENCE_SOURCE_WRAP}\n`
  }

  function injectToMarkdown(code: string, path: string): string {
    const injects = mapper(code, path)

    // start injection, process in descending order to preserve offsets
    let newCode = code
    const injectAts = Array.from(injects.keys()).sort((a, b) => b - a)
    for (const at of injectAts) {
      const sourceMap = injects.get(at)!
      const data = stringifyFenceSourceMap(sourceMap)

      // insert data to `at` position
      newCode = newCode.slice(0, at) + data + newCode.slice(at)
    }

    return newCode
  }

  function extractFromFence(code: string): { code: string, sourceMap: MarkdownFenceSourceMap | null } {
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
    injectToMarkdown,
    extractFromFence,
  }
}
