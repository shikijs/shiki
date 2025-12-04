import { describe, expect, it } from 'vitest'
import { createJavaScriptRegexEngine } from '../../engine-javascript/src/index'
import { createShikiInternal } from '../src/constructors/internal'

describe('repro issue', () => {
  it('should throw error when missing embeddedLanguages', async () => {
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
