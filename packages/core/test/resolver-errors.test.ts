import { describe, expect, it } from 'vitest'
import { createJavaScriptRegexEngine } from '../../engine-javascript/src/index'
import { createShikiInternal } from '../src/constructors/internal'
import { Resolver } from '../src/textmate/resolver'

describe('resolver error handling', () => {
  it('should throw helpful error for invalid language with no languages loaded', () => {
    const engine = createJavaScriptRegexEngine()
    const resolver = new Resolver(engine, [])

    expect(() => resolver.getLangRegistration('invalid-lang'))
      .toThrowError(/Language "invalid-lang" not found/)
  })

  it('should throw helpful error for invalid language with languages loaded', () => {
    const engine = createJavaScriptRegexEngine()
    const testLang = {
      name: 'test',
      scopeName: 'source.test',
      patterns: [],
      repository: {},
    }
    const resolver = new Resolver(engine, [testLang])

    expect(() => resolver.getLangRegistration('invalid-lang'))
      .toThrowError(/Language "invalid-lang" not found/)
    expect(() => resolver.getLangRegistration('invalid-lang'))
      .toThrowError(/Available languages:/)
  })

  it('should throw helpful error when loading language with invalid embedded language', async () => {
    const shiki = await createShikiInternal({
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
      .toThrowError(/Missing languages `missing-lang`, required by `test-lang`/)
  })

  it('should throw helpful error for invalid language via public API', async () => {
    const shiki = await createShikiInternal({
      engine: createJavaScriptRegexEngine(),
      themes: [],
      langs: [],
    })

    expect(() => shiki.getLanguage('invalid-lang'))
      .toThrowError(/Language `invalid-lang` not found/)
  })

  it('should handle lazy embedded language loading', async () => {
    const shiki = await createShikiInternal({
      engine: createJavaScriptRegexEngine(),
      themes: [],
      langs: [],
    })

    // Load a parent language that embeds another language lazily
    const parentLang = {
      name: 'parent',
      scopeName: 'source.parent',
      patterns: [],
      repository: {},
      embeddedLangsLazy: ['child'],
    }

    const childLang = {
      name: 'child',
      scopeName: 'source.child',
      patterns: [],
      repository: {},
    }

    // Load parent first (child not loaded yet)
    await shiki.loadLanguage(parentLang)

    // Now load child - this should trigger lazy reload of parent
    await shiki.loadLanguage(childLang)

    // Both should be loaded
    expect(shiki.getLoadedLanguages()).toContain('parent')
    expect(shiki.getLoadedLanguages()).toContain('child')
  })
})
