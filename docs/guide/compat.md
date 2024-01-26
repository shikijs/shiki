---
outline: deep
---

# Compatibility Build

The v1.0 release of Shiki is a major rewrite that we took the chance to revise every design decision we made in the past. We'd suggest you try to migrate those changes if possible for future-proof. Most most of them should be straightforward if you have TypeScript enabled.

To make deep migration easier, we provide a compatibility build that shimmed the breaking changes from v0.x. You can use it as a drop-in replacement for `shiki` and migrate step by step.

## Install Compatibility Build

<Badges name="@shikijs/compat" />

Set the alias to `shiki` in your `package.json`:

<!-- eslint-skip -->

```json
{
  "dependencies": {
    "shiki": "0.14.3", // [!code --]
    "shiki": "npm:@shikijs/compat@1.0" // [!code ++]
  }
}
```

Check the breaking changes list below to see if you need to migrate anything manually.

## Breaking Changes from v0.x

Compare to [`shiki@0.14.3`](https://github.com/shikijs/shiki/releases/tag/v0.14.3), the breaking changes are:

### Hard Breaking Changes

Breaking changes applied to both `shiki` and `shiki-compat`, that you need to migrate manually:

- CJS and IIFE builds are dropped. See [CJS Usage](/guide/install#cjs-usage) and [CDN Usage](/guide/install#cdn-usage) for more details.
- `codeToHtml` uses [`hast`](https://github.com/syntax-tree/hast) internally. The generated HTML will be a bit different but should behave the same.
- `css-variables` theme is not supported. Use the [dual themes](/guide/dual-themes) approach instead, or learn more at the [Theme Colors Manipulation](/guide/theme-colors) page.

### Soft Breaking Changes

Breaking changes applies to `shiki`, but are shimmed by `shiki-compat`:

- Top-level named exports `setCDN`, `loadLanguage`, `loadTheme`, `setWasm` are dropped as they are not needed anymore.
- `BUNDLED_LANGUAGES`, `BUNDLED_THEMES` are moved to `shiki/langs` and `shiki/themes` and renamed to `bundledLanguages` and `bundledThemes` respectively.
- `theme` option for `getHighlighter` is dropped, use `themes` with an array instead.
- Highlighter does not maintain an internal default theme context. `theme` option is required for `codeToHtml` and `codeToThemedTokens`.
- `codeToThemedTokens` sets `includeExplanation` to `false` by default.
- `.ansiToHtml` is merged into `.codeToHtml` as a special language, `ansi`. Use `.codeToHtml(code, { lang: 'ansi' })` instead.
- `lineOptions` is dropped in favor of the fully customizable `transforms` option.
- `LanguageRegistration`'s `grammar` field is flattened to `LanguageRegistration` itself, refer to the types for more details.
