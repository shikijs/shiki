import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript'
import { describe, expect, it, vi } from 'vitest'
import { createShikiPrimitiveAsync } from '../src'

const RE_MISSING_LANG_ERROR = /Missing languages `missing-lang`, required by `test-lang`/

describe('repro issue', () => {
  it('should throw error when missing embeddedLanguages', async () => {
    const shiki = await createShikiPrimitiveAsync({
      engine: createJavaScriptRegexEngine(),
      themes: [],
      langs: [],
    })

    await expect(shiki.loadLanguage({
      name: 'test-lang',
      scopeName: 'source.test',
      embeddedLanguages: ['missing-lang'],
      patterns: [],
      repository: {},
    }))
      .rejects
      .toThrowError(RE_MISSING_LANG_ERROR)
  })

  it('disposes grammars reloaded after a lazily embedded language loads', async () => {
    const shiki = await createShikiPrimitiveAsync({
      engine: createJavaScriptRegexEngine(),
      themes: [],
      langs: [{
        name: 'host',
        scopeName: 'source.host',
        embeddedLangsLazy: ['guest'],
        patterns: [{ include: 'source.guest' }],
        repository: {},
      }],
    })

    const before = shiki.getLanguage('host')
    const dispose = vi.spyOn(before as any, 'dispose')

    await shiki.loadLanguage({
      name: 'guest',
      scopeName: 'source.guest',
      patterns: [],
      repository: {},
    })

    expect(shiki.getLanguage('host')).not.toBe(before)
    expect(dispose).toHaveBeenCalledOnce()
  })
})
