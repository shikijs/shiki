import { EmulatedRegExp } from 'oniguruma-to-es'
import { format } from 'prettier'
import { expect, it } from 'vitest'
import { toJsLiteral } from './langs'
import { precompileGrammar } from './precompile'

it('precompile', async () => {
  const grammar = await import('@shikijs/langs/yaml').then(m => m.default[0])
  const precompiled = precompileGrammar(grammar)
  expect(
    await format(`export default ${toJsLiteral(precompiled)}`, {
      parser: 'babel-ts',
    }),
  ).toMatchSnapshot()
})

it('should EmulatedRegExp inherits from RegExp', async () => {
  const regex = new EmulatedRegExp('a', 'g')
  expect(regex instanceof RegExp).toBe(true)
})
