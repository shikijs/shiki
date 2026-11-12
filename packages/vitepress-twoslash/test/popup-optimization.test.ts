import type { TwoslashShikiReturn } from '@shikijs/twoslash'
import type { Element, Root, RootContent } from 'hast'
import type { ShikiTransformer } from 'shiki'
import type { VitePressPluginTwoslashOptions } from '../src'
import { codeToHast, codeToHtml, hastToHtml } from 'shiki'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { compileTemplate } from 'vue/compiler-sfc'
import { rendererFloatingVue, transformerTwoslash } from '../src'

const code = 'const value = 1'
const docs = '**Documentation** with `value`, &quot;, &#123;, &amp;, "quotes", \\slashes, {{ braces }}, and 한글.'

function nodes(kind: 'hover' | 'query' | 'error' | 'completion', documentation = docs): TwoslashShikiReturn['nodes'] {
  const position = {
    start: 6,
    length: 5,
    line: 0,
    character: 6,
  }
  if (kind === 'completion') {
    return [
      {
        ...position,
        type: kind,
        completions: [
          { name: 'value', kind: 'property' },
        ],
        completionsPrefix: 'v',
      },
    ]
  }
  if (kind === 'error') {
    return [
      {
        ...position,
        type: kind,
        text: documentation,
        code: 2322,
      },
    ]
  }
  return [
    {
      ...position,
      type: kind,
      target: 'value',
      text: 'const value: number',
      docs: documentation,
    },
  ]
}

function transformer(options: VitePressPluginTwoslashOptions = {}, kind: Parameters<typeof nodes>[0] = 'hover', documentation = docs) {
  return transformerTwoslash({
    errorRendering: 'hover',
    twoslasher: (source: string) => ({
      code: source,
      nodes: nodes(kind, documentation),
    }),
    ...options,
  })
}

function pipeline(wrapper: ShikiTransformer, options: { interpolated?: boolean, legacy?: boolean, before?: ShikiTransformer[], after?: ShikiTransformer[] } = {}): ShikiTransformer[] {
  return [
    {
      name: options.legacy ? 'vitepress:add-class' : 'vitepress:add-dir',
      pre(node) {
        if (options.legacy)
          this.addClassToHast(node, 'vp-code')
        else
          node.properties.dir = 'ltr'
      },
    },
    ...options.legacy
      ? [
          {
            name: 'vitepress:clean-up',
            pre(node: Element) { delete node.properties.style },
          },
        ]
      : [],
    {
      name: 'vitepress:v-pre',
      pre(node) {
        if (!options.interpolated)
          node.properties['v-pre'] = ''
      },
    },
    ...options.before ?? [],
    wrapper,
    ...options.after ?? [],
  ]
}

function elements(node: Root | RootContent): Element[] {
  const children = 'children' in node
    ? node.children ?? []
    : []
  return [
    ...node.type === 'element'
      ? [node]
      : [],
    ...children.flatMap(elements),
    ...node.type === 'element' && node.content
      ? elements(node.content)
      : [],
  ]
}

function popups(tree: Root): Element[] {
  return elements(tree).filter(node => /twoslash-popup-container|twoslash-completion-list/.test(String(node.properties.class)))
}

async function render(wrapper: ShikiTransformer, options: Parameters<typeof pipeline>[1] = {}) {
  return codeToHast(code, {
    lang: 'ts',
    theme: 'vitesse-dark',
    meta: { __raw: 'twoslash' },
    transformers: pipeline(wrapper, options),
  })
}

function countVueNodes(value: unknown, seen = new Set<object>()): number {
  if (value == null || typeof value !== 'object' || seen.has(value))
    return 0
  seen.add(value)
  return Number('type' in value && typeof value.type === 'number')
    + Object.values(value).reduce<number>((sum, child) => sum + countVueNodes(child, seen), 0)
}

afterEach(() => vi.restoreAllMocks())

describe('vitePress static popup optimization', () => {
  for (const legacy of [false, true]) {
    it(`compacts ordinary ${legacy ? '1.x' : '2.x'} fences without changing the serialized popup content`, async () => {
      const original = await render(transformer({ optimizePopups: false }), { legacy })
      const optimized = await render(transformer(), { legacy })
      const before = popups(original)
      const after = popups(optimized)
      expect(after).toHaveLength(1)
      expect(after[0].properties['v-pre']).toBeUndefined()
      expect(JSON.parse(String(after[0].properties['v-html']))).toBe(hastToHtml(before[0].children))
      expect(after[0].children).toEqual([])
      expect(elements(optimized).find(node => node.tagName === 'pre')?.properties['v-pre']).toBeUndefined()
    })
  }

  for (const kind of [
    'hover',
    'query',
    'error',
    'completion',
  ] as const) {
    it(`compacts ${kind} popups`, async () => {
      const tree = await render(transformer({}, kind))
      expect(popups(tree)).toHaveLength(1)
      expect(popups(tree)[0].properties['v-html']).toBeTypeOf('string')
    })
  }

  it('keeps default direct renderers and caller-supplied renderers unchanged', async () => {
    const tree = await render(transformer({
      renderer: rendererFloatingVue(),
      optimizePopups: true,
    }))
    expect(popups(tree)[0].properties['v-pre']).toBe('')
    expect(popups(tree)[0].properties['v-html']).toBeUndefined()
  })

  it('retains full HAST for interpolated fences', async () => {
    const tree = await render(transformer(), { interpolated: true })
    expect(popups(tree)[0].properties['v-pre']).toBe('')
    expect(popups(tree)[0].children.length).toBeGreaterThan(0)
    expect(elements(tree).find(node => node.tagName === 'pre')?.properties['v-pre']).toBeUndefined()
  })

  it('does not infer the VitePress mode in standalone use', async () => {
    const tree = await codeToHast(code, {
      lang: 'ts',
      theme: 'vitesse-dark',
      meta: { __raw: 'twoslash' },
      transformers: [
        transformer(),
      ],
    })
    expect(popups(tree)[0].properties['v-pre']).toBe('')
  })

  it('falls back for unknown earlier pre hooks, but permits later ones', async () => {
    const hook: ShikiTransformer = {
      name: 'custom:pre',
      pre() {},
    }
    expect(popups(await render(transformer(), {
      before: [hook],
    }))[0].properties['v-html']).toBeUndefined()
    expect(popups(await render(transformer(), {
      after: [hook],
    }))[0].properties['v-html']).toBeTypeOf('string')
  })

  it('falls back when a physically later pre hook is enforced before the wrapper', async () => {
    const hook: ShikiTransformer = {
      name: 'custom:early',
      enforce: 'pre',
      pre() {},
    }
    expect(popups(await render(transformer(), {
      after: [hook],
    }))[0].properties['v-html']).toBeUndefined()
  })

  it('falls back when the wrapper is spread-copied', async () => {
    expect(popups(await render({
      ...transformer(),
    }))[0].properties['v-html']).toBeUndefined()
  })

  it('preserves trigger-based outer v-pre removal when Twoslash skips a language', async () => {
    for (const options of [
      { explicitTrigger: false },
      {},
    ]) {
      const tree = await codeToHast('print(1)', {
        lang: 'python',
        theme: 'vitesse-dark',
        meta: { __raw: 'twoslash' },
        transformers: pipeline(transformer(options)),
      })
      expect(elements(tree).find(node => node.tagName === 'pre')?.properties['v-pre']).toBeUndefined()
    }
  })

  it('preserves v-pre restored by later pre hooks on skipped languages', async () => {
    for (const optimizePopups of [false, true]) {
      const html = await codeToHtml('{{ value }}', {
        lang: 'text',
        theme: 'vitesse-dark',
        transformers: pipeline(transformer({ explicitTrigger: false, optimizePopups }), {
          after: [
            {
              name: 'custom:literal',
              pre(node) {
                node.properties['v-pre'] = ''
              },
            },
          ],
        }),
      })
      const compiled = compileTemplate({ source: html, filename: 'literal.vue', id: 'literal' })
      expect(compiled.errors).toEqual([])
      expect(compiled.code).not.toContain('_ctx.value')
      expect(html).toContain('v-pre')
    }
  })

  it('preserves outer v-pre removal on handled errors', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const tree = await render(transformer({
      throws: false,
      twoslasher() { throw new TypeError('Test failure.') },
    }))
    expect(elements(tree).find(node => node.tagName === 'pre')?.properties['v-pre']).toBeUndefined()
    expect(popups(tree)).toEqual([])
  })

  it('keeps outer v-pre on untriggered fences', async () => {
    const tree = await codeToHast(code, {
      lang: 'ts',
      theme: 'vitesse-dark',
      transformers: pipeline(transformer()),
    })
    expect(elements(tree).find(node => node.tagName === 'pre')?.properties['v-pre']).toBe('')
  })

  it('keeps fallback output when a later preprocess hook moves the mode hook', async () => {
    const mover: ShikiTransformer = {
      name: 'custom:move',
      preprocess(_code, options) {
        const index = options.transformers!.findIndex(item => item.name === 'vitepress:v-pre')
        const [hook] = options.transformers!.splice(index, 1)
        options.transformers!.push(hook)
      },
    }
    const tree = await render(transformer(), {
      after: [mover],
    })
    expect(popups(tree)[0].properties['v-html']).toBeUndefined()
    expect(elements(tree).find(node => node.tagName === 'pre')?.properties['v-pre']).toBeUndefined()
  })

  it('does not compact inline output or duplicate mode hooks', async () => {
    const wrapper = transformer()
    const duplicate: ShikiTransformer = {
      name: 'vitepress:v-pre',
      pre() {},
    }
    expect(popups(await render(wrapper, {
      after: [duplicate],
    }))[0].properties['v-html']).toBeUndefined()
    const transformers = pipeline(transformer({
      twoslasher: (source: string) => ({ code: source, nodes: [] }),
    }))
    const tree = await codeToHast(code, {
      lang: 'ts',
      theme: 'vitesse-dark',
      structure: 'inline',
      meta: { __raw: 'twoslash' },
      transformers,
    })
    expect(popups(tree)).toEqual([])
    expect(transformers.some(item => item.name === 'vitepress:v-pre')).toBe(false)
  })

  it('preserves code-hook visibility and ignores unrelated popup lookalikes', async () => {
    let sawChildren = false
    const inspect: ShikiTransformer = {
      name: 'custom:inspect',
      code(node) {
        sawChildren = popups({
          type: 'root',
          children: [node],
        })[0].children.length > 0
        node.children.push({
          type: 'element',
          tagName: 'span',
          properties: { 'id': 'unowned', 'class': 'twoslash-popup-container', 'v-pre': '' },
          children: [
            { type: 'text', value: 'custom' },
          ],
        })
      },
    }
    const tree = await render(transformer(), {
      after: [inspect],
    })
    expect(sawChildren).toBe(true)
    expect(elements(tree).find(node => node.properties.id === 'unowned')?.properties['v-html']).toBeUndefined()
    expect(popups(tree).some(node => typeof node.properties['v-html'] === 'string')).toBe(true)
  })

  it('preserves dual-theme HTML, fenced examples and void elements', async () => {
    const documentation = 'Quotes " and `code`, 한글, &quot;, &#123;, &amp;, <script>text</script>.\n\n```ts\nconst example = "</template>"\n```\n\n![image](https://example.com/icon.png)'
    const renderThemes = (disabled: boolean) => codeToHast(code, {
      lang: 'ts',
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
      meta: { __raw: 'twoslash' },
      transformers: pipeline(transformer({ optimizePopups: !disabled }, 'hover', documentation)),
    })
    const before = popups(await renderThemes(true))[0]
    const after = popups(await renderThemes(false))[0]
    const expression = String(after.properties['v-html'])
    expect(expression).not.toContain('<')
    expect(JSON.parse(expression)).toBe(hastToHtml(before.children))
    expect(JSON.parse(expression)).toContain('<img')
    expect(JSON.parse(expression)).toContain('--shiki-dark')
  })

  it('does not grow the Vue AST with popup documentation size', async () => {
    const sizes = []
    for (const count of [1, 200]) {
      const html = await codeToHtml(code, {
        lang: 'ts',
        theme: 'vitesse-dark',
        meta: { __raw: 'twoslash' },
        transformers: pipeline(transformer({}, 'hover', Array.from({ length: count }, (_, i) => `Paragraph ${i}: **strong** and [link](https://example.com).`).join('\n\n'))),
      })
      const compiled = compileTemplate({ source: html, filename: 'popup.vue', id: 'popup' })
      expect(compiled.errors).toEqual([])
      sizes.push(countVueNodes(compiled.ast))
    }
    expect(sizes[1]).toBeLessThanOrEqual(sizes[0] + 2)
  })
})
