// @vitest-environment happy-dom
import type { TwoslashShikiReturn } from '@shikijs/twoslash'
import type { Element, Root } from 'hast'
import type { ShikiTransformer } from 'shiki'
import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript'
import { createHighlighter } from 'shiki'
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { transformerTwoslash } from '../src'
import TwoslashFloatingVue from '../src/client'

const highlighter = await createHighlighter({
  themes: ['vitesse-light', 'vitesse-dark'],
  langs: ['ts'],
  engine: createJavaScriptRegexEngine(),
})
afterAll(() => highlighter.dispose())

const apps: ReturnType<typeof createSSRApp>[] = []
const payload = '**Documentation** with `&quot;`, `&#123;`, `&amp;`, "quotes", \\slashes, {{ literal }}, 한글.\n\n```ts\nconst example = "</script></template>"\n```\n\n![image](https://example.com/image.png)'

function identifyMenus(node: Root | Element, nextId = { value: 0 }) {
  if (node.type === 'element' && node.tagName === 'v-menu')
    node.properties['aria-id'] = `popup-test-${nextId.value++}`
  for (const child of node.children ?? []) {
    if (child.type === 'element')
      identifyMenus(child, nextId)
  }
  if (node.type === 'element' && node.content)
    identifyMenus(node.content, nextId)
}

async function template(optimizePopups: boolean, completion = false) {
  const code = 'const value = 1'
  const twoslasher = (): TwoslashShikiReturn => ({
    code,
    nodes: completion
      ? [
          {
            type: 'completion',
            start: 6,
            length: 5,
            line: 0,
            character: 6,
            completionsPrefix: 'v',
            completions: [
              { name: 'value', kind: 'property' },
            ],
          },
        ]
      : [
          {
            type: 'hover',
            start: 6,
            length: 5,
            line: 0,
            character: 6,
            target: 'value',
            text: 'const value: number',
            docs: payload,
          },
        ],
  })
  const mode: ShikiTransformer = {
    name: 'vitepress:v-pre',
    pre(node) { node.properties['v-pre'] = '' },
  }
  return highlighter.codeToHtml(code, {
    lang: 'ts',
    themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
    meta: { __raw: 'twoslash' },
    transformers: [
      mode,
      transformerTwoslash({ optimizePopups, twoslasher }),
      {
        name: 'test:stable-menu-ids',
        root(node) { identifyMenus(node) },
      },
    ],
  })
}

function app(source: string, scoped = false, eagerMount = true) {
  const instance = createSSRApp({
    template: source,
    ...scoped
      ? { __scopeId: 'data-v-popup-test' }
      : {},
  })
  instance.use(TwoslashFloatingVue, {
    container: false,
    themes: {
      'twoslash': { eagerMount, delay: 0 },
      'twoslash-query': { eagerMount, delay: 0 },
      'twoslash-completion': { eagerMount, delay: 0 },
    },
  })
  return instance
}

async function hydrate(source: string, scoped = false, eagerMount = true) {
  const html = await renderToString(app(source, scoped, eagerMount))
  const root = document.createElement('div')
  root.innerHTML = html
  document.body.appendChild(root)
  const instance = app(source, scoped, eagerMount)
  apps.push(instance)
  instance.mount(root)
  await nextTick()
  if (eagerMount) {
    root.querySelector('.v-popper > span')?.dispatchEvent(new Event('mouseenter'))
    await new Promise(resolve => setTimeout(resolve, 50))
    await nextTick()
  }
  return { root, html }
}

function normalizeStyles(element: globalThis.Element) {
  const copy = element.cloneNode(true)
  if (!(copy instanceof HTMLElement))
    throw new TypeError('Expected an HTML popup.')
  for (const styled of copy.querySelectorAll<HTMLElement>('[style]'))
    styled.setAttribute('style', styled.style.cssText)
  return copy.innerHTML
}

afterEach(() => {
  for (const instance of apps.splice(0))
    instance.unmount()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('compiled static popups', () => {
  it('retains eager SSR content and identical DOM through hydration', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    const warnings = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const legacy = await hydrate(await template(false))
    expect(legacy.html).toContain('Documentation')
    const expected = legacy.root.querySelector('.twoslash-popup-container')!
    const expectedHtml = normalizeStyles(expected)
    const expectedText = expected.textContent
    const optimized = await hydrate(await template(true))
    expect(optimized.html).toContain('Documentation')
    const actual = optimized.root.querySelector('.twoslash-popup-container')!
    expect(normalizeStyles(actual)).toBe(expectedHtml)
    expect(actual.textContent).toBe(expectedText)
    expect(actual.querySelector('img')).not.toBeNull()
    expect(actual.textContent).toContain('&quot;')
    expect(actual.textContent).toContain('</script></template>')
    expect(actual.querySelector('script')).toBeNull()
    expect(errors).not.toHaveBeenCalled()
    expect(warnings).not.toHaveBeenCalled()
  })

  it('retains lazy popup content on first hover', async () => {
    const { root, html } = await hydrate(await template(true), false, false)
    expect(html).not.toContain('Documentation')
    root.querySelector('.twoslash-hover > span')!.dispatchEvent(new Event('mouseenter'))
    await new Promise(resolve => setTimeout(resolve, 50))
    await nextTick()
    expect(root.querySelector('.v-popper--shown')).not.toBeNull()
    expect(document.querySelector('.twoslash-popup-docs')?.textContent).toContain('Documentation')
  })

  it('retains completion SVG markup and namespace', async () => {
    const { root } = await hydrate(await template(true, true))
    const svg = root.querySelector('.twoslash-completions-icon svg')!
    expect(svg).not.toBeNull()
    expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg')
    expect(svg.getAttribute('viewBox')).toBeTruthy()
    expect(svg.querySelector('path')?.getAttribute('d')).toBeTruthy()
    expect(root.querySelector('.twoslash-completion-list')?.textContent).toContain('value')
  })

  it('keeps scope attributes on popup roots, with an opt-out for scoped descendants', async () => {
    const optimized = await hydrate(await template(true), true)
    const legacy = await hydrate(await template(false), true)
    const selector = '.twoslash-popup-docs[data-v-popup-test]'
    expect(legacy.root.querySelector(selector)).not.toBeNull()
    expect(optimized.root.querySelector(selector)).toBeNull()
    expect(optimized.root.querySelector('.twoslash-popup-container[data-v-popup-test]')).not.toBeNull()
  })
})
