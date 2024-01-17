/// <reference types="vite/client" />

import { describe, expect, it } from 'vitest'
import type { ShikijiTransformer } from 'shikiji'
import { codeToHtml } from 'shikiji'
import {
  transformerCompactLineOptions,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerRemoveLineBreak,
  transformerRenderWhitespace,
} from '../src'

function suite(
  name: string,
  files: Record<string, string>,
  transformers: ShikijiTransformer[],
  replace?: (code: string) => string,
  outputSuffix = '',
) {
  describe(name, () => {
    for (const path of Object.keys(files)) {
      if (path.endsWith('.output.html'))
        continue

      it(path, async () => {
        const ext = path.split('.').pop()!

        let code = await codeToHtml(files[path], {
          lang: ext,
          theme: 'github-dark',
          transformers,
        })

        if (replace)
          code = replace(code)

        expect(code)
          .toMatchFileSnapshot(`${path}${outputSuffix}.output.html`)
      })
    }
  })
}

const CSS_RENDER_WHITESPACE = `
<style>
* { tab-size: 4; }
body { margin: 0; }
.shiki { padding: 1em; }
.tab, .space { position: relative; }
.tab::before { content: "\\21E5"; position: absolute; opacity: 0.3; }
.space::before { content: "\\B7"; position: absolute; opacity: 0.3; }
</style>
`

// ---------

suite(
  'diff',
  import.meta.glob('./fixtures/diff/*.*', { as: 'raw', eager: true }),
  [transformerNotationDiff(), transformerRemoveLineBreak()],
  code => `${code}
<style>
body { margin: 0; }
.shiki { padding: 1.5em; }
.line { display: block; width: 100%; height: 1.2em; }
.diff { margin: 0 -24px; padding: 0 24px; }
.diff.add { background-color: #0505; }
.diff.remove { background-color: #8005; }
.diff:before { position: absolute; left: 5px; }
.diff.add:before { content: "+"; color: green;}
.diff.remove:before { content: "-"; color: red; }
</style>`,
)

suite(
  'focus',
  import.meta.glob('./fixtures/focus/*.*', { as: 'raw', eager: true }),
  [transformerNotationFocus(), transformerRemoveLineBreak()],
  code => `${code}
<style>
body { margin: 0; }
.shiki { padding: 1em; }
.line { display: block; width: 100%; height: 1.2em; }
.has-focused .focused { background-color: #8805; }
</style>`,
)

suite(
  'highlight',
  import.meta.glob('./fixtures/highlight/*.*', { as: 'raw', eager: true }),
  [transformerNotationHighlight(), transformerRemoveLineBreak()],
  code => `${code}
<style>
body { margin: 0; }
.shiki { padding: 1em; }
.line { display: block; width: 100%; height: 1.2em; }
.highlighted { background-color: #8885; }
</style>`,
)

suite(
  'highlight-word',
  import.meta.glob('./fixtures/highlight-word/*.*', { as: 'raw', eager: true }),
  [transformerNotationWordHighlight(), transformerRemoveLineBreak()],
  code => `${code}
<style>
body { margin: 0; }
.shiki { padding: 1em; }
.line { display: block; width: 100%; height: 1.2em; }
.highlighted-word { background-color: #8885; }
</style>`,
)

suite(
  'error-level',
  import.meta.glob('./fixtures/error-level/*.*', { as: 'raw', eager: true }),
  [transformerNotationErrorLevel(), transformerRemoveLineBreak()],
  code => `${code}
<style>
body { margin: 0; }
.shiki { padding: 1em; }
.line { display: block; width: 100%; height: 1.2em; }
.highlighted.warning { background-color: #9905; }
.highlighted.error { background-color: #8005; }
</style>`,
)

suite(
  'whitespace:all',
  import.meta.glob('./fixtures/whitespace/*.*', { as: 'raw', eager: true }),
  [transformerRenderWhitespace({ position: 'all' })],
  code => `${code}${CSS_RENDER_WHITESPACE}`,
  '.all',
)

suite(
  'whitespace:boundary',
  import.meta.glob('./fixtures/whitespace/*.*', { as: 'raw', eager: true }),
  [transformerRenderWhitespace({ position: 'boundary' })],
  code => `${code}${CSS_RENDER_WHITESPACE}`,
  '.boundary',
)

suite(
  'whitespace:trailing',
  import.meta.glob('./fixtures/whitespace/*.*', { as: 'raw', eager: true }),
  [transformerRenderWhitespace({ position: 'trailing' })],
  code => `${code}${CSS_RENDER_WHITESPACE}`,
  '.trailing',
)

suite(
  'all',
  import.meta.glob('./fixtures/all/*.*', { as: 'raw', eager: true }),
  [
    transformerNotationDiff(),
    transformerNotationFocus(),
    transformerNotationHighlight(),
    transformerNotationErrorLevel(),
    transformerCompactLineOptions([
      {
        line: 2,
        classes: ['highlighted'],
      },
    ]),
    transformerRenderWhitespace(),
    transformerRemoveLineBreak(),
  ],
  code => `${code}
<style>
* { tab-size: 4; }
body { margin: 0; }
.shiki { padding: 1em; }
.line { display: block; width: 100%; height: 1.2em; }
.has-focused .focused { background-color: #8805; }
.highlighted { background-color: #8885; }
.highlighted.warning { background-color: #9905; }
.highlighted.error { background-color: #8005; }
.tab, .space { position: relative; }
.tab::before { content: "\\21E5"; position: absolute; opacity: 0.3; }
.space::before { content: "\\B7"; position: absolute; opacity: 0.3; }
</style>`,
)
