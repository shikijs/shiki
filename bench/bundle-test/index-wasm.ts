import { codeToHtml, createShikiInternal } from '@shikijs/core'
import { createOnigurumaEngine } from '@shikijs/engine-oniguruma'

const shiki = createShikiInternal(
  {
    langs: [
      import('@shikijs/langs/ts'),
    ],
    themes: [
      import('@shikijs/themes/vitesse-dark'),
    ],
    engine: createOnigurumaEngine(import('@shikijs/engine-oniguruma/wasm-inlined')),
  },
)

export async function highlight(code: string): Promise<string> {
  return codeToHtml(await shiki, code, { lang: 'ts', theme: 'vitesse-dark' })
}
