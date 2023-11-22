/// <reference types="vite/client" />

import { describe, expect, it } from 'vitest'
import type { ShikijiTransformer } from 'shikiji'
import { codeToHtml } from 'shikiji'
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerRemoveLineBreak,
  transformerRenderWhitespace,
} from '../src'

function suite(
  name: string,
  files: Record<string, string>,
  transformers: ShikijiTransformer[],
  replace?: (code: string) => string,
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
          .toMatchFileSnapshot(`${path}.output.html`)
      })
    }
  })
}

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
.highlighted { background-color: #888; }
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
  'whitespace',
  import.meta.glob('./fixtures/whitespace/*.*', { as: 'raw', eager: true }),
  [transformerRenderWhitespace()],
  code => `${code}
<style>
* { tab-size: 4; }
body { margin: 0; }
.shiki { padding: 1em; }
.tab, .space { position: relative; }
.tab::before { content: "\\21E5"; position: absolute; opacity: 0.3; }
.space::before { content: "\\B7"; position: absolute; opacity: 0.3; }
</style>`,
)
