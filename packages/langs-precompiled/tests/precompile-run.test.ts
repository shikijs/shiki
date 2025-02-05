import { createJavaScriptRawEngine } from '@shikijs/engine-javascript'
import { createHighlighterCore } from 'shiki'
import { expect, it } from 'vitest'
// eslint-disable-next-line antfu/no-import-dist
import vitesseDark from '../../themes/dist/vitesse-dark.mjs'
// eslint-disable-next-line antfu/no-import-dist
import html from '../dist/html.mjs'

const isNode20andUp = process.version.replace(/^v/, '').split('.').map(Number)[0] >= 20

it.runIf(isNode20andUp)('run', async () => {
  const shiki = await createHighlighterCore({
    themes: [vitesseDark],
    langs: [html],
    engine: createJavaScriptRawEngine(),
  })

  const code = shiki.codeToHtml('<div>hello</div>', { lang: 'html', theme: 'vitesse-dark' })
  expect(code).toMatchSnapshot()
})
