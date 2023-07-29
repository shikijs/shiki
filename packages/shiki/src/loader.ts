/// <reference path="./global.d.ts" />

// This is declared here rather than in global.d.ts because it is part of our
// public api due to setWasm. We need it because it won't be defined otherwise
// for Node users without "DOM" in their lib.
declare global {
  interface Response {
    json(): Promise<any>
    text(): Promise<any>
  }
}

import { join, dirpathparts } from './utils'
import type { IGrammar, IOnigLib, IRawTheme } from 'vscode-textmate'
import { loadWASM, createOnigScanner, createOnigString } from 'vscode-oniguruma'
import { parse, ParseError } from 'jsonc-parser'
import type { IShikiTheme } from './types'

export const isWebWorker =
  typeof self !== 'undefined' && typeof self.WorkerGlobalScope !== 'undefined'
export const isNode =
  'process' in globalThis &&
  typeof process !== 'undefined' &&
  typeof process.release !== 'undefined' &&
  process.release.name === 'node'
export const isBun =
  'process' in globalThis &&
  typeof process !== 'undefined' &&
  typeof process.release !== 'undefined' &&
  process.release.name === 'bun'
export const isBrowser = isWebWorker || (!isNode && !isBun)

// to be replaced by rollup
let CDN_ROOT = '__CDN_ROOT__'
let WASM: string | ArrayBuffer | Response = ''
export const WASM_PATH = 'dist/'

/**
 * Set the route for loading the assets
 * URL should end with `/`
 *
 * For example:
 * ```ts
 * setCDN('https://unpkg.com/shiki/') // use unpkg
 * setCDN('/assets/shiki/') // serve by yourself
 * ```
 */
export function setCDN(root: string) {
  CDN_ROOT = root.endsWith('/') ? root : root + '/'
}

/**
 * Explicitly set the source for loading the oniguruma web assembly module.
 *  *
 * Accepts ArrayBuffer or Response (usage of string is deprecated)
 */
export function setWasm(data: string | ArrayBuffer | Response) {
  WASM = data
}

let _onigurumaPromise: Promise<IOnigLib> = null

export async function getOniguruma(wasmPath?: string): Promise<IOnigLib> {
  if (!_onigurumaPromise) {
    let loader: Promise<void>
    if (isBrowser) {
      if (typeof WASM === 'string') {
        loader = loadWASM({
          data: await fetch(_resolvePath(join(...dirpathparts(wasmPath), 'onig.wasm')))
        })
      } else {
        loader = loadWASM({
          data: WASM
        })
      }
    } else {
      const path: typeof import('path') = require('path')
      const wasmPath = path.join(require.resolve('vscode-oniguruma'), '../onig.wasm')
      const fs: typeof import('fs') = require('fs')
      const wasmBin = fs.readFileSync(wasmPath).buffer
      loader = loadWASM(wasmBin)
    }

    _onigurumaPromise = loader.then(() => {
      return {
        createOnigScanner(patterns: string[]) {
          return createOnigScanner(patterns)
        },
        createOnigString(s: string) {
          return createOnigString(s)
        }
      }
    })
  }
  return _onigurumaPromise
}

function _resolvePath(filepath: string) {
  if (isBrowser) {
    return `${CDN_ROOT}${filepath}`
  } else {
    const path = require('path') as typeof import('path')

    if (path.isAbsolute(filepath)) {
      return filepath
    } else {
      return path.resolve(__dirname, '..', filepath)
    }
  }
}

/**
 * @param filepath assert path related to ./packages/shiki
 */
async function _fetchAssets(filepath: string): Promise<string> {
  const path = _resolvePath(filepath)
  if (isBrowser) {
    return await fetch(path).then(r => r.text())
  } else {
    const fs = require('fs') as typeof import('fs')
    return await fs.promises.readFile(path, 'utf-8')
  }
}

async function _fetchJSONAssets(filepath: string) {
  const errors: ParseError[] = []
  const assetString = await _fetchAssets(filepath)
  let rawAsset
  try {
    // Try to parse as JSON first, since it's much faster
    rawAsset = JSON.parse(assetString)
  } catch (e) {
    rawAsset = parse(assetString, errors, {
      allowTrailingComma: true
    })

    if (errors.length) {
      throw errors[0]
    }
  }
  return rawAsset
}

/**
 * @param themePath related path to theme.json
 */
export async function fetchTheme(themePath: string): Promise<IShikiTheme> {
  let theme: IRawTheme = await _fetchJSONAssets(themePath)

  const shikiTheme = toShikiTheme(theme)

  if (shikiTheme.include) {
    const includedTheme = await fetchTheme(join(...dirpathparts(themePath), shikiTheme.include))

    if (includedTheme.settings) {
      shikiTheme.settings = includedTheme.settings.concat(shikiTheme.settings)
    }

    if (includedTheme.bg && !shikiTheme.bg) {
      shikiTheme.bg = includedTheme.bg
    }

    if (includedTheme.colors) {
      shikiTheme.colors = { ...includedTheme.colors, ...shikiTheme.colors }
    }

    delete shikiTheme.include
  }

  return shikiTheme
}

export async function fetchGrammar(filepath: string): Promise<IGrammar> {
  return await _fetchJSONAssets(filepath)
}

export function repairTheme(theme: IShikiTheme) {
  // Has the default no-scope setting with fallback colors
  if (!theme.settings) theme.settings = []

  if (theme.settings[0] && theme.settings[0].settings && !theme.settings[0].scope) {
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

export function toShikiTheme(rawTheme: IRawTheme): IShikiTheme {
  const type = (<any>rawTheme).type || 'dark'

  const shikiTheme: IShikiTheme = {
    name: rawTheme.name!,
    type,
    ...rawTheme,
    ...getThemeDefaultColors(rawTheme)
  }

  if ((<any>rawTheme).include) {
    shikiTheme.include = (<any>rawTheme).include
  }
  if ((<any>rawTheme).tokenColors) {
    shikiTheme.settings = (<any>rawTheme).tokenColors
    delete (<any>shikiTheme).tokenColors
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
  if (!fg && (<any>theme)?.colors?.['editor.foreground']) {
    fg = (<any>theme).colors['editor.foreground']
  }
  if (!bg && (<any>theme)?.colors?.['editor.background']) {
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
