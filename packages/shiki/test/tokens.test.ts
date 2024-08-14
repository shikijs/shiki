import { expect, it } from 'vitest'
import { codeToTokensBase } from '../src'

it('includeExplanation', async () => {
  const code = 'console.log("hello")'
  const caseFalse = await codeToTokensBase(code, { lang: 'js', theme: 'vitesse-dark', includeExplanation: false })
  const caseTrue = await codeToTokensBase(code, { lang: 'js', theme: 'vitesse-dark', includeExplanation: true })
  const caseScopeName = await codeToTokensBase(code, { lang: 'js', theme: 'vitesse-dark', includeExplanation: 'scopeName' })

  expect(caseFalse).toMatchSnapshot('false')
  expect(caseTrue).toMatchSnapshot('true')
  expect(caseScopeName).toMatchSnapshot('scopeName')
})
