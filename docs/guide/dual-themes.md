# Light/Dark Dual Themes

Shikiji supports outputing light/dark dual themes. Different from [markdown-it-shiki](https://github.com/antfu/markdown-it-shiki#dark-mode)'s approach which renders the code twice, Shikiji's dual themes approach uses CSS variables to store the colors on each token. It's more performant with a smaller bundle size.

Change the `theme` option in `codeToHtml` to `options` with `light` and `dark` keys to generate two themes.

```js
import { getHighlighter } from 'shikiji'

const shiki = await getHighlighter({
  themes: ['nord', 'min-light'],
  langs: ['javascript'],
})

const code = shiki.codeToHtml('console.log("hello")', {
  lang: 'javascript',
  themes: {
    light: 'vitesse-light',
    dark: 'nord',
  }
})
```

The following HTML will be generated ([demo preview](https://htmlpreview.github.io/?https://raw.githubusercontent.com/antfu/shikiji/main/packages/shikiji/test/out/dual-themes.html)):

```html
<pre
  class="shiki shiki-themes min-light nord"
  style="background-color:#ffffff;--shiki-dark-bg:#2e3440ff;color:#24292eff;--shiki-dark:#d8dee9ff"
  tabindex="0"
>
  <code>
    <span class="line">
      <span style="color:#1976D2;--shiki-dark:#D8DEE9">console</span>
      <span style="color:#6F42C1;--shiki-dark:#ECEFF4">.</span>
      <span style="color:#6F42C1;--shiki-dark:#88C0D0">log</span>
      <span style="color:#24292EFF;--shiki-dark:#D8DEE9FF">(</span>
      <span style="color:#22863A;--shiki-dark:#ECEFF4">"</span>
      <span style="color:#22863A;--shiki-dark:#A3BE8C">hello</span>
      <span style="color:#22863A;--shiki-dark:#ECEFF4">"</span>
      <span style="color:#24292EFF;--shiki-dark:#D8DEE9FF">)</span>
      </span>
    </code>
</pre>
```

To make it reactive to your site's theme, you need to add a short CSS snippet:

###### Query-based Dark Mode

```css
@media (prefers-color-scheme: dark) {
  .shiki,
  .shiki span {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
    /* Optional, if you also want font styles */
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }
}
```

###### Class-based Dark Mode

```css
html.dark .shiki,
html.dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  /* Optional, if you also want font styles */
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}
```

#### Multiple Themes

It's also possible to support more than two themes. In the `themes` object, you can have an arbitrary number of themes, and specify the default theme with `defaultColor` option.

```js
const code = shiki.codeToHtml('console.log("hello")', {
  lang: 'javascript',
  themes: {
    light: 'github-light',
    dark: 'github-dark',
    dim: 'github-dimmed',
    // any number of themes
  },

  // optional customizations
  defaultColor: 'light',
  cssVariablePrefix: '--shiki-'
})
```

A token would be generated like:

```html
<span style="color:#1976D2;--shiki-dark:#D8DEE9;--shiki-dim:#566575">console</span>
```

Then update your CSS snippet to control when each theme takes effect. Here is an example:

[Demo preview](https://htmlpreview.github.io/?https://raw.githubusercontent.com/antfu/shikiji/main/packages/shikiji/test/out/multiple-themes.html)

#### Without Default Color

If you want to take full control of the colors or avoid using `!important` to override, you can optionally disable the default color by setting `defaultColor` to `false`.

```js
const code = shiki.codeToHtml('console.log("hello")', {
  lang: 'javascript',
  themes: {
    light: 'vitesse-light',
    dark: 'vitesse-dark',
  },
  defaultColor: false, // <--
})
```

With it, a token would be generated like:

```html
<span style="--shiki-dark:#D8DEE9;--shiki-light:#2E3440">console</span>
```

In that case, the generated HTML would have no style out of the box, you need to add your own CSS to control the colors.

It's also possible to control the theme in CSS variables. For more, refer to the great research and examples by [@mayank99](https://github.com/mayank99) in [this issue #6](https://github.com/antfu/shikiji/issues/6).

### Custom Language Aliases

You can register custom language aliases with `langAlias` option. For example:

```js
import { getHighlighter } from 'shikiji'

const shiki = await getHighlighter({
  langs: ['javascript'],
  langAlias: {
    mylang: 'javascript',
  },
})

const code = shiki.codeToHtml('const a = 1', { lang: 'mylang' })
```
