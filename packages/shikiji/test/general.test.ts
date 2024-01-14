import { describe, expect, it } from 'vitest'
import { codeToHtml, getHighlighter } from '../src'

describe('should', () => {
  it('works', async () => {
    const shiki = await getHighlighter({
      themes: ['vitesse-light'],
      langs: ['javascript'],
    })

    expect(shiki.codeToHtml('console.log', { lang: 'js', theme: 'vitesse-light' }))
      .toMatchInlineSnapshot(`"<pre class="shiki vitesse-light" style="background-color:#ffffff;color:#393a34" tabindex="0"><code><span class="line"><span style="color:#B07D48">console</span><span style="color:#999999">.</span><span style="color:#B07D48">log</span></span></code></pre>"`)
  })

  it('dynamic load theme and lang', async () => {
    const shiki = await getHighlighter({
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
    const shiki = await getHighlighter({
      themes: ['nord'],
      langs: [
        'vue',
      ],
    })

    expect(shiki.getLoadedLanguages().sort())
      .toMatchInlineSnapshot(`
        [
          "coffee",
          "coffeescript",
          "css",
          "gql",
          "graphql",
          "html",
          "jade",
          "javascript",
          "js",
          "json",
          "json5",
          "jsonc",
          "jsx",
          "less",
          "markdown",
          "markdown-vue",
          "md",
          "pug",
          "sass",
          "scss",
          "styl",
          "stylus",
          "toml",
          "ts",
          "tsx",
          "typescript",
          "vue",
          "vue-directives",
          "vue-interpolations",
          "vue-sfc-style-variable-injection",
          "yaml",
          "yml",
        ]
      `)
  })

  // https://github.com/antfu/shikiji/issues/35
  it('dynamic load theme and lang with md', async () => {
    const shiki = await getHighlighter({})

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

  it('monokai underline', async () => {
    expect(await codeToHtml('type Foo = { bar: string }', {
      theme: 'monokai',
      lang: 'ts',
    }))
      .toMatchFileSnapshot('./out/monokai-underline.html')
  })

  it('should have correct offset', async () => {
    const shiki = await getHighlighter({
      themes: ['nord'],
      langs: ['html'],
    })

    const code = `
      <script>
        console.log(1)
          </script>
    `

    const tokens = shiki.codeToThemedTokens(code, { lang: 'html', theme: 'nord' })

    for (const line of tokens) {
      for (const token of line) {
        expect(code.slice(token.offset, token.offset + token.content.length))
          .toBe(token.content)
      }
    }
  })
})

describe('errors', () => {
  it('throw on invalid theme', async () => {
    await expect(() => getHighlighter({
      themes: ['invalid' as any],
      langs: ['javascript'],
    }))
      .rejects
      .toThrowErrorMatchingInlineSnapshot(`[Error: [shikiji] Theme \`invalid\` is not built-in.]`)
  })

  it('throw on invalid lang', async () => {
    await expect(() => getHighlighter({
      themes: ['nord'],
      langs: ['invalid' as any],
    }))
      .rejects
      .toThrowErrorMatchingInlineSnapshot(`[Error: [shikiji] Language \`invalid\` is not built-in.]`)
  })
})
