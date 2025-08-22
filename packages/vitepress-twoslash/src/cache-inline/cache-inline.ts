import type { TwoslashShikiReturn, TwoslashTypesCache } from '@shikijs/twoslash'
import type { TwoslashExecuteOptions, TwoslashReturn } from 'twoslash'
import type { MarkdownFenceSourceMap } from './markdown-fence'
import { createHash } from 'node:crypto'
import LZString from 'lz-string'
import { hash as createOHash } from 'ohash'
import { FilePatcher } from './file-patcher'

interface TwoslashCachePayload {
  v: number
  hash: string
  data: string
}

const CODE_INLINE_CACHE_KEY = '@twoslash-cache'
const CODE_INLINE_CACHE_REGEX = new RegExp(`// ${CODE_INLINE_CACHE_KEY}: (.*)(?:\n|$)`, 'g')

declare module '@shikijs/core' {
  interface ShikiTransformerContextMeta {
    sourceMap?: MarkdownFenceSourceMap | null
    __cache?: TwoslashShikiReturn
    __patch?: (newCache: string) => void
  }
}

export function createInlineTypesCache({ remove, ignoreCache }: {
  remove?: boolean
  ignoreCache?: boolean
} = {}): {
  typesCache: TwoslashTypesCache
  patcher: FilePatcher
} {
  const patcher = new FilePatcher()

  const optionsHashCache = new WeakMap<TwoslashExecuteOptions, string>()
  function getOptionsHash(options: TwoslashExecuteOptions = {}): string {
    let hash = optionsHashCache.get(options)
    if (!hash) {
      hash = createOHash(options)
      optionsHashCache.set(options, hash)
    }
    return hash
  }

  function cacheHash(code: string, lang?: string, options?: TwoslashExecuteOptions): string {
    return sha256Hash(`${getOptionsHash(options)}:${lang ?? ''}:${code}`)
  }

  function stringifyCachePayload(data: TwoslashShikiReturn, code: string, lang?: string, options?: TwoslashExecuteOptions): string {
    const hash = cacheHash(code, lang, options)
    const payload: TwoslashCachePayload = {
      v: 1,
      hash,
      data: LZString.compressToBase64(JSON.stringify(data)),
    }
    return JSON.stringify(payload)
  }

  function resolveCachePayload(cache: string): {
    payload: TwoslashCachePayload
    twoslash: () => TwoslashShikiReturn | null
  } | null {
    if (!cache)
      return null

    try {
      const payload = JSON.parse(cache) as TwoslashCachePayload
      if (payload.v === 1) {
        return {
          payload,
          twoslash: () => {
            try {
              return JSON.parse(LZString.decompressFromBase64(payload.data))
            }
            catch {
              return null
            }
          },
        }
      }
    }
    catch {
      // ignore
    }
    return null
  }

  function resolveSourcePatcher(source: MarkdownFenceSourceMap, search?: string): ((newCache: string) => void) | undefined {
    const file = patcher.load(source.path)
    if (file === null)
      return undefined

    const range: { from: number, to?: number } = { from: source.from }
    let linebreak = true

    if (search) {
      const cachePos = file.content.indexOf(search, source.from)
      if (cachePos !== -1 && cachePos < source.to) {
        // found a match
        range.from = cachePos
        range.to = cachePos + search.length
        linebreak = search.endsWith('\n')
      }
    }

    const patchKey = FilePatcher.key(range.from, range.to)
    return (newCache: string) => {
      if (newCache === '') {
        // remove if found match
        if (range.to !== undefined)
          file.patches.set(patchKey, '')
        return
      }
      file.patches.set(patchKey, newCache + (linebreak ? '\n' : ''))
    }
  }

  const typesCache: TwoslashTypesCache = {
    preprocess(code, lang, options, meta) {
      if (!meta)
        return

      let rawCache = ''
      let cacheString = ''

      code = code.replaceAll(CODE_INLINE_CACHE_REGEX, (full, p1: string) => {
        // save the first occurrence only
        if (!rawCache.length) {
          cacheString = p1
          rawCache = full
        }
        else {
          // ignore duplicate inline cache (maybe using @include)
        }

        // replace all occurrences
        return ''
      })

      // resolve cache from string
      const shouldLoadCache = !ignoreCache && !remove
      if (shouldLoadCache) {
        const cache = resolveCachePayload(cacheString)
        if (cache?.payload.hash === cacheHash(code, lang, options)) {
          const twoslash = cache.twoslash()
          if (twoslash)
            meta.__cache = twoslash
        }
      }

      if (meta.sourceMap)
        meta.__patch = resolveSourcePatcher(meta.sourceMap, rawCache)

      return code
    },
    read(code, lang, options, meta) {
      return meta?.__cache ?? null
    },
    write(code, data, lang, options, meta) {
      if (remove) {
        meta?.__patch?.('')
        return
      }

      const twoslashShiki = simplifyTwoslashReturn(data)
      const cacheStr = `// ${CODE_INLINE_CACHE_KEY}: ${stringifyCachePayload(twoslashShiki, code, lang, options)}`
      meta?.__patch?.(cacheStr)
    },
  }

  return { typesCache, patcher }
}

function sha256Hash(str: string): string {
  return createHash('SHA256').update(str).digest('hex')
}

// pick necessary types to Shiki, converter of TwoslashShikiReturn
function simplifyTwoslashReturn(ret: TwoslashReturn | TwoslashShikiReturn): TwoslashShikiReturn {
  return {
    nodes: ret.nodes,
    code: ret.code,
    meta: ret.meta ? { extension: ret.meta.extension } : undefined,
  }
}
