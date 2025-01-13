import type { Options as PrettierOptions } from 'prettier'
import type { BundledLanguage, BundledTheme } from 'shiki'
import { bundledLanguagesInfo, bundledThemesInfo } from 'shiki/bundle/full'

export interface ShikiCodegenOptions {
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

  /**
   * Generate code for worker
   *
   * @default false
   */
  worker?: 'web' | 'node' | false

  /**
   * Worker RPC protocol, currently only 'birpc' is supported.
   *
   * @default 'birpc'
   */
  workerRpc?: 'birpc'

  /**
   * Path to the worker script.
   *
   * @default './shiki.worker'
   */
  workerPath?: string
}

const WORKER_FUNCTIONS = [
  'codeToHast',
  'codeToHtml',
  'codeToTokens',
  'codeToTokensBase',
  'codeToTokensWithThemes',
]

export async function codegen(options: ShikiCodegenOptions): Promise<{
  code: string
  host?: string
}> {
  const {
    typescript = true,
    precompiled = false,
    format: _format = true,
    shorthands = true,
    worker = false,
    // workerRpc = 'birpc',
    workerPath = './shiki.worker',
  } = options

  const ts = (code: string): string => typescript ? code : ''

  if (precompiled && options.engine !== 'javascript' && options.engine !== 'javascript-raw')
    throw new Error('Precompiled grammars are only available when using the JavaScript engine')

  if (worker && !shorthands)
    throw new Error('Shorthands are required for worker')

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

  let host: string | undefined

  // Worker
  if (worker) {
    if (worker === 'web') {
      imports.birpc = ['createBirpc']
      lines.push(
        '',
        `const functions = { ${WORKER_FUNCTIONS.sort().join(',')} }`,
        `const rpc = createBirpc(functions, {`,
        `  on(fn) { self.onmessage = (e) => { fn(e.data) } },`,
        `  post(data) { self.postMessage(data) },`,
        `  serialize(data) { return JSON.stringify(data) },`,
        `  deserialize(data) { return JSON.parse(data) },`,
        `})`,
        '',
      )

      if (typescript)
        lines.push(`export type RpcFunctions = typeof functions`)

      exports.push('rpc')

      host = [
        `import { createBirpc } from 'birpc'`,
        ts(`import type { RpcFunctions } from ${JSON.stringify(workerPath)}`),
        ``,
        `export const worker = new Worker(new URL(${JSON.stringify(workerPath)}, import.meta.url))`,
        `export const rpc = createBirpc${ts('<RpcFunctions>')}({}, {`,
        `  on(fn) { worker.onmessage = (e) => { fn(e.data) } },`,
        `  post(data) { worker.postMessage(data) },`,
        `  serialize(data) { return JSON.stringify(data) },`,
        `  deserialize(data) { return JSON.parse(data) },`,
        `})`,
        ``,
        WORKER_FUNCTIONS.map(e => `export const ${e} = rpc.${e}`).join('\n'),
      ].join('\n')
    }
    else if (worker === 'node') {
      imports.birpc = ['createBirpc']
      imports.worker_threads = ['parentPort']
      lines.push(
        '',
        `const functions = { ${WORKER_FUNCTIONS.sort().join(',')} }`,
        `const rpc = createBirpc(functions, {`,
        `  on(fn) { parentPort?.on('message', fn) },`,
        `  post(data) { parentPort?.postMessage(data) },`,
        `})`,
        ``,
      )
      if (typescript)
        lines.push(`export type RpcFunctions = typeof functions`)

      exports.push('rpc', 'worker')

      host = [
        `import { createBirpc } from 'birpc'`,
        `import { Worker } from 'worker_threads'`,
        ts(`import type { RpcFunctions } from ${JSON.stringify(workerPath)}`),
        ``,
        `export const worker = new Worker(${JSON.stringify(workerPath)})`,
        `export const rpc = createBirpc${ts('<RpcFunctions>')}({}, {`,
        `  on(fn) { worker.on('message', fn) },`,
        `  post(data) { worker.postMessage(data) },`,
        `})`,
        ``,
        WORKER_FUNCTIONS.map(e => `export const ${e} = rpc.${e}`).join('\n'),
      ].join('\n')
    }
    else {
      throw new Error(`Invalid worker type: ${worker}`)
    }
  }

  // Imports
  lines.unshift(
    Object.entries(imports).map(([module, imports]) => {
      return `import { ${imports.join(', ')} } from '${module}'`
    },
    ).join('\n'),
  )

  if (typescript) {
    lines.unshift(
      Object.entries(typeImports).map(([module, types]) => {
        return `import type { ${types.join(', ')} } from '${module}'`
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
    if (host)
      host = await format(host, prettierOptions)
  }

  return {
    code,
    host,
  }
}
