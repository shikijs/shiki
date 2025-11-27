import { createJavaScriptRegexEngine } from 'shiki'
import { describe, expect, it } from 'vitest'
import { codeToTokens, createShikiInternal } from '../../src'

describe('bash angle brackets', () => {
  it('highlights contents inside angle brackets', async () => {
    using engine = await createShikiInternal({
      themes: [
        import('@shikijs/themes/vitesse-dark'),
      ],
      langs: [
        import('@shikijs/langs/bash'),
      ],
      engine: createJavaScriptRegexEngine(),
    })

    const code = [
      'pfinfo <usual_guide>',
      'test <abcd>',
    ].join('\n')

    const tokens = codeToTokens(engine, code, {
      lang: 'bash',
      theme: 'vitesse-dark',
    })

    expect(tokens).toMatchSnapshot()
  })
})

