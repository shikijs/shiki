import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'
import { expect, it } from 'vitest'
import { getPackageExportsManifest } from 'vitest-package-exports'

it('exports-snapshot', async () => {
  const manifest = await getPackageExportsManifest({
    importMode: 'src',
    cwd: fileURLToPath(import.meta.url),
    resolveExportEntries: (entries) => {
      return entries.filter(i => !i[0].endsWith('.wasm'))
    },
  })
  expect(yaml.dump(manifest.exports)).toMatchInlineSnapshot(`
    ".:
      addClassToHast: function
      applyColorReplacements: function
      bundledLanguages: object
      bundledLanguagesAlias: object
      bundledLanguagesBase: object
      bundledLanguagesInfo: object
      bundledThemes: object
      bundledThemesInfo: object
      codeToHast: function
      codeToHtml: function
      codeToTokens: function
      codeToTokensBase: function
      codeToTokensWithThemes: function
      createCssVariablesTheme: function
      createdBundledHighlighter: function
      createHighlighter: function
      createHighlighterCore: function
      createHighlighterCoreSync: function
      createJavaScriptRegexEngine: function
      createOnigurumaEngine: function
      createPositionConverter: function
      createShikiInternal: function
      createShikiInternalSync: function
      createSingletonShorthands: function
      defaultJavaScriptRegexConstructor: function
      enableDeprecationWarnings: function
      flatTokenVariants: function
      getLastGrammarState: function
      getSingletonHighlighter: function
      getSingletonHighlighterCore: function
      getTokenStyleObject: function
      guessEmbeddedLanguages: function
      hastToHtml: function
      isNoneTheme: function
      isPlainLang: function
      isSpecialLang: function
      isSpecialTheme: function
      loadWasm: function
      makeSingletonHighlighter: function
      makeSingletonHighlighterCore: function
      normalizeGetter: function
      normalizeTheme: function
      resolveColorReplacements: function
      ShikiError: function
      splitLines: function
      splitToken: function
      splitTokens: function
      stringifyTokenStyle: function
      toArray: function
      tokenizeAnsiWithTheme: function
      tokenizeWithTheme: function
      tokensToHast: function
      transformerDecorations: function
      warnDeprecated: function
    ./core:
      addClassToHast: function
      applyColorReplacements: function
      codeToHast: function
      codeToHtml: function
      codeToTokens: function
      codeToTokensBase: function
      codeToTokensWithThemes: function
      createCssVariablesTheme: function
      createdBundledHighlighter: function
      createHighlighterCore: function
      createHighlighterCoreSync: function
      createPositionConverter: function
      createShikiInternal: function
      createShikiInternalSync: function
      createSingletonShorthands: function
      enableDeprecationWarnings: function
      flatTokenVariants: function
      getSingletonHighlighterCore: function
      getTokenStyleObject: function
      guessEmbeddedLanguages: function
      hastToHtml: function
      isNoneTheme: function
      isPlainLang: function
      isSpecialLang: function
      isSpecialTheme: function
      makeSingletonHighlighter: function
      makeSingletonHighlighterCore: function
      normalizeGetter: function
      normalizeTheme: function
      resolveColorReplacements: function
      ShikiError: function
      splitLines: function
      splitToken: function
      splitTokens: function
      stringifyTokenStyle: function
      toArray: function
      tokenizeAnsiWithTheme: function
      tokenizeWithTheme: function
      tokensToHast: function
      transformerDecorations: function
      warnDeprecated: function
    ./wasm:
      default: function
      getWasmInstance: function
      wasmBinary: object
    ./langs:
      bundledLanguages: object
      bundledLanguagesAlias: object
      bundledLanguagesBase: object
      bundledLanguagesInfo: object
    ./themes:
      bundledThemes: object
      bundledThemesInfo: object
    ./types: {}
    ./engine/javascript:
      createJavaScriptRawEngine: function
      createJavaScriptRegexEngine: function
      defaultJavaScriptRegexConstructor: function
      JavaScriptScanner: function
    ./engine/oniguruma:
      createOnigurumaEngine: function
      getDefaultWasmLoader: function
      loadWasm: function
      setDefaultWasmLoader: function
    ./textmate:
      disposeOnigString: function
      EncodedTokenMetadata: function
      FindOption: object
      FontStyle: object
      INITIAL: object
      Registry: function
      Theme: function
    ./bundle/full:
      addClassToHast: function
      applyColorReplacements: function
      bundledLanguages: object
      bundledLanguagesAlias: object
      bundledLanguagesBase: object
      bundledLanguagesInfo: object
      bundledThemes: object
      bundledThemesInfo: object
      codeToHast: function
      codeToHtml: function
      codeToTokens: function
      codeToTokensBase: function
      codeToTokensWithThemes: function
      createCssVariablesTheme: function
      createdBundledHighlighter: function
      createHighlighter: function
      createHighlighterCore: function
      createHighlighterCoreSync: function
      createPositionConverter: function
      createShikiInternal: function
      createShikiInternalSync: function
      createSingletonShorthands: function
      enableDeprecationWarnings: function
      flatTokenVariants: function
      getLastGrammarState: function
      getSingletonHighlighter: function
      getSingletonHighlighterCore: function
      getTokenStyleObject: function
      guessEmbeddedLanguages: function
      hastToHtml: function
      isNoneTheme: function
      isPlainLang: function
      isSpecialLang: function
      isSpecialTheme: function
      makeSingletonHighlighter: function
      makeSingletonHighlighterCore: function
      normalizeGetter: function
      normalizeTheme: function
      resolveColorReplacements: function
      ShikiError: function
      splitLines: function
      splitToken: function
      splitTokens: function
      stringifyTokenStyle: function
      toArray: function
      tokenizeAnsiWithTheme: function
      tokenizeWithTheme: function
      tokensToHast: function
      transformerDecorations: function
      warnDeprecated: function
    ./bundle/web:
      addClassToHast: function
      applyColorReplacements: function
      bundledLanguages: object
      bundledLanguagesAlias: object
      bundledLanguagesBase: object
      bundledLanguagesInfo: object
      bundledThemes: object
      bundledThemesInfo: object
      codeToHast: function
      codeToHtml: function
      codeToTokens: function
      codeToTokensBase: function
      codeToTokensWithThemes: function
      createCssVariablesTheme: function
      createdBundledHighlighter: function
      createHighlighter: function
      createHighlighterCore: function
      createHighlighterCoreSync: function
      createPositionConverter: function
      createShikiInternal: function
      createShikiInternalSync: function
      createSingletonShorthands: function
      enableDeprecationWarnings: function
      flatTokenVariants: function
      getLastGrammarState: function
      getSingletonHighlighter: function
      getSingletonHighlighterCore: function
      getTokenStyleObject: function
      guessEmbeddedLanguages: function
      hastToHtml: function
      isNoneTheme: function
      isPlainLang: function
      isSpecialLang: function
      isSpecialTheme: function
      makeSingletonHighlighter: function
      makeSingletonHighlighterCore: function
      normalizeGetter: function
      normalizeTheme: function
      resolveColorReplacements: function
      ShikiError: function
      splitLines: function
      splitToken: function
      splitTokens: function
      stringifyTokenStyle: function
      toArray: function
      tokenizeAnsiWithTheme: function
      tokenizeWithTheme: function
      tokensToHast: function
      transformerDecorations: function
      warnDeprecated: function
    "
  `)
})
