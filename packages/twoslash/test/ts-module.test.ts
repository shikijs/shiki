import { codeToHtml } from 'shiki'
import ts from 'typescript'
import { describe, expect, it, vi } from 'vitest'
import { transformerTwoslash } from '../src'

// Wraps `ts` with a spy on `createLanguageService` so we can assert it was called
// by the virtual TypeScript environment that twoslash creates internally.
function spiedTsModule() {
  const createLanguageService = vi.fn((...args: Parameters<typeof ts.createLanguageService>) =>
    ts.createLanguageService(...args),
  )
  const tsModule = new Proxy(ts, {
    get(target, prop, receiver) {
      if (prop === 'createLanguageService')
        return createLanguageService
      return Reflect.get(target, prop, receiver)
    },
  }) as typeof ts
  return { tsModule, createLanguageService }
}

describe('transformerTwoslash: tsModule forwarding', () => {
  const sample = 'const a: number = 1'

  it('uses tsModule from top-level options', async () => {
    const { tsModule, createLanguageService } = spiedTsModule()

    await codeToHtml(sample, {
      lang: 'ts',
      theme: 'vitesse-dark',
      transformers: [
        transformerTwoslash({ cache: false, tsModule }),
      ],
    })

    expect(createLanguageService).toHaveBeenCalled()
  })

  it('uses tsModule from twoslashOptions as fallback', async () => {
    const { tsModule, createLanguageService } = spiedTsModule()

    await codeToHtml(sample, {
      lang: 'ts',
      theme: 'vitesse-dark',
      transformers: [
        transformerTwoslash({
          cache: false,
          twoslashOptions: { tsModule },
        }),
      ],
    })

    expect(createLanguageService).toHaveBeenCalled()
  })

  it('top-level tsModule takes precedence over twoslashOptions.tsModule', async () => {
    const topLevel = spiedTsModule()
    const nested = spiedTsModule()

    await codeToHtml(sample, {
      lang: 'ts',
      theme: 'vitesse-dark',
      transformers: [
        transformerTwoslash({
          cache: false,
          tsModule: topLevel.tsModule,
          twoslashOptions: { tsModule: nested.tsModule },
        }),
      ],
    })

    expect(topLevel.createLanguageService).toHaveBeenCalled()
    expect(nested.createLanguageService).not.toHaveBeenCalled()
  })
})
