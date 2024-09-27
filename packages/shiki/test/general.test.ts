import { describe, expect, it } from 'vitest'
import { codeToHtml, createHighlighter } from '../src'

describe('should', () => {
  it('works', async () => {
    const shiki = await createHighlighter({
      themes: ['vitesse-light'],
      langs: ['javascript'],
    })

    expect(shiki.codeToHtml('console.log', { lang: 'js', theme: 'vitesse-light' }))
      .toMatchInlineSnapshot(`"<pre class="shiki vitesse-light" style="background-color:#ffffff;color:#393a34" tabindex="0"><code><span class="line"><span style="color:#B07D48">console</span><span style="color:#999999">.</span><span style="color:#B07D48">log</span></span></code></pre>"`)
  })

  it('dynamic load theme and lang', async () => {
    const shiki = await createHighlighter({
      themes: ['vitesse-light'],
      langs: ['javascript', 'ts'],
    })

    await shiki.loadLanguage('python')
    await shiki.loadTheme('min-dark')

    expect(shiki.getLoadedLanguages())
      .toMatchInlineSnapshot(`
        [
          "javascript",
          "typescript",
          "python",
          "js",
          "ts",
          "py",
        ]
      `)
    expect(shiki.getLoadedThemes())
      .toMatchInlineSnapshot(`
        [
          "vitesse-light",
          "min-dark",
        ]
      `)

    expect(shiki.codeToHtml('print 1', { lang: 'python', theme: 'min-dark' }))
      .toMatchInlineSnapshot(`"<pre class="shiki min-dark" style="background-color:#1f1f1f;color:#b392f0" tabindex="0"><code><span class="line"><span style="color:#B392F0">print </span><span style="color:#F8F8F8">1</span></span></code></pre>"`)
  })

  it('requires nested lang', async () => {
    const shiki = await createHighlighter({
      themes: ['nord'],
      langs: [
        'vue',
      ],
    })

    expect(shiki.getLoadedLanguages().sort())
      .toMatchInlineSnapshot(`
        [
          "css",
          "html",
          "html-derivative",
          "javascript",
          "js",
          "json",
          "markdown-vue",
          "ts",
          "typescript",
          "vue",
          "vue-directives",
          "vue-interpolations",
          "vue-sfc-style-variable-injection",
        ]
      `)
  })

  // https://github.com/shikijs/shiki/issues/35
  it('dynamic load theme and lang with md', async () => {
    const shiki = await createHighlighter({
      langs: [],
      themes: [],
    })

    await shiki.loadTheme('min-dark')
    await shiki.loadLanguage('md')
    await shiki.loadLanguage('js')
    await shiki.loadLanguage('ts')

    expect(shiki.getLoadedLanguages().length)
      .toMatchInlineSnapshot(`6`)

    expect(shiki.getLoadedThemes())
      .toMatchInlineSnapshot(`
        [
          "min-dark",
        ]
      `)

    expect(shiki.codeToHtml('console.log(1)', { lang: 'js', theme: 'min-dark' }))
      .toMatchInlineSnapshot(`"<pre class="shiki min-dark" style="background-color:#1f1f1f;color:#b392f0" tabindex="0"><code><span class="line"><span style="color:#79B8FF">console</span><span style="color:#B392F0">.log(</span><span style="color:#F8F8F8">1</span><span style="color:#B392F0">)</span></span></code></pre>"`)

    expect(shiki.codeToHtml('```js\nconsole.log(1)\n```', { lang: 'md', theme: 'min-dark' }))
      .toMatchInlineSnapshot(`
        "<pre class="shiki min-dark" style="background-color:#1f1f1f;color:#b392f0" tabindex="0"><code><span class="line"><span style="color:#9DB1C5">\`\`\`js</span></span>
        <span class="line"><span style="color:#79B8FF">console</span><span style="color:#B392F0">.log(</span><span style="color:#F8F8F8">1</span><span style="color:#B392F0">)</span></span>
        <span class="line"><span style="color:#9DB1C5">\`\`\`</span></span></code></pre>"
      `)

    expect(shiki.codeToHtml('```ts\nconsole.log(1)\n```', { lang: 'md', theme: 'min-dark' }))
      .toMatchInlineSnapshot(`
        "<pre class="shiki min-dark" style="background-color:#1f1f1f;color:#b392f0" tabindex="0"><code><span class="line"><span style="color:#9DB1C5">\`\`\`ts</span></span>
        <span class="line"><span style="color:#79B8FF">console</span><span style="color:#B392F0">.log(</span><span style="color:#F8F8F8">1</span><span style="color:#B392F0">)</span></span>
        <span class="line"><span style="color:#9DB1C5">\`\`\`</span></span></code></pre>"
      `)

    // This should be unstyled
    expect(shiki.codeToHtml('```cpp\nint a = 1;\n```', { lang: 'md', theme: 'min-dark' }))
      .toMatchInlineSnapshot(`
        "<pre class="shiki min-dark" style="background-color:#1f1f1f;color:#b392f0" tabindex="0"><code><span class="line"><span style="color:#9DB1C5">\`\`\`cpp</span></span>
        <span class="line"><span style="color:#9DB1C5">int a = 1;</span></span>
        <span class="line"><span style="color:#9DB1C5">\`\`\`</span></span></code></pre>"
      `)

    await shiki.loadLanguage('cpp')

    // This should be styled
    expect(shiki.codeToHtml('```cpp\nint a = 1;\n```', { lang: 'md', theme: 'min-dark' }))
      .toMatchInlineSnapshot(`
        "<pre class="shiki min-dark" style="background-color:#1f1f1f;color:#b392f0" tabindex="0"><code><span class="line"><span style="color:#9DB1C5">\`\`\`cpp</span></span>
        <span class="line"><span style="color:#F97583">int</span><span style="color:#B392F0"> a </span><span style="color:#F97583">=</span><span style="color:#F8F8F8"> 1</span><span style="color:#B392F0">;</span></span>
        <span class="line"><span style="color:#9DB1C5">\`\`\`</span></span></code></pre>"
      `)
  })

  it('dynamic load lang with vue', async () => {
    const shiki = await createHighlighter({
      langs: [],
      themes: [],
    })

    await shiki.loadTheme('vitesse-dark')
    await shiki.loadLanguage('vue')

    expect(shiki.getLoadedLanguages())
      .not
      .includes('scss')

    const code = `
      <template>
        <h1>Hello</h1>
      </template>

      <script setup lang="ts">
      const a: number = 1
      </script>

      <style lang="scss">
      h1 {
        span {
          color: red;
        }
      }
      </style>
    `

    const html1 = shiki.codeToHtml(code, { lang: 'vue', theme: 'vitesse-dark' })

    await shiki.loadLanguage('scss')

    expect(shiki.getLoadedLanguages())
      .includes('scss')

    const html2 = shiki.codeToHtml(code, { lang: 'vue', theme: 'vitesse-dark' })

    expect(html1).not.toEqual(html2)
  })

  it('monokai underline', async () => {
    expect(await codeToHtml('type Foo = { bar: string }', {
      theme: 'monokai',
      lang: 'ts',
    }))
      .toMatchFileSnapshot('./out/monokai-underline.html')
  })

  it('should have correct offset', async () => {
    const shiki = await createHighlighter({
      themes: ['nord'],
      langs: ['html'],
    })

    const code = `
      <script>
        console.log(1)
          </script>
    `

    const tokens = shiki.codeToTokensBase(code, { lang: 'html', theme: 'nord' })

    for (const line of tokens) {
      for (const token of line) {
        expect(code.slice(token.offset, token.offset + token.content.length))
          .toBe(token.content)
      }
    }
  })

  it('skip line tokenizing', async () => {
    const longText = 'foo'.repeat(50)

    expect(await codeToHtml(`const long = ${longText}`, {
      theme: 'vitesse-light',
      lang: 'javascript',
    })).toMatchInlineSnapshot(`"<pre class="shiki vitesse-light" style="background-color:#ffffff;color:#393a34" tabindex="0"><code><span class="line"><span style="color:#AB5959">const</span><span style="color:#B07D48"> long</span><span style="color:#999999"> =</span><span style="color:#B07D48"> ${longText}</span></span></code></pre>"`)

    expect(await codeToHtml(`const short = ""\nconst long = ${longText}`, {
      theme: 'vitesse-light',
      lang: 'javascript',
      tokenizeMaxLineLength: 100,
    })).toMatchInlineSnapshot(`
      "<pre class="shiki vitesse-light" style="background-color:#ffffff;color:#393a34" tabindex="0"><code><span class="line"><span style="color:#AB5959">const</span><span style="color:#B07D48"> short</span><span style="color:#999999"> =</span><span style="color:#B5695977"> ""</span></span>
      <span class="line"><span>const long = foofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoofoo</span></span></code></pre>"
    `)
  })
})

describe('errors', () => {
  it('throw on invalid theme', async () => {
    await expect(() => createHighlighter({
      themes: ['invalid' as any],
      langs: ['javascript'],
    }))
      .rejects
      .toThrowErrorMatchingInlineSnapshot(`[ShikiError: Theme \`invalid\` is not included in this bundle. You may want to load it from external source.]`)
  })

  it('throw on invalid lang', async () => {
    await expect(() => createHighlighter({
      themes: ['nord'],
      langs: ['invalid' as any],
    }))
      .rejects
      .toThrowErrorMatchingInlineSnapshot(`[ShikiError: Language \`invalid\` is not included in this bundle. You may want to load it from external source.]`)
  })
})
