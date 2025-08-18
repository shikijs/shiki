import type { TwoslashShikiReturn, TwoslashTypesCache } from '@shikijs/twoslash'
import type { TwoslashExecuteOptions } from 'twoslash'
import type { FenceSource } from './fence-source'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import LZString from 'lz-string'
import MagicString from 'magic-string'
import { hash as createOHash } from 'ohash'

interface TwoslashCachePayload {
  v: number
  hash: string
  data: string
}

const CODE_INLINE_CACHE_KEY = '@twoslash-cache'
const CODE_INLINE_CACHE_REGEX = new RegExp(`// ${CODE_INLINE_CACHE_KEY}: (.*)(?:\n|$)`, 'g')

declare module '@shikijs/core' {
  interface ShikiTransformerContextMeta {
    __cache?: TwoslashShikiReturn
    __patch?: (newCache: string) => void
  }
}

export function createTwoslashMdCache(): {
  twoslashCache: TwoslashTypesCache
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

  function cacheHash(code: string, lang: string, options?: TwoslashExecuteOptions): string {
    return sha256Hash(`${getOptionsHash(options)}:${lang}:${code}`)
  }

  function generateCodeCache(data: TwoslashShikiReturn, code: string, lang: string, options?: TwoslashExecuteOptions): string {
    const hash = cacheHash(code, lang, options)
    const payload: TwoslashCachePayload = {
      v: 1,
      hash,
      data: LZString.compressToBase64(JSON.stringify(data)),
    }
    return JSON.stringify(payload)
  }

  function resolveCodePayload(cache: string): {
    payload: TwoslashCachePayload
    twoslash: () => TwoslashShikiReturn | null
  } | null {
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

  function resolveSourcePatcher(source: FenceSource, search?: string): (newCache: string) => void {
    const file = patcher.load(source.path)
    let patchKey = FilePatcher.key(source.from)
    let linebreak = true

    if (search) {
      const cachePos = file.content.indexOf(search, source.from)
      if (cachePos !== -1 && cachePos < source.to) {
        // found a match
        patchKey = FilePatcher.key(cachePos, cachePos + search.length)
        linebreak = search.endsWith('\n')
      }
    }

    return (newCache: string) => {
      file.patches.set(patchKey, newCache + (linebreak ? '\n' : ''))
    }
  }

  const twoslashCache: TwoslashTypesCache = {
    preprocess(code, lang, options, meta) {
      let rawCache = ''
      let cacheString = ''

      code = code.replaceAll(CODE_INLINE_CACHE_REGEX, (full, p1: string) => {
        // save the first occurrence only
        if (!rawCache.length) {
          cacheString = p1
          rawCache = full
        }
        else {
          console.warn('ignore duplicate inline cache:', meta.source?.path)
        }

        // replace all occurrences
        return ''
      })

      if (cacheString) {
        const cache = resolveCodePayload(cacheString)
        if (cache?.payload.hash === cacheHash(code, lang, options)) {
          const twoslash = cache.twoslash()
          if (twoslash)
            meta.__cache = twoslash
        }
      }

      if (meta.source)
        meta.__patch = resolveSourcePatcher(meta.source, rawCache)

      return code
    },
    read(code, lang, options, meta) {
      return meta.__cache ?? null
    },
    write(data, code, lang, options, meta) {
      const cacheStr = `// ${CODE_INLINE_CACHE_KEY}: ${generateCodeCache(data, code, lang, options)}`
      meta.__patch?.(cacheStr)
    },
  }

  return { twoslashCache, patcher }
}

export class FilePatcher {
  private files = new Map<string, { content: string, patches: Map<string, string> }>()

  static key(from: number, to?: number): string {
    return `${from}${to ? `:${to}` : ''}`
  }

  load(path: string): { content: string, patches: Map<string, string> } {
    let file = this.files.get(path)
    if (!file) {
      const content = existsSync(path) ? readFileSync(path, { encoding: 'utf-8' }) : ''
      file = { content, patches: new Map() }
      this.files.set(path, file)
    }
    return file
  }

  patch(path: string): void {
    const file = this.files.get(path)
    if (file) {
      if (file.patches.size) {
        const s = new MagicString(file.content)

        // apply patches
        for (const [key, value] of file.patches) {
          const [from, to] = key.split(':').map(s => s !== '' ? Number(s) : undefined)
          if (from === undefined)
            continue

          if (to !== undefined) {
            s.update(from, to, value)
          }
          else {
            s.appendRight(from, value)
          }
        }

        // write the patched content back to the file
        const content = s.toString()
        writeFileSync(path, content, { encoding: 'utf-8' })
      }
      this.files.delete(path)
    }
  }
}

// Private Utils

function sha256Hash(str: string): string {
  return createHash('SHA256').update(str).digest('hex')
}
