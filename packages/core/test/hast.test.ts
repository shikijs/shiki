/* eslint-disable style/no-tabs */
import { toHtml } from 'hast-util-to-html'
import { codeToHtml, createHighlighter } from 'shiki'
import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('should', () => {
  it('works', async () => {
    using shiki = await createHighlighter({
      themes: ['vitesse-light'],
      langs: ['javascript'],
    })

    const hast = shiki.codeToHast('console.log\nfoo.bar', { lang: 'js', theme: 'vitesse-light' })

    expect(toHtml(hast))
      .toMatchInlineSnapshot(`
        "<pre class="shiki vitesse-light" style="background-color:#ffffff;color:#393a34" tabindex="0"><code><span class="line"><span style="color:#B07D48">console</span><span style="color:#999999">.</span><span style="color:#B07D48">log</span></span>
        <span class="line"><span style="color:#B07D48">foo</span><span style="color:#999999">.</span><span style="color:#B07D48">bar</span></span></code></pre>"
      `)
  })

  it('structure inline', async () => {
    using shiki = await createHighlighter({
      themes: ['vitesse-light'],
      langs: ['javascript'],
    })

    const hast = shiki.codeToHast('console.log\nfoo.bar', {
      lang: 'js',
      theme: 'vitesse-light',
      structure: 'inline',
    })

    expect(toHtml(hast))
      .toMatchInlineSnapshot(`"<span style="color:#B07D48">console</span><span style="color:#999999">.</span><span style="color:#B07D48">log</span><br><span style="color:#B07D48">foo</span><span style="color:#999999">.</span><span style="color:#B07D48">bar</span>"`)
  })
})

it('hasfocus support', async () => {
  const snippet = '$foo = "bar";\n'
    + '$test = "owo"; // [!code focus]\n'
    + '$bar = "baz";'

  const code = await codeToHtml(snippet, {
    lang: 'php',
    theme: 'vitesse-light',
    tabindex: false,
    transformers: [
      {
        code(node) {
          node.properties.class = 'language-php'
        },
        span(node, line, col, parent) {
          node.children.forEach((child) => {
            if (child.type === 'text' && child.value.includes('[!code focus]')) {
              parent.properties['data-has-focus'] = 'true'
              node.children.splice(node.children.indexOf(child), 1)
            }
          })
        },
      },
    ],
  })

  expect(code)
    .toMatchInlineSnapshot(`
      "<pre class="shiki vitesse-light" style="background-color:#ffffff;color:#393a34"><code class="language-php"><span class="line"><span style="color:#999999">$</span><span style="color:#B07D48">foo</span><span style="color:#999999"> =</span><span style="color:#B5695977"> "</span><span style="color:#B56959">bar</span><span style="color:#B5695977">"</span><span style="color:#999999">;</span></span>
      <span class="line" data-has-focus="true"><span style="color:#999999">$</span><span style="color:#B07D48">test</span><span style="color:#999999"> =</span><span style="color:#B5695977"> "</span><span style="color:#B56959">owo</span><span style="color:#B5695977">"</span><span style="color:#999999">;</span><span style="color:#A0ADA0"></span></span>
      <span class="line"><span style="color:#999999">$</span><span style="color:#B07D48">bar</span><span style="color:#999999"> =</span><span style="color:#B5695977"> "</span><span style="color:#B56959">baz</span><span style="color:#B5695977">"</span><span style="color:#999999">;</span></span></code></pre>"
    `)
})

it('render whitespace', async () => {
  const snippet = [
    '  space()',
    '\t\ttab()',
  ].join('\n')

  const code = await codeToHtml(snippet, {
    lang: 'js',
    theme: 'vitesse-light',
    transformers: [

    ],
  })

  expect(code)
    .toMatchInlineSnapshot(`
      "<pre class="shiki vitesse-light" style="background-color:#ffffff;color:#393a34" tabindex="0"><code><span class="line"><span style="color:#59873A">  space</span><span style="color:#999999">()</span></span>
      <span class="line"><span style="color:#59873A">		tab</span><span style="color:#999999">()</span></span></code></pre>"
    `)
})

describe('merge same style', () => {
  it('merges adjacent tokens with same style', async () => {
    using shiki = await createHighlighter({
      themes: ['min-light'],
      langs: ['yaml'],
    })

    const code = 'name: CI'
    const html = await shiki.codeToHtml(code, {
      lang: 'yaml',
      theme: 'min-light',
      mergeSameStyleTokens: true,
    })

    expect(html).toMatchInlineSnapshot(`"<pre class="shiki min-light" style="background-color:#ffffff;color:#24292eff" tabindex="0"><code><span class="line"><span style="color:#D32F2F">name:</span><span style="color:#22863A"> CI</span></span></code></pre>"`)
  })

  it('merges adjacent tokens with dual themes', async () => {
    using shiki = await createHighlighter({
      themes: ['min-light', 'min-dark'],
      langs: ['yaml'],
    })

    const code = 'name: CI'
    const html = await shiki.codeToHtml(code, {
      lang: 'yaml',
      themes: { dark: 'min-dark', light: 'min-light' },
      mergeSameStyleTokens: true,
    })

    expect(html).toMatchInlineSnapshot(`"<pre class="shiki shiki-themes min-light min-dark" style="background-color:#ffffff;--shiki-dark-bg:#1f1f1f;color:#24292eff;--shiki-dark:#b392f0" tabindex="0"><code><span class="line"><span style="color:#D32F2F;--shiki-dark:#F8F8F8">name</span><span style="color:#D32F2F;--shiki-dark:#F97583">:</span><span style="color:#22863A;--shiki-dark:#FFAB70"> CI</span></span></code></pre>"`)
  })

  it('merges adjacent tokens with the same dual themes', async () => {
    using shiki = await createHighlighter({
      themes: ['min-light'],
      langs: ['yaml'],
    })

    const code = 'name: CI'
    const html = await shiki.codeToHtml(code, {
      lang: 'yaml',
      themes: { dark: 'min-light', light: 'min-light' },
      mergeSameStyleTokens: true,
    })

    expect(html).toMatchInlineSnapshot(`"<pre class="shiki shiki-themes min-light min-light" style="background-color:#ffffff;--shiki-dark-bg:#ffffff;color:#24292eff;--shiki-dark:#24292eff" tabindex="0"><code><span class="line"><span style="color:#D32F2F;--shiki-dark:#D32F2F">name:</span><span style="color:#22863A;--shiki-dark:#22863A"> CI</span></span></code></pre>"`)
  })

  it('does not merge tokens with decorations', async () => {
    using shiki = await createHighlighter({
      themes: ['min-light'],
      langs: ['yaml'],
    })

    const code = 'name: CI'
    const html = await shiki.codeToHtml(code, {
      lang: 'yaml',
      theme: 'min-light',
      mergeSameStyleTokens: true,
      decorations: [
        {
          start: { line: 0, character: 0 },
          end: { line: 0, character: 4 },
          properties: { class: 'highlighted-word' },
        },
      ],
    })

    expect(html).toMatchInlineSnapshot(`"<pre class="shiki min-light" style="background-color:#ffffff;color:#24292eff" tabindex="0"><code><span class="line"><span style="color:#D32F2F" class="highlighted-word">name</span><span style="color:#D32F2F">:</span><span style="color:#22863A"> CI</span></span></code></pre>"`)
  })
})

describe('preserve HAST data and properties', () => {
  it('preserves data field in pre element', async () => {
    using shiki = await createHighlighter({
      themes: ['vitesse-light'],
      langs: ['javascript'],
    })

    const hast = shiki.codeToHast('console.log("test")', {
      lang: 'js',
      theme: 'vitesse-light',
      data: { meta: 'fileName="hello.js"' },
    })

    const preNode = hast.children[0]
    expect(preNode).toHaveProperty('data')
    expect(preNode.data).toEqual({ meta: 'fileName="hello.js"' })
  })

  it('preserves properties field in pre element', async () => {
    using shiki = await createHighlighter({
      themes: ['vitesse-light'],
      langs: ['javascript'],
    })

    const hast = shiki.codeToHast('console.log("test")', {
      lang: 'js',
      theme: 'vitesse-light',
      properties: { 'data-custom': 'value', 'data-file': 'test.js' },
    })

    const preNode = hast.children[0]
    if (preNode.type !== 'element')
      throw new Error('Expected element')
    expect(preNode.properties).toHaveProperty('data-custom', 'value')
    expect(preNode.properties).toHaveProperty('data-file', 'test.js')
  })

  it('preserves both data and properties', async () => {
    using shiki = await createHighlighter({
      themes: ['vitesse-light'],
      langs: ['javascript'],
    })

    const hast = shiki.codeToHast('console.log("test")', {
      lang: 'js',
      theme: 'vitesse-light',
      data: { meta: 'fileName="hello.js"', customData: 123 },
      properties: { 'data-custom': 'value' },
    })

    const preNode = hast.children[0]
    if (preNode.type !== 'element')
      throw new Error('Expected element')
    expect(preNode.data).toEqual({ meta: 'fileName="hello.js"', customData: 123 })
    expect(preNode.properties).toHaveProperty('data-custom', 'value')
    expect(preNode.properties).toHaveProperty('class') // Shiki class is still there
  })

  it('shiki properties override incoming properties for critical fields', async () => {
    using shiki = await createHighlighter({
      themes: ['vitesse-light'],
      langs: ['javascript'],
    })

    const hast = shiki.codeToHast('console.log("test")', {
      lang: 'js',
      theme: 'vitesse-light',
      properties: { class: 'my-custom-class' }, // Should be overridden
    })

    const preNode = hast.children[0]
    if (preNode.type !== 'element')
      throw new Error('Expected element')
    // Shiki's class should override the incoming class
    expect(preNode.properties.class).toBe('shiki vitesse-light')
  })
})
