---
outline: deep
---

# Compatibility Build

We took the chance of the rewrite to make some breaking changes that we think are beneficial for the future. We'd suggest you try to migrate those changes if possible, as most of them should be straightforward. If you have very deep integration, you can try our compatibility build which aligns better with `shiki`'s current API.

## Install `shikiji-compat`

<Badges name="shikiji-compat" />

Set the alias to `shiki` in your `package.json`:

```json
{
  "dependencies": {
    "shiki": "npm:shikiji-compat@0.9"
  }
}
```

## Breaking Changes from Shiki

As of [`shiki@0.14.3`](https://github.com/shikijs/shiki/releases/tag/v0.14.3), the breaking changes between Shiiki and Shikiji are:

### Hard Breaking Changes

Breaking changes applied to both `shikiji` and `shikiji-compat`:

- CJS and IIFE builds are dropped. See [CJS Usage](#cjs-usage) and [CDN Usage](#cdn-usage) for more details.
- `codeToHtml` uses [`hast`](https://github.com/syntax-tree/hast) internally. The generated HTML will be a bit different but should behave the same.
- `css-variables` theme is not supported. Use the [dual themes](#lightdark-dual-themes) approach instead.

### Soft Breaking Changes

Breaking changes applies to `shikiji`, but are shimmed by `shikiji-compat`:

- Top-level named export `setCDN`, `loadLanguage`, `loadTheme`, `setWasm` are dropped as they are not needed anymore.
- `BUNDLED_LANGUAGES`, `BUNDLED_THEMES` are moved to `shikiji/langs` and `shikiji/themes` and renamed to `bundledLanguages` and `bundledThemes` respectively.
- `theme` option for `getHighlighter` is dropped, use `themes` with an array instead.
- Highlighter does not maintain an internal default theme context. `theme` option is required for `codeToHtml` and `codeToThemedTokens`.
- `.ansiToHtml` is merged into `.codeToHtml` as a special language `ansi`. Use `.codeToHtml(code, { lang: 'ansi' })` instead.
- `lineOptions` is dropped in favor of the fully customizable `transforms` option.
- `LanguageRegistration`'s `grammar` field is flattened to `LanguageRegistration` itself, refer to the types for more details.
