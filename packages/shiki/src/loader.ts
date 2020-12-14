import * as Onigasm from 'onigasm'
import { IOnigLib, IRawGrammar, IRawTheme, parseRawGrammar } from 'vscode-textmate'
import { ILanguageRegistration, IShikiTheme } from './types'

export const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'

let _onigasmPromise: Promise<IOnigLib> = null

export async function getOnigasm(): Promise<IOnigLib> {
  if (!_onigasmPromise) {
    let loader: Promise<any>

    if (isBrowser) {
      loader = Onigasm.loadWASM(_resolvePath('onigasm.wasm', 'dist/'))
    } else {
      const path = require('path')
      const onigasmPath = path.join(require.resolve('onigasm'), '../onigasm.wasm')
      const fs = require('fs')
      const wasmBin = fs.readFileSync(onigasmPath).buffer
      loader = Onigasm.loadWASM(wasmBin)
    }

    _onigasmPromise = loader.then(() => {
      return {
        createOnigScanner(patterns: string[]) {
          return new Onigasm.OnigScanner(patterns)
        },
        createOnigString(s: string) {
          return new Onigasm.OnigString(s)
        }
      }
    })
  }
  return _onigasmPromise
}

function _resolvePath(filepath: string, prepend: string = '') {
  if (isBrowser) {
    return `../${prepend}${filepath}`
  } else {
    const path = require('path') as typeof import('path')

    if (path.isAbsolute(filepath)) {
      return filepath
    } else {
      return path.resolve(__dirname, '..', prepend + filepath)
    }
  }
}

/**
 * @param filepath assert path related to ./packages/shiki
 */
async function _loadAssets(filepath: string, prepend: string = ''): Promise<string> {
  const path = _resolvePath(filepath, prepend)
  if (isBrowser) {
    return await fetch(path).then(r => r.text())
  } else {
    const fs = require('fs') as typeof import('fs')
    return await fs.promises.readFile(path, 'utf-8')
  }
}

async function _loadJSONAssets(filepath: string, prepend?: string) {
  return JSON.parse(await _loadAssets(filepath, prepend))
}

/**
 * @param themePath related path to theme.json
 */
export async function loadTheme(themePath: string): Promise<IShikiTheme> {
  let theme: IRawTheme = await _loadJSONAssets(themePath, 'themes/')

  const shikiTheme = _toShikiTheme(theme)

  if (shikiTheme.include) {
    const includedTheme = await loadTheme(shikiTheme.include)

    if (includedTheme.settings) {
      shikiTheme.settings = shikiTheme.settings.concat(includedTheme.settings)
    }

    if (includedTheme.bg && !shikiTheme.bg) {
      shikiTheme.bg = includedTheme.bg
    }
  }

  return shikiTheme
}

export async function loadGrammar(lang: ILanguageRegistration): Promise<IRawGrammar> {
  const content = await _loadAssets(lang.path, 'languages/')
  return parseRawGrammar(content, isBrowser ? undefined : _resolvePath(lang.path, 'languages/'))
}

export function repairTheme(theme: IShikiTheme) {
  // Has the default no-scope setting with fallback colors
  if (theme.settings[0].settings && !theme.settings[0].scope) {
    return
  }

  // Push a no-scope setting with fallback colors
  theme.settings.unshift({
    settings: {
      foreground: theme.fg,
      background: theme.bg
    }
  })
}

function _toShikiTheme(rawTheme: IRawTheme): IShikiTheme {
  const shikiTheme: IShikiTheme = {
    ...rawTheme,
    ...getThemeDefaultColors(rawTheme)
  }

  if ((<any>rawTheme).include) {
    shikiTheme.include = (<any>rawTheme).include
  }
  if ((<any>rawTheme).tokenColors) {
    shikiTheme.settings = (<any>rawTheme).tokenColors
  }

  repairTheme(shikiTheme)

  return shikiTheme
}

/**
 * https://github.com/microsoft/vscode/blob/f7f05dee53fb33fe023db2e06e30a89d3094488f/src/vs/platform/theme/common/colorRegistry.ts#L258-L268
 */
const VSCODE_FALLBACK_EDITOR_FG = { light: '#333333', dark: '#bbbbbb' }
const VSCODE_FALLBACK_EDITOR_BG = { light: '#fffffe', dark: '#1e1e1e' }

function getThemeDefaultColors(theme: IRawTheme & { type?: string }): { fg: string; bg: string } {
  let fg, bg

  /**
   * First try:
   * Theme might contain a global `tokenColor` without `name` or `scope`
   * Used as default value for foreground/background
   */
  let settings = theme.settings ? theme.settings : (<any>theme).tokenColors
  const globalSetting = settings
    ? settings.find(s => {
        return !s.name && !s.scope
      })
    : undefined

  if (globalSetting?.settings?.foreground) {
    fg = globalSetting.settings.foreground
  }
  if (globalSetting?.settings?.background) {
    bg = globalSetting.settings.background
  }

  /**
   * Second try:
   * If there's no global `tokenColor` without `name` or `scope`
   * Use `editor.foreground` and `editor.background`
   */
  if (!fg && (<any>theme)?.colors['editor.foreground']) {
    fg = (<any>theme).colors['editor.foreground']
  }
  if (!bg && (<any>theme)?.colors['editor.background']) {
    bg = (<any>theme).colors['editor.background']
  }

  /**
   * Last try:
   * If there's no fg/bg color specified in theme, use default
   */
  if (!fg) {
    fg = theme.type === 'light' ? VSCODE_FALLBACK_EDITOR_FG.light : VSCODE_FALLBACK_EDITOR_FG.dark
  }
  if (!bg) {
    bg = theme.type === 'light' ? VSCODE_FALLBACK_EDITOR_BG.light : VSCODE_FALLBACK_EDITOR_BG.dark
  }

  return {
    fg,
    bg
  }
}
