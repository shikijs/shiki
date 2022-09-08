# Changelog

### 0.10.1

- 🙌: feat: add ZenScript support [#300](https://github.com/shikijs/shiki/pull/300) | **[@jaredlll08](https://github.com/jaredlll08)**
- 🙌: feat: add marko language [#299](https://github.com/shikijs/shiki/pull/299) | **[@manan-gup](https://github.com/manan-gup)**
- 🙌: fix: split plaintext into lines [#298](https://github.com/shikijs/shiki/pull/298) | **[@silvenon](https://github.com/silvenon)**
- 🙌: fix(docs): fixed custom language instructions [#294](https://github.com/shikijs/shiki/pull/294) | **[@JuanM04](https://github.com/JuanM04)**
- 🙌: fix: updated astro grammar source [#293](https://github.com/shikijs/shiki/pull/293) | **[@JuanM04](https://github.com/JuanM04)**
- 🙌: feat: add rel lang [#287](https://github.com/shikijs/shiki/pull/287) | **[@robbear](https://github.com/robbear)**
- 🙌: feat: add rose pine themes [#282](https://github.com/shikijs/shiki/pull/281) | **[@EmeraldSnorlax](https://github.com/EmeraldSnorlax)**
- 🙌: feat: add stata lang [#281](https://github.com/shikijs/shiki/pull/281) | **[@kylebutts](kylebutts)**

**Full Changelog**: [v0.10.0...v0.10.1](https://github.com/shikijs/shiki/compare/v0.10.0...v0.10.1)

---

### 0.2.7 | 2020-11-13

- Fix color fallback issues. [#100](https://github.com/shikijs/shiki/issues/100).
- 🙌 Add Applescript grammar. [#99](https://github.com/shikijs/shiki/issues/99). Thanks to contribution from [Arturo Galán](https://github.com/arturogalan).

### 0.2.6 | 2020-09-28

- Upgrade to onigasm 2.2.5.
- Add Erlang grammar.
- 🙌 Add Elixir grammar. [#95](https://github.com/shikijs/shiki/issues/95). Thanks to contribution from [Sebastien Baudray](https://github.com/https://github.com/sbaudray).
- 🙌 Fix wrong escape sequence in vuepress plugin. [#93](https://github.com/shikijs/shiki/issues/93). Thanks to contribution from [Yu Zhang](https://github.com/yzhang-gh).

### 0.2.5 | 2020-09-17

- Reduce dependency size (shiki-themes is 47M). [#94](https://github.com/shikijs/shiki/issues/94).

### 0.2.4 | 2020-09-13

- Fix `RangeError: Invalid array length` in `vuepress-plugin-shiki`.
- 🙌 Wrap line in `<span class='line'></span>`. [#76](https://github.com/shikijs/shiki/issues/76). Thanks to contribution from [Christoph Werner](https://github.com/codepunkt).

### 0.2.3 | 2020-09-08

- Add `文言` language. [#88](https://github.com/shikijs/shiki/issues/88).
- Add `slack-theme-dark-mode` and `slack-theme-ochin` themes. Thanks to contribution from [Christoph Werner](https://github.com/codepunkt). [#78](https://github.com/shikijs/shiki/pull/78).

### 0.2.2 | 2020-08-26

- Fix dark-plus syntax highlighting for uncolored white text.

### 0.2.1 | 2020-08-24

- Allow custom languages for vuepress. [#80](https://github.com/shikijs/shiki/issues/80).
- Fix `php` syntax highlighting. [#21](https://github.com/shikijs/shiki/issues/21).
- Add `jinja-html` language, which embeds `jinja` language. [#24](https://github.com/shikijs/shiki/issues/24).
- Remove `vue-html` language. Either use `vue` or `html` language.

### 0.2.0 | 2020-08-24

- Normalize all theme names to kebab-case.
- Add GitHub light/dark themes.
- Remove less popular themes.
- Add `hlsl`, `asm` (x86 Assembly), `m` (Matlab), `sas`, `d`, `dart`, `plsql`, `logo`, , `pas` (Object Pascal/Delphi), `cobol`, `kt` (Kotlin), `scala`, `abap`, `julia`, `scheme`, `prolog`, `ada`, `lisp`, `apex`, `fortran`, `haskell`, `hcl`, `hack`, `awk`, `as` (ActionScript), `tcl`, `ocaml`, `viml`, `puppet`, `jsonnet`, `smalltalk`, `cr` (Crystal), `wat` (WASM), `nix`, `elm`, `purescript` and `svelte` languages.
- Add `pug` language and make `jade` an alias of it.
- Use GitHub workflow to update grammars periodically. [#72](https://github.com/shikijs/shiki/issues/72).
- Use GitHub workflow to update themes periodically. [#71](https://github.com/shikijs/shiki/issues/71).
- Use theme foreground color when color of token is `undefined`. [#27](https://github.com/shikijs/shiki/issues/27).
- SVG Renderer. [#2](https://github.com/shikijs/shiki/issues/2).
- Fix HTML escaping. [#26](https://github.com/octref/shiki/issues/26) and [#28](https://github.com/octref/shiki/pull/28). Thanks to contribution from [@jackens](https://github.com/jackens).
- 🙌 Add an option to skip generating the explanation text. [#52](https://github.com/shikijs/shiki/pull/52). Thanks to contribution from [Gerrit Birkeland](https://github.com/Gerrit0).
- 🙌 Improve performance by avoiding some unnecessary string copies. [#51](https://github.com/shikijs/shiki/pull/51). Thanks to contribution from [Gerrit Birkeland](https://github.com/Gerrit0).
- 🙌 Allow loading custom `tmLanguage`. [#10](https://github.com/octref/shiki/issues/10) and [#49](https://github.com/octref/shiki/pull/49). Thanks to contribution from [Orta Therox](https://github.com/orta) and [@pngwn](https://github.com/pngwn).
- 🙌 Update Java grammar. [#36](https://github.com/octref/shiki/issues/36) and [#37](https://github.com/octref/shiki/issues/37). Thanks to contribution from [@0xflotus](https://github.com/0xflotus).

### 0.1.7 | 2020-04-28

- Update to latest Dark+/Light+ theme from VS Code.

### 0.1.6 | 2019-09-19

- Add `toml` language from https://github.com/bungcip/better-toml. [#20](https://github.com/octref/shiki/issues/20).

### 0.1.5 | 2019-09-09

- Begin to keep a changelog. [#7](https://github.com/octref/shiki/issues/7).
- Accept `plaintext`, `text` and `txt` as `lang`. Will return `code` as it is. [#16](https://github.com/octref/shiki/issues/16).
- Add `jsonc` language. [#18](https://github.com/octref/shiki/issues/18).
- Add `csharp` language. [#14](https://github.com/octref/shiki/issues/14).
- Add `md` as an alias for `markdown`.
- Add `zsh` as an alias for `bash`.
- Add `yml` as an alias for `yaml`.
- 🙌 Use json5 for parsing theme as JSONC. [#11](https://github.com/octref/shiki/issues/11). Thanks to contribution from [Wes Bos](https://github.com/wesbos).