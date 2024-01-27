---
outline: deep
---

# Migration

The v1.0 release of Shiki is a major rewrite that we took the chance to revise every design decision we made in the past. We originally had a separate package name as [Shikiji](https://github.com/antfu/shikiji) to experiment with the new design, now it's merged back to Shiki as v1.0.

## Migrate from v0.14

Compare to [`shiki@0.14.3`](https://github.com/shikijs/shiki/releases/tag/v0.14.3), the list of breaking changes are:

### Hard Breaking Changes

Breaking changes that you need to migrate manually:

- CJS and IIFE builds are dropped. See [CJS Usage](/guide/install#cjs-usage) and [CDN Usage](/guide/install#cdn-usage) for more details.
- `codeToHtml` uses [`hast`](https://github.com/syntax-tree/hast) internally. The generated HTML will be a bit different but should behave the same.
- `css-variables` theme is no longer supported. Use the [dual themes](/guide/dual-themes) approach instead, or learn more at the [Theme Colors Manipulation](/guide/theme-colors) page.

### Soft Breaking Changes

Breaking changes applies to main package `shiki`, but are shimmed by the [compatible build `@shikijs/compat`](/guide/compat#compatibility-build):

- Top-level named exports `setCDN`, `loadLanguage`, `loadTheme`, `setWasm` are dropped as they are not needed anymore.
- `BUNDLED_LANGUAGES`, `BUNDLED_THEMES` are moved to `shiki/langs` and `shiki/themes` and renamed to `bundledLanguages` and `bundledThemes` respectively.
- `theme` option for `getHighlighter` is dropped, use `themes` with an array instead.
- Highlighter does not maintain an internal default theme context. `theme` option is required for `codeToHtml` and `codeToThemedTokens`.
- `codeToThemedTokens` sets `includeExplanation` to `false` by default.
- `.ansiToHtml` is merged into `.codeToHtml` as a special language, `ansi`. Use `.codeToHtml(code, { lang: 'ansi' })` instead.
- `lineOptions` is dropped in favor of the fully customizable `transforms` option.
- `LanguageRegistration`'s `grammar` field is flattened to `LanguageRegistration` itself, refer to the types for more details.

## Migrate from Shikiji

If you are already using [Shikiji](https://github.com/antfu/shikiji), first make sure you are on the latest minor v0.10. Then the migration should be very straightforward by renaming the packages:

- `shikiji` -> `shiki`
- `shikiji-core` -> `@shikijs/core`
- `shikiji-twoslash` -> `@shikijs/twoslash`
- `shikiji-transformers` -> `@shikijs/transformers`
- `shikiji-monaco` -> `@shikijs/monaco`
- `shikiji-cli` -> `@shikijs/cli`
- `markdown-it-shikiji` -> `@shikijs/markdown-it`
- `rehype-shikiji` -> `@shikijs/rehype`
