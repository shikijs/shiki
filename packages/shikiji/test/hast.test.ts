/* eslint-disable style/no-tabs */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { toHtml } from 'hast-util-to-html'
import { codeToHtml, getHighlighter } from '../src'

afterEach(() => {
  vi.restoreAllMocks
})

describe('should', () => {
  it('works', async () => {
    const shiki = await getHighlighter({
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
})

it('hasfocus support', async () => {
  const snippet = '$foo = "bar";\n'
    + '$test = "owo"; // [!code focus]\n'
    + '$bar = "baz";'

  const code = await codeToHtml(snippet, {
    lang: 'php',
    theme: 'vitesse-light',
    transformers: [
      {
        code(node) {
          node.properties.class = 'language-php'
        },
        token(node, line, col, parent) {
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
      "<pre class="shiki vitesse-light" style="background-color:#ffffff;color:#393a34" tabindex="0"><code class="language-php"><span class="line"><span style="color:#999999">$</span><span style="color:#B07D48">foo</span><span style="color:#999999"> =</span><span style="color:#B5695999"> "</span><span style="color:#B56959">bar</span><span style="color:#B5695999">"</span><span style="color:#999999">;</span></span>
      <span class="line" data-has-focus="true"><span style="color:#999999">$</span><span style="color:#B07D48">test</span><span style="color:#999999"> =</span><span style="color:#B5695999"> "</span><span style="color:#B56959">owo</span><span style="color:#B5695999">"</span><span style="color:#999999">;</span><span style="color:#A0ADA0"></span></span>
      <span class="line"><span style="color:#999999">$</span><span style="color:#B07D48">bar</span><span style="color:#999999"> =</span><span style="color:#B5695999"> "</span><span style="color:#B56959">baz</span><span style="color:#B5695999">"</span><span style="color:#999999">;</span></span></code></pre>"
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
