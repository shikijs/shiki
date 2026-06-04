import { transformerColorizedBrackets } from '@shikijs/colorized-brackets'
import {
  transformerCompactLineOptions,
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerRenderWhitespace,
  transformerStyleToClass,
} from '@shikijs/transformers'
import { bench, describe } from 'vitest'
import { createBenchHighlighter, loadFixture } from '../_shared/setup'

const highlighter = await createBenchHighlighter()
const ts = await loadFixture('ts')

// A representative TS file with notation comments for the notation transformers.
const tsWithNotation = `// [!code highlight:3]
const a = 1
const b = 2
const c = 3
// [!code --]
const removed = true
// [!code ++]
const added = true
// [!code focus]
const focused = 'hi'
// [!code error]
const errored = 'oops'
// [!code warning]
const warned = 'eek'
${ts}`

describe('transformerStyleToClass', () => {
  bench('ts', () => {
    highlighter.codeToHtml(ts, {
      lang: 'typescript',
      theme: 'vitesse-dark',
      transformers: [transformerStyleToClass()],
    })
  })
})

describe('transformerColorizedBrackets', () => {
  bench('ts', () => {
    highlighter.codeToHtml(ts, {
      lang: 'typescript',
      theme: 'vitesse-dark',
      transformers: [transformerColorizedBrackets()],
    })
  })
})

describe('transformerNotationDiff', () => {
  bench('ts', () => {
    highlighter.codeToHtml(tsWithNotation, {
      lang: 'typescript',
      theme: 'vitesse-dark',
      transformers: [transformerNotationDiff()],
    })
  })
})

describe('transformerNotationHighlight', () => {
  bench('ts', () => {
    highlighter.codeToHtml(tsWithNotation, {
      lang: 'typescript',
      theme: 'vitesse-dark',
      transformers: [transformerNotationHighlight()],
    })
  })
})

describe('transformerNotationFocus', () => {
  bench('ts', () => {
    highlighter.codeToHtml(tsWithNotation, {
      lang: 'typescript',
      theme: 'vitesse-dark',
      transformers: [transformerNotationFocus()],
    })
  })
})

describe('transformerNotationErrorLevel', () => {
  bench('ts', () => {
    highlighter.codeToHtml(tsWithNotation, {
      lang: 'typescript',
      theme: 'vitesse-dark',
      transformers: [transformerNotationErrorLevel()],
    })
  })
})

describe('transformerMetaHighlight', () => {
  bench('ts', () => {
    highlighter.codeToHtml(ts, {
      lang: 'typescript',
      theme: 'vitesse-dark',
      meta: { __raw: '{1,3-5}' },
      transformers: [transformerMetaHighlight()],
    })
  })
})

describe('transformerCompactLineOptions', () => {
  bench('ts', () => {
    highlighter.codeToHtml(ts, {
      lang: 'typescript',
      theme: 'vitesse-dark',
      transformers: [transformerCompactLineOptions([
        { line: 1, classes: ['highlighted'] },
        { line: 3, classes: ['focused'] },
        { line: 10, classes: ['marked'] },
      ])],
    })
  })
})

describe('transformerRenderWhitespace', () => {
  bench('ts', () => {
    highlighter.codeToHtml(ts, {
      lang: 'typescript',
      theme: 'vitesse-dark',
      transformers: [transformerRenderWhitespace()],
    })
  })
})

describe('transformerDecorations (built-in)', () => {
  bench('ts', () => {
    highlighter.codeToHtml(ts, {
      lang: 'typescript',
      theme: 'vitesse-dark',
      decorations: [
        { start: 0, end: 10, properties: { class: ['highlight'] } },
        { start: 50, end: 80, properties: { class: ['focus'] } },
        { start: 120, end: 200, properties: { class: ['mark'] } },
      ],
    })
  })
})

describe('all-transformers stack', () => {
  bench('ts', () => {
    highlighter.codeToHtml(tsWithNotation, {
      lang: 'typescript',
      theme: 'vitesse-dark',
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerNotationFocus(),
        transformerNotationErrorLevel(),
        transformerColorizedBrackets(),
        transformerStyleToClass(),
      ],
    })
  })
})
