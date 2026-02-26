import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript'
import js from '@shikijs/langs/javascript'
import nord from '@shikijs/themes/nord'
import { describe, expect, it } from 'vitest'
import { codeToTokensBase, codeToTokensWithThemes, createShikiPrimitive, createShikiPrimitiveAsync } from '../src'

describe('tokenizer', () => {
  it('createShikiPrimitiveAsync + codeToTokensBase', async () => {
    const internal = await createShikiPrimitiveAsync({
      langs: [js],
      themes: [nord],
      engine: createJavaScriptRegexEngine(),
    })

    const tokens = codeToTokensBase(internal, 'const x = 1', { lang: 'javascript', theme: 'nord' })

    expect(tokens).toBeDefined()
    expect(tokens.length).toBe(1)
    expect(tokens[0].length).toBeGreaterThan(0)
    expect(tokens[0][0].content).toBe('const')
  })

  it('createShikiPrimitive + codeToTokensBase', () => {
    const internal = createShikiPrimitive({
      langs: [js as any],
      themes: [nord],
      engine: createJavaScriptRegexEngine(),
    })

    const tokens = codeToTokensBase(internal, 'const x = 1', { lang: 'javascript', theme: 'nord' })

    expect(tokens).toBeDefined()
    expect(tokens.length).toBe(1)
  })

  it('throws ShikiError for ANSI lang', async () => {
    const internal = await createShikiPrimitiveAsync({
      langs: [js],
      themes: [nord],
      engine: createJavaScriptRegexEngine(),
    })

    expect(() => codeToTokensBase(internal, '\x1B[32mHello\x1B[0m', { lang: 'ansi', theme: 'nord' }))
      .toThrowError('Language `ansi` not found, you may need to load it first')
  })

  it('codeToTokensWithThemes', async () => {
    const internal = await createShikiPrimitiveAsync({
      langs: [js],
      themes: [nord],
      engine: createJavaScriptRegexEngine(),
    })

    const tokens = codeToTokensWithThemes(internal, 'const x = 1', {
      lang: 'javascript',
      themes: { dark: 'nord' },
    })

    expect(tokens).toBeDefined()
    expect(tokens.length).toBe(1)
  })

  it('plain text returns plain tokens', async () => {
    const internal = await createShikiPrimitiveAsync({
      langs: [],
      themes: [nord],
      engine: createJavaScriptRegexEngine(),
    })

    const tokens = codeToTokensBase(internal, 'hello world', { lang: 'text', theme: 'nord' })
    expect(tokens).toEqual([[{ content: 'hello world', offset: 0 }]])
  })
})
