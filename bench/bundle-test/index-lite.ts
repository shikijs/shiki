import { codeToHtml, createShikiInternal } from '@shikijs/core'
import { createJavaScriptRawEngine } from '@shikijs/engine-javascript/raw'

const shiki = createShikiInternal(
  {
    langs: [
      import('@shikijs/langs-precompiled/ts'),
    ],
    themes: [
      import('@shikijs/themes/vitesse-dark'),
    ],
    engine: createJavaScriptRawEngine(),
  },
)

export async function highlight(code: string): Promise<string> {
  return codeToHtml(await shiki, code, { lang: 'ts', theme: 'vitesse-dark' })
}
