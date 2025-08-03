import type { TwoslashShikiReturn, TwoslashTypesCache } from '@shikijs/twoslash'
import type { TwoslashExecuteOptions } from 'twoslash'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { hash as createOHash } from 'ohash'
import { resolveMetaFilePath } from './fence-path'

interface TwoslashFilePayload {
  version: number
  fileHash: string
  cache: Record<string, TwoslashShikiReturn>
}

export function createTwoslashMdCache(): TwoslashTypesCache {
  // TODO: LRU cache
  const payloads = new Map<string, TwoslashFilePayload>()
  const optionsKeyCache = new WeakMap<TwoslashExecuteOptions, string>()
  const mdFileChecksumCache = new Map<string, string>()

  function resolveOptionsKey(options: TwoslashExecuteOptions = {}): string {
    let key = optionsKeyCache.get(options)
    if (!key) {
      key = createOHash(options)
      optionsKeyCache.set(options, key)
    }
    return key
  }

  function resolveMdFileChecksum(filePath: string): string {
    let hash = mdFileChecksumCache.get(filePath)
    if (!hash) {
      const data = readFileSync(filePath, { encoding: 'utf-8' })
      hash = getStrHash(data)
      mdFileChecksumCache.set(filePath, hash)
    }
    return hash
  }

  function resolveCacheKey(code: string, lang: string, options?: TwoslashExecuteOptions): string {
    const optionsKey = resolveOptionsKey(options)
    return `${optionsKey}:${lang}:${getStrHash(code)}`
  }

  function resolveMdPayload(filePath: string): TwoslashFilePayload {
    let payload = payloads.get(filePath)
    if (!payload) {
      const fileHash = resolveMdFileChecksum(filePath)

      const cacheFile = `${filePath}.twoslash`
      if (existsSync(cacheFile)) {
        const data = readFileSync(cacheFile, { encoding: 'utf-8' })
        const payload: TwoslashFilePayload = JSON.parse(data)

        // TODO: payload validation
        if (payload) {
          if (payload.fileHash === fileHash) {
            payloads.set(filePath, payload)
            return payload
          }
          else {
            // file outdated
          }
        }
      }

      // create new payload
      payload = {
        version: 1,
        fileHash,
        cache: {},
      }
      payloads.set(filePath, payload)
    }
    return payload
  }

  function savePayload(filePath: string, payload: TwoslashFilePayload): void {
    const cacheFile = `${filePath}.twoslash`
    const data = JSON.stringify(payload, null, 2)
    writeFileSync(cacheFile, data, { encoding: 'utf-8' })
  }

  return {
    init() {
      // Initialization logic if needed
    },
    read(code, lang, options, meta) {
      const path = resolveMetaFilePath(meta?.__raw)
      if (!path) {
        return null
      }

      const payload = resolveMdPayload(path)

      const cacheKey = resolveCacheKey(code, lang, options)
      if (payload.cache[cacheKey])
        return payload.cache[cacheKey]

      return null
    },

    write(data, code, lang, options, meta) {
      const path = resolveMetaFilePath(meta?.__raw)
      if (!path)
        return

      const payload = resolveMdPayload(path)
      const cacheKey = resolveCacheKey(code, lang, options)
      payload.cache[cacheKey] = data

      savePayload(path, payload)
    },
  }
}

function getStrHash(str: string): string {
  return createHash('SHA256').update(str).digest('hex')
}
