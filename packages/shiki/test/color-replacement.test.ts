import { expect, it } from 'vitest'
import type { ThemeRegistrationResolved } from '../src'
import { codeToHtml, resolveColorReplacements } from '../src'

it('resolveColorReplacements', async () => {
  expect(resolveColorReplacements('nord', {
    colorReplacements: {
      '#000000': '#ffffff',
      'nord': {
        '#000000': '#222222',
        '#abcabc': '#defdef',
        '#ffffff': '#111111',
      },
      'other': {
        '#000000': '#444444',
        '#ffffff': '#333333',
      },
      '#ffffff': '#000000',
    },
  })).toEqual(
    {
      '#abcabc': '#defdef',
      '#000000': '#222222',
      '#ffffff': '#000000',
    },
  )
})

it('flat colorReplacements', async () => {
  const result = await codeToHtml('console.log("hi")', {
    lang: 'js',
    themes: {
      light: 'vitesse-light',
      dark: 'material-theme-palenight',
    },
    colorReplacements: {
      '#393a34': 'var(---replaced-1)',
      '#b07d48': 'var(---replaced-2)',
    },
  })

  expect(result).toContain('var(---replaced-1)')
  expect(result).toContain('var(---replaced-2)')

  expect(result.replace(/>/g, '>\n'))
    .toMatchInlineSnapshot(`
      "<pre class="shiki shiki-themes vitesse-light material-theme-palenight" style="background-color:#ffffff;--shiki-dark-bg:#292D3E;color:var(---replaced-1);--shiki-dark:#babed8" tabindex="0">
      <code>
      <span class="line">
      <span style="color:var(---replaced-2);--shiki-dark:#BABED8">
      console</span>
      <span style="color:#999999;--shiki-dark:#89DDFF">
      .</span>
      <span style="color:#59873A;--shiki-dark:#82AAFF">
      log</span>
      <span style="color:#999999;--shiki-dark:#BABED8">
      (</span>
      <span style="color:#B5695999;--shiki-dark:#89DDFF">
      "</span>
      <span style="color:#B56959;--shiki-dark:#C3E88D">
      hi</span>
      <span style="color:#B5695999;--shiki-dark:#89DDFF">
      "</span>
      <span style="color:#999999;--shiki-dark:#BABED8">
      )</span>
      </span>
      </code>
      </pre>
      "
    `)
})

it('scoped colorReplacements', async () => {
  const customLightTheme: ThemeRegistrationResolved = {
    name: 'custom-light',
    type: 'light',
    settings: [
      { scope: 'string', settings: { foreground: '#a3be8c' } },
    ],
    fg: '#393a34',
    bg: '#b07d48',
  }
  const customDarkTheme: ThemeRegistrationResolved = {
    ...customLightTheme,
    type: 'dark',
    name: 'custom-dark',
  }

  const result = await codeToHtml('console.log("hi")', {
    lang: 'js',
    themes: {
      light: customLightTheme,
      dark: customDarkTheme,
    },
    colorReplacements: {
      'custom-dark': {
        '#b07d48': 'var(---replaced-1)',
      },
      'custom-light': {
        '#393a34': 'var(---replaced-2)',
        '#b07d48': 'var(---replaced-3)',
      },
      '#393a34': 'var(---replaced-4)',
    },
  })

  expect(result).toContain('var(---replaced-1)')
  expect(result).not.toContain('var(---replaced-2)')
  expect(result).toContain('var(---replaced-3)')
  expect(result).toContain('var(---replaced-4)')

  expect(result.replace(/>/g, '>\n'))
    .toMatchInlineSnapshot(`
      "<pre class="shiki shiki-themes custom-light custom-dark" style="background-color:var(---replaced-3);--shiki-dark-bg:var(---replaced-1);color:var(---replaced-4);--shiki-dark:var(---replaced-4)" tabindex="0">
      <code>
      <span class="line">
      <span style="color:var(---replaced-4);--shiki-dark:var(---replaced-4)">
      console.log(</span>
      <span style="color:#A3BE8C;--shiki-dark:#A3BE8C">
      "hi"</span>
      <span style="color:var(---replaced-4);--shiki-dark:var(---replaced-4)">
      )</span>
      </span>
      </code>
      </pre>
      "
    `)
})
