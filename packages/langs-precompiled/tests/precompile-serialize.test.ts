import { EmulatedRegExp } from 'oniguruma-to-es'
import { format } from 'prettier'
import { expect, it } from 'vitest'
import { toJsLiteral } from '../scripts/langs'
import { precompileGrammar } from '../scripts/precompile'

const isNode20andUp = process.version.replace(/^v/, '').split('.').map(Number)[0] >= 20

it.runIf(isNode20andUp)('precompile', async () => {
  const grammar = await import('@shikijs/langs/yaml').then(m => m.default[0])
  const precompiled = precompileGrammar(grammar)
  expect(
    await format(`export default ${toJsLiteral(precompiled)}`, {
      parser: 'babel-ts',
    }),
  ).toMatchSnapshot()
})

it.runIf(isNode20andUp)('should EmulatedRegExp inherits from RegExp', async () => {
  const regex = new EmulatedRegExp('a', 'g')
  expect(regex instanceof RegExp).toBe(true)
})
