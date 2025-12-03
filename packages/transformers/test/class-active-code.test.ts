import { codeToHtml } from 'shiki'
import { describe, expect, it } from 'vitest'
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '../src'

describe('classActiveCode option', () => {
  it('transformerNotationDiff adds class to code element', async () => {
    const code = `console.log('hello') // [!code ++]`

    const html = await codeToHtml(code, {
      lang: 'js',
      theme: 'github-dark',
      transformers: [
        transformerNotationDiff({
          classActiveCode: 'has-diff-code',
        }),
      ],
    })

    expect(html).toContain('class="has-diff-code"')
    expect(html).toContain('<code class="has-diff-code">')
  })

  it('transformerNotationFocus adds class to code element', async () => {
    const code = `console.log('hello') // [!code focus]`

    const html = await codeToHtml(code, {
      lang: 'js',
      theme: 'github-dark',
      transformers: [
        transformerNotationFocus({
          classActiveCode: 'has-focus-code',
        }),
      ],
    })

    expect(html).toContain('<code class="has-focus-code">')
  })

  it('transformerNotationHighlight adds class to code element', async () => {
    const code = `console.log('hello') // [!code highlight]`

    const html = await codeToHtml(code, {
      lang: 'js',
      theme: 'github-dark',
      transformers: [
        transformerNotationHighlight({
          classActiveCode: 'has-highlight-code',
        }),
      ],
    })

    expect(html).toContain('<code class="has-highlight-code">')
  })

  it('transformerNotationErrorLevel adds class to code element', async () => {
    const code = `console.log('hello') // [!code error]`

    const html = await codeToHtml(code, {
      lang: 'js',
      theme: 'github-dark',
      transformers: [
        transformerNotationErrorLevel({
          classActiveCode: 'has-error-code',
        }),
      ],
    })

    expect(html).toContain('<code class="has-error-code">')
  })

  it('works together with classActivePre', async () => {
    const code = `console.log('hello') // [!code ++]`

    const html = await codeToHtml(code, {
      lang: 'js',
      theme: 'github-dark',
      transformers: [
        transformerNotationDiff({
          classActivePre: 'has-diff-pre',
          classActiveCode: 'has-diff-code',
        }),
      ],
    })

    expect(html).toContain('class="shiki github-dark has-diff-pre"')
    expect(html).toContain('<code class="has-diff-code">')
  })

  it('does not add class when no notation is present', async () => {
    const code = `console.log('hello')`

    const html = await codeToHtml(code, {
      lang: 'js',
      theme: 'github-dark',
      transformers: [
        transformerNotationDiff({
          classActiveCode: 'has-diff-code',
        }),
      ],
    })

    expect(html).not.toContain('has-diff-code')
  })

  it('transformerNotationWordHighlight adds class to code element', async () => {
    const code = `const hello = 'world' // [!code word:hello]`

    const html = await codeToHtml(code, {
      lang: 'js',
      theme: 'github-dark',
      transformers: [
        transformerNotationWordHighlight({
          classActiveCode: 'has-word-highlight-code',
        }),
      ],
    })

    expect(html).toContain('<code class="has-word-highlight-code">')
  })

  it('transformerNotationWordHighlight works with classActivePre and classActiveCode', async () => {
    const code = `const hello = 'world' // [!code word:hello]`

    const html = await codeToHtml(code, {
      lang: 'js',
      theme: 'github-dark',
      transformers: [
        transformerNotationWordHighlight({
          classActivePre: 'has-word-highlight-pre',
          classActiveCode: 'has-word-highlight-code',
        }),
      ],
    })

    expect(html).toContain('has-word-highlight-pre')
    expect(html).toContain('<code class="has-word-highlight-code">')
  })

  it('transformerNotationWordHighlight does not add class when no notation is present', async () => {
    const code = `const hello = 'world'`

    const html = await codeToHtml(code, {
      lang: 'js',
      theme: 'github-dark',
      transformers: [
        transformerNotationWordHighlight({
          classActiveCode: 'has-word-highlight-code',
        }),
      ],
    })

    expect(html).not.toContain('has-word-highlight-code')
  })
})
