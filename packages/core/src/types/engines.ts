import type { OnigScanner, OnigString } from '@shikijs/vscode-textmate'
import type { Awaitable } from './utils'

export interface PatternScanner extends OnigScanner {}

export interface RegexEngineString extends OnigString {}

/**
 * Engine for RegExp matching and scanning.
 */
export interface RegexEngine {
  createScanner: (patterns: string[]) => PatternScanner
  createString: (s: string) => RegexEngineString
}

export interface WebAssemblyInstantiator {
  (importObject: Record<string, Record<string, WebAssembly.ImportValue>> | undefined): Promise<WebAssemblyInstance>
}

export type WebAssemblyInstance = WebAssembly.WebAssemblyInstantiatedSource | WebAssembly.Instance | WebAssembly.Instance['exports']

export type OnigurumaLoadOptions =
  | { instantiator: WebAssemblyInstantiator }
  | { default: WebAssemblyInstantiator }
  | { data: ArrayBufferView | ArrayBuffer | Response }

export type LoadWasmOptionsPlain =
  | OnigurumaLoadOptions
  | WebAssemblyInstantiator
  | ArrayBufferView | ArrayBuffer | Response

export type LoadWasmOptions = Awaitable<LoadWasmOptionsPlain> | (() => Awaitable<LoadWasmOptionsPlain>)

export interface JavaScriptRegexEngineOptions {
  /**
   * Whether to allow invalid regex patterns.
   */
  forgiving?: boolean

  /**
   * Cache for regex patterns.
   */
  cache?: Map<string, RegExp | Error>
}
