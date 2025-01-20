import { createJavaScriptRegexEngine } from 'shiki'
import { expect, it } from 'vitest'
import { codeToTokensBase, createShikiInternal } from '../src'

it('includeExplanation', async () => {
  using engine = await createShikiInternal({
    themes: [
      import('@shikijs/themes/vitesse-dark'),
    ],
    langs: [
      import('@shikijs/langs/javascript'),
    ],
    engine: createJavaScriptRegexEngine(),
  })

  const code = 'console.log("hello")'
  const caseFalse = await codeToTokensBase(engine, code, { lang: 'js', theme: 'vitesse-dark', includeExplanation: false })
  const caseTrue = await codeToTokensBase(engine, code, { lang: 'js', theme: 'vitesse-dark', includeExplanation: true })
  const caseScopeName = await codeToTokensBase(engine, code, { lang: 'js', theme: 'vitesse-dark', includeExplanation: 'scopeName' })

  expect(caseFalse).toMatchSnapshot('false')
  expect(caseTrue).toMatchSnapshot('true')
  expect(caseScopeName).toMatchSnapshot('scopeName')
})
