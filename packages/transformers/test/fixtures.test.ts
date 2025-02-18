/// <reference types="vite/client" />

import type { ShikiTransformer } from 'shiki'
import { codeToHtml } from 'shiki'
import { describe, expect, it } from 'vitest'
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

const ONLY: string[] = [
  // 'comment-highlight',
]

function suite(
  name: string,
  files: Record<string, string>,
  transformers: ShikiTransformer[],
  replace?: (code: string) => string,
  outputSuffix = '',
) {
  describe(name, () => {
    for (const path of Object.keys(files)) {
      if (path.endsWith('.output.html'))
        continue

      const skip = ONLY.length && !ONLY.some(i => path.includes(i))
      it.skipIf(skip)(path, async () => {
        const ext = path.split('.').pop()!

        let code = await codeToHtml(files[path], {
          lang: ext,
          theme: 'github-dark',
          transformers,
        })

        if (replace)
          code = replace(code)

        await expect(code)
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
  import.meta.glob('./fixtures/diff/*.*', { query: '?raw', import: 'default', eager: true }),
  [
    transformerNotationDiff({ matchAlgorithm: 'v3' }),
    transformerRemoveLineBreak(),
  ],
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
  import.meta.glob('./fixtures/focus/*.*', { query: '?raw', import: 'default', eager: true }),
  [
    transformerNotationFocus({ matchAlgorithm: 'v3' }),
    transformerRemoveLineBreak(),
  ],
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
  import.meta.glob('./fixtures/highlight/*.*', { query: '?raw', import: 'default', eager: true }),
  [
    transformerNotationHighlight({ matchAlgorithm: 'v3' }),
    transformerRemoveLineBreak(),
  ],
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
  import.meta.glob('./fixtures/highlight-word/*.*', { query: '?raw', import: 'default', eager: true }),
  [
    transformerNotationWordHighlight({ matchAlgorithm: 'v3' }),
    transformerRemoveLineBreak(),
  ],
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
  import.meta.glob('./fixtures/error-level/*.*', { query: '?raw', import: 'default', eager: true }),
  [
    transformerNotationErrorLevel({ matchAlgorithm: 'v3' }),
    transformerRemoveLineBreak(),
  ],
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
  import.meta.glob('./fixtures/whitespace/*.*', { query: '?raw', import: 'default', eager: true }),
  [
    transformerRenderWhitespace({ position: 'all' }),
  ],
  code => `${code}${CSS_RENDER_WHITESPACE}`,
  '.all',
)

suite(
  'whitespace:boundary',
  import.meta.glob('./fixtures/whitespace/*.*', { query: '?raw', import: 'default', eager: true }),
  [
    transformerRenderWhitespace({ position: 'boundary' }),
  ],
  code => `${code}${CSS_RENDER_WHITESPACE}`,
  '.boundary',
)

suite(
  'whitespace:trailing',
  import.meta.glob('./fixtures/whitespace/*.*', { query: '?raw', import: 'default', eager: true }),
  [
    transformerRenderWhitespace({ position: 'trailing' }),
  ],
  code => `${code}${CSS_RENDER_WHITESPACE}`,
  '.trailing',
)

suite(
  'all',
  import.meta.glob('./fixtures/all/*.*', { query: '?raw', import: 'default', eager: true }),
  [
    transformerNotationDiff({ matchAlgorithm: 'v3' }),
    transformerNotationFocus({ matchAlgorithm: 'v3' }),
    transformerNotationHighlight({ matchAlgorithm: 'v3' }),
    transformerNotationErrorLevel({ matchAlgorithm: 'v3' }),
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

const CSS_COMPARE = `<style>
* { tab-size: 4; }
body { margin: 0; }
.line { display: block; width: 100%; height: 1.2em; }
.shiki { padding: 1em; }
.has-focused .focused { background-color: #8805; }
.highlighted { background-color: #8885; }
.highlighted-word { background-color: #8885; }
.highlighted.warning { background-color: #9905; }
.highlighted.error { background-color: #8005; }
</style>`

suite(
  'compare-v1',
  import.meta.glob('./fixtures/match-algorithm/v1.*', { query: '?raw', import: 'default', eager: true }),
  [
    transformerNotationFocus({ matchAlgorithm: 'v1' }),
    transformerNotationHighlight({ matchAlgorithm: 'v1' }),
    transformerNotationErrorLevel({ matchAlgorithm: 'v1' }),
    transformerNotationWordHighlight({ matchAlgorithm: 'v1' }),
    transformerRemoveLineBreak(),
  ],
  code => `${code}${CSS_COMPARE}`,
)

suite(
  'compare-v3',
  import.meta.glob('./fixtures/match-algorithm/v3.*', { query: '?raw', import: 'default', eager: true }),
  [
    transformerNotationFocus({ matchAlgorithm: 'v3' }),
    transformerNotationHighlight({ matchAlgorithm: 'v3' }),
    transformerNotationErrorLevel({ matchAlgorithm: 'v3' }),
    transformerNotationWordHighlight({ matchAlgorithm: 'v3' }),
    transformerRemoveLineBreak(),
  ],
  code => `${code}${CSS_COMPARE}`,
)
