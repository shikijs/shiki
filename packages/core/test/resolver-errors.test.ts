import { describe, expect, it } from 'vitest'
import { createJavaScriptRegexEngine } from '../../engine-javascript/src/index'
import { createShikiInternal } from '../src/constructors/internal'
import { Resolver } from '../src/textmate/resolver'

describe('resolver and registry error handling', () => {
  describe('resolver.getLangRegistration', () => {
    it('should throw error with empty available languages list', () => {
      const engine = createJavaScriptRegexEngine()
      const resolver = new Resolver(engine, [])

      expect(() => resolver.getLangRegistration('invalid-lang'))
        .toThrowError(/Language "invalid-lang" not found/)
      expect(() => resolver.getLangRegistration('invalid-lang'))
        .toThrowError(/Available languages: $/)
    })

    it('should throw error with populated available languages list', () => {
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
        .toThrowError(/Available languages: test/)
    })
  })

  describe('registry lazy reload', () => {
    it('should successfully reload parent when child is loaded', async () => {
      const shiki = await createShikiInternal({
        engine: createJavaScriptRegexEngine(),
        themes: [],
        langs: [],
      })

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

      await shiki.loadLanguage(parentLang)
      await shiki.loadLanguage(childLang)

      expect(shiki.getLoadedLanguages()).toContain('parent')
      expect(shiki.getLoadedLanguages()).toContain('child')
    })

    it('should handle multiple languages with lazy embeds', async () => {
      const shiki = await createShikiInternal({
        engine: createJavaScriptRegexEngine(),
        themes: [],
        langs: [],
      })

      const lang1 = {
        name: 'lang1',
        scopeName: 'source.lang1',
        patterns: [],
        repository: {},
        embeddedLangsLazy: ['shared'],
      }

      const lang2 = {
        name: 'lang2',
        scopeName: 'source.lang2',
        patterns: [],
        repository: {},
        embeddedLangsLazy: ['shared'],
      }

      const shared = {
        name: 'shared',
        scopeName: 'source.shared',
        patterns: [],
        repository: {},
      }

      await shiki.loadLanguage(lang1)
      await shiki.loadLanguage(lang2)
      await shiki.loadLanguage(shared)

      const loaded = shiki.getLoadedLanguages()
      expect(loaded).toContain('lang1')
      expect(loaded).toContain('lang2')
      expect(loaded).toContain('shared')
    })
  })

  describe('public API error handling', () => {
    it('should throw helpful error for invalid language', async () => {
      const shiki = await createShikiInternal({
        engine: createJavaScriptRegexEngine(),
        themes: [],
        langs: [],
      })

      expect(() => shiki.getLanguage('invalid-lang'))
        .toThrowError(/Language `invalid-lang` not found/)
    })

    it('should throw error for missing embedded languages', async () => {
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
  })
})
