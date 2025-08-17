import type { TwoslashShikiReturn, TwoslashTypesCache } from '@shikijs/twoslash'
import type { TwoslashExecuteOptions } from 'twoslash'
import type { FenceSource } from './fence-source'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import MagicString from 'magic-string'
import { hash as createOHash } from 'ohash'

interface TwoslashCodePayload {
  version: number
  hash: string
  twoslash: TwoslashShikiReturn
}

const CODE_INLINE_CACHE_KEY = '@cache'
const CODE_INLINE_CACHE_REGEX = new RegExp(`// ${CODE_INLINE_CACHE_KEY}: (.*)\\n`, 'g')

declare module '@shikijs/core' {
  interface ShikiTransformerContextMeta {
    __cache?: TwoslashShikiReturn
    __patch?: (newCache: string) => void
  }
}

export function createTwoslashMdCache(patcher: FilePatcher): TwoslashTypesCache {
  const optionsKeyCache = new WeakMap<TwoslashExecuteOptions, string>()
  function resolveOptionsKey(options: TwoslashExecuteOptions = {}): string {
    let key = optionsKeyCache.get(options)
    if (!key) {
      key = createOHash(options)
      optionsKeyCache.set(options, key)
    }
    return key
  }

  function cacheHash(code: string, lang: string, options?: TwoslashExecuteOptions): string {
    const optionsKey = resolveOptionsKey(options)
    return `${optionsKey}:${lang}:${getStrHash(code)}`
  }

  function generateCodeCache(data: TwoslashShikiReturn, code: string, lang: string, options?: TwoslashExecuteOptions): string {
    const hash = cacheHash(code, lang, options)
    const payload: TwoslashCodePayload = {
      version: 1,
      hash,
      twoslash: data,
    }
    return JSON.stringify(payload)
  }

  function resolveCodePayload(cache: string): TwoslashCodePayload | null {
    // TODO: verify version
    try {
      const payload = JSON.parse(cache) as TwoslashCodePayload
      if (payload.version === 1) {
        return payload
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

    if (search) {
      const cachePos = file.content.indexOf(search, source.from)
      if (cachePos !== -1 && cachePos < source.to) {
        // found a match
        patchKey = FilePatcher.key(cachePos, cachePos + search.length)
      }
    }

    return (newCache: string) => {
      file.patches.set(patchKey, newCache)
    }
  }

  return {
    preprocess(code, lang, options, meta) {
      let rawCache = ''
      let cacheString = ''

      code = code.replaceAll(CODE_INLINE_CACHE_REGEX, (full, p1: string) => {
        // save the first occurrence only
        if (!rawCache.length) {
          cacheString = p1
          rawCache = full
        }

        // replace all occurrences
        return ''
      })

      if (cacheString) {
        const cache = resolveCodePayload(cacheString)
        if (cache?.hash === cacheHash(code, lang, options))
          meta.__cache = cache.twoslash
      }

      if (meta.source)
        meta.__patch = resolveSourcePatcher(meta.source, rawCache)

      return code
    },
    read(code, lang, options, meta) {
      return meta.__cache ?? null
    },
    write(data, code, lang, options, meta) {
      const cacheStr = `// @cache: ${generateCodeCache(data, code, lang, options)}\n`
      meta.__patch?.(cacheStr)
    },
  }
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

function getStrHash(str: string): string {
  return createHash('SHA256').update(str).digest('hex')
}
