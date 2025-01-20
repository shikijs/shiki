import type { Options as PrettierOptions } from 'prettier'
import type { BundledLanguage, BundledTheme } from 'shiki'
import { bundledLanguagesInfo, bundledThemesInfo } from 'shiki/bundle/full'

export interface ShikiCodegenOptions {
  /**
   * The header to add to the generated code.
   *
   * @default '/* Generate by @shikijs/codegen *\/'
   */
  header?: string

  /**
   * The languages to bundle.
   */
  langs: readonly BundledLanguage[]

  /**
   * The themes to bundle.
   */
  themes: readonly BundledTheme[]

  /**
   * The engine to use for syntax highlighting.
   */
  engine: 'oniguruma' | 'javascript' | 'javascript-raw'

  /**
   * Use precompiled grammars.
   * Only available when `engine` is set to `javascript` or `javascript-raw`.
   */
  precompiled?: boolean

  /**
   * Whether to generate TypeScript code.
   *
   * @default true
   */
  typescript?: boolean

  /**
   * Generate shorthands for the highlighter.
   *
   * @default true
   */
  shorthands?: boolean

  /**
   * Use Prettier to format the generated code.
   */
  format?: boolean | PrettierOptions
}

export interface ShikiCodegenResult {
  code: string
}

export async function codegen(options: ShikiCodegenOptions): Promise<ShikiCodegenResult> {
  const {
    header = '/* Generate by @shikijs/codegen */',
    typescript = true,
    precompiled = false,
    format: _format = true,
    shorthands = true,
  } = options

  const ts = (code: string): string => typescript ? code : ''

  if (precompiled && options.engine !== 'javascript' && options.engine !== 'javascript-raw')
    throw new Error('Precompiled grammars are only available when using the JavaScript engine')

  const langs = options.langs.map((lang) => {
    const info = bundledLanguagesInfo.find(i => i.id === lang || i.aliases?.includes(lang))
    if (!info)
      throw new Error(`Language ${lang} not found`)
    return info
  })

  const themes = options.themes.map((theme) => {
    const info = bundledThemesInfo.find(i => i.id === theme)
    if (!info)
      throw new Error(`Theme ${theme} not found`)
    return info
  })

  const langsCode = `{\n${langs.flatMap((lang) => {
    const ids = [lang.id, ...(lang.aliases || [])]
    return ids.map((id) => {
      return `${JSON.stringify(id)}: () => import('@shikijs/${precompiled ? 'langs-precompiled' : 'langs'}/${lang.id}'),\n`
    })
  }).join('')}}`

  const themesCode = `{\n${themes.map((theme) => {
    return `${JSON.stringify(theme.id)}: () => import('@shikijs/themes/${theme.id}'),\n`
  }).join('')}}`

  const typeImports: Record<string, string[]> = {
    '@shikijs/types': ['HighlighterGeneric', 'DynamicImportThemeRegistration', 'DynamicImportLanguageRegistration'],
  }
  const imports: Record<string, string[]> = {
    '@shikijs/core': ['createdBundledHighlighter'],
  }
  const lines: string[] = [
    '',
  ]
  const exports: string[] = []
  const typeExports: string[] = []

  if (typescript) {
    lines.push(
      '',
      `type BundledLanguage = ${langs.flatMap(lang => [lang.id, ...(lang.aliases || [])]).map(lang => `'${lang}'`).join(' | ')}`,
      `type BundledTheme = ${themes.map(theme => `'${theme.id}'`).join(' | ')}`,
      `type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>`,
      '',
    )
    typeExports.push('BundledLanguage', 'BundledTheme', 'Highlighter')
  }

  lines.push(
    '',
    `const bundledLanguages = ${langsCode}${ts(' as Record<BundledLanguage, DynamicImportLanguageRegistration>')}`,
    '',
    `const bundledThemes = ${themesCode}${ts(' as Record<BundledTheme, DynamicImportThemeRegistration>')}`,
    '',
  )
  exports.push('bundledLanguages', 'bundledThemes')

  let engine: string

  if (options.engine === 'javascript') {
    imports['@shikijs/engine-javascript'] = ['createJavaScriptRegexEngine']
    engine = 'createJavaScriptRegexEngine()'
  }
  else if (options.engine === 'javascript-raw') {
    imports['@shikijs/engine-javascript/raw'] = ['createJavaScriptRawEngine']
    engine = 'createJavaScriptRawEngine()'
  }
  else {
    imports['@shikijs/engine-oniguruma'] = ['createOnigurumaEngine']
    engine = 'createOnigurumaEngine(import(\'shiki/wasm\'))'
  }

  lines.push(
    '',
    `const createHighlighter = /* @__PURE__ */ createdBundledHighlighter${ts('<BundledLanguage, BundledTheme>')}({`,
    `  langs: bundledLanguages,`,
    `  themes: bundledThemes,`,
    `  engine: () => ${engine}`,
    `})`,
  )
  exports.push('createHighlighter')

  if (shorthands) {
    imports['@shikijs/core'].push('createSingletonShorthands')
    const shorthandFunctions = [
      'codeToHtml',
      'codeToHast',
      'codeToTokensBase',
      'codeToTokens',
      'codeToTokensWithThemes',
      'getSingletonHighlighter',
      'getLastGrammarState',
    ]
    lines.push(
      '',
      `const { ${shorthandFunctions.join(', ')} } = /* @__PURE__ */ createSingletonShorthands${ts('<BundledLanguage,BundledTheme>')}(createHighlighter)`,
    )
    exports.push(
      ...shorthandFunctions,
    )
  }

  // Imports
  lines.unshift(
    Object.entries(imports).map(([module, imports]) => {
      return `import { ${imports.sort().join(', ')} } from '${module}'`
    },
    ).join('\n'),
  )

  if (typescript) {
    lines.unshift(
      Object.entries(typeImports).map(([module, types]) => {
        return `import type { ${types.sort().join(', ')} } from '${module}'`
      },
      ).join('\n'),
    )
  }

  // Exports
  lines.push(
    '',
    `export { ${exports.sort().join(', ')} }`,
  )
  if (typescript) {
    lines.push(
      `export type { ${typeExports.sort().join(', ')} }`,
    )
  }

  lines.unshift(header)

  // Format code
  let code = lines.join('\n')
  if (_format) {
    const { format } = await import('prettier')
    const prettierOptions: PrettierOptions = {
      parser: typescript ? 'typescript' : 'babel',
      semi: false,
      tabWidth: 2,
      useTabs: false,
      singleQuote: true,
      trailingComma: 'all',
      ...(_format === true ? {} : _format),
    }
    code = await format(code, prettierOptions)
  }

  return {
    code,
  }
}
