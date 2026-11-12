import type { TwoslashShikiReturn } from '@shikijs/twoslash'
import type { VitePressPluginTwoslashOptions } from '../src'
import { fileURLToPath } from 'node:url'
import { createMarkdownRenderer, disposeMdItInstance } from 'vitepress'
import { afterEach, describe, expect, it } from 'vitest'
import { compileTemplate } from 'vue/compiler-sfc'
import { transformerTwoslash } from '../src'

const root = fileURLToPath(new URL('../../../', import.meta.url))
const documentation = '{{ "a\\\\b" }} &quot; &#123; &amp; {{ "&lt;em&gt;x&lt;/em&gt;" }} {{ "<em>y</em>" }}'
const source = `/** ${documentation} */\nconst value = 1\nconsole.log(value)`

async function render(lang: string, options: VitePressPluginTwoslashOptions = {}, lineNumbers = false) {
  const markdown = await createMarkdownRenderer(root, {
    theme: 'vitesse-dark',
    languages: ['ts'],
    codeTransformers: [
      transformerTwoslash({
        twoslasher(code: string): TwoslashShikiReturn {
          const start = code.indexOf('value', code.indexOf('*/'))
          const docs = code.match(/\/\*\* (.*?) \*\//)?.[1] ?? ''
          return {
            code,
            nodes: [
              {
                type: 'hover',
                start,
                length: 5,
                line: 1,
                character: 6,
                target: 'value',
                text: `const value: "${docs}"`,
                docs,
              },
            ],
          }
        },
        ...options,
      }),
    ],
  })
  return markdown.renderAsync(`\`\`\`${lang} twoslash${lineNumbers ? ' :line-numbers' : ''}\n${source}\n\`\`\``)
}

afterEach(() => disposeMdItInstance())

describe('static popups in the VitePress markdown pipeline', () => {
  it('compiles ordinary fences and keeps code line numbers independent of popup markup', async () => {
    const html = await render('ts', {}, true)
    expect(html).toContain('v-html=')
    expect(html.match(/class="line-number"/g)).toHaveLength(source.split('\n').length)
    for (const ssr of [false, true]) {
      const compiled = compileTemplate({
        source: html,
        filename: 'popup.vue',
        id: 'popup',
        ssr,
        ssrCssVars: [],
      })
      expect(compiled.errors).toEqual([])
    }
  })

  it('keeps restored mustaches byte-identical to legacy interpolated fences', async () => {
    const html = await render('ts-vue')
    expect(html).not.toContain('v-html=')
    expect(html).toContain('twoslash-popup-container')
    for (const ssr of [false, true]) {
      const compiled = compileTemplate({
        source: html,
        filename: 'popup.vue',
        id: 'popup',
        ssr,
        ssrCssVars: [],
      })
      expect(compiled.errors).toEqual([])
    }
    disposeMdItInstance()
    expect(await render('ts-vue', { optimizePopups: false })).toBe(html)
  })

  it('does not leak the fence mode when a markdown renderer is reused', async () => {
    const first = await render('ts-vue')
    expect(first).not.toContain('v-html=')
    // createMarkdownRenderer reuses the configured highlighter between calls.
    expect(await render('ts')).toContain('v-html=')
    expect(await render('ts-vue')).toBe(first)
  })
})
