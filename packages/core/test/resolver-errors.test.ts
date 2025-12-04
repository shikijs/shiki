import { describe, expect, it } from 'vitest'
import { createJavaScriptRegexEngine } from '../../engine-javascript/src/index'
import { createShikiInternal } from '../src/constructors/internal'

describe('resolver error handling', () => {
  it('should throw helpful error for invalid language', async () => {
    const shiki = await createShikiInternal({
      engine: createJavaScriptRegexEngine(),
      themes: [],
      langs: [],
    })

    expect(() => shiki.getLanguage('invalid-lang'))
      .toThrowError(/Language `invalid-lang` not found/)
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
})
