import type { TwoslashTypesCache } from '../src'
import { codeToHtml } from 'shiki'
import { describe, expect, it, vi } from 'vitest'
import { transformerTwoslash } from '../src'

function createSpyCache(): TwoslashTypesCache {
  const cache = new Map<string, any>()
  return {
    read: vi.fn((code: string) => cache.get(code) ?? null),
    write: vi.fn((code: string, data: any) => {
      cache.set(code, data)
    }),
  }
}

describe('twoslash typesCache', () => {
  const sample = 'const a: number = 1'

  it('writes to cache on first run and reuses it on second run (same code)', async () => {
    const typesCache = createSpyCache()
    const transformer = transformerTwoslash({ typesCache })

    // First render (miss then write)
    await codeToHtml(sample, {
      lang: 'ts',
      theme: 'vitesse-dark',
      transformers: [transformer],
    })

    expect(typesCache.read).toHaveBeenCalledTimes(1)
    expect(typesCache.write).toHaveBeenCalledTimes(1)

    // Second render with the exact same code (hit, no write)
    await codeToHtml(sample, {
      lang: 'ts',
      theme: 'vitesse-dark',
      transformers: [transformer],
    })

    expect(typesCache.read).toHaveBeenCalledTimes(2)
    expect(typesCache.write).toHaveBeenCalledTimes(1)
  })

  it('misses and writes again when code changes (different code)', async () => {
    const typesCache = createSpyCache()
    const transformer = transformerTwoslash({ typesCache })

    await codeToHtml(sample, {
      lang: 'ts',
      theme: 'vitesse-dark',
      transformers: [transformer],
    })

    const modified = `${sample}\nconst b: string = 'foo'`
    await codeToHtml(modified, {
      lang: 'ts',
      theme: 'vitesse-dark',
      transformers: [transformer],
    })

    expect(typesCache.read).toHaveBeenCalledTimes(2)
    expect(typesCache.write).toHaveBeenCalledTimes(2)
  })
})
