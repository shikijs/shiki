/* ---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *-------------------------------------------------------- */

import type {
  LoadWasmOptions,
  WebAssemblyInstance,
  WebAssemblyInstantiator,
} from '@shikijs/types'
import type {
  IOnigCaptureIndex,
  IOnigMatch,
  OnigScanner as IOnigScanner,
  OnigString as IOnigString,
} from '@shikijs/vscode-textmate'
import { ShikiError } from '@shikijs/types'
import createOnigasm from './onig'

export type Instantiator = (importObject: Record<string, Record<string, WebAssembly.ImportValue>>) => Promise<WebAssembly.Exports>

export type Pointer = number

export const enum FindOption {
  None = 0,
  /**
   * equivalent of ONIG_OPTION_NOT_BEGIN_STRING: (str) isn't considered as begin of string (* fail \A)
   */
  NotBeginString = 1,
  /**
   * equivalent of ONIG_OPTION_NOT_END_STRING: (end) isn't considered as end of string (* fail \z, \Z)
   */
  NotEndString = 2,
  /**
   * equivalent of ONIG_OPTION_NOT_BEGIN_POSITION: (start) isn't considered as start position of search (* fail \G)
   */
  NotBeginPosition = 4,
}

export interface IOnigBinding {
  HEAPU8: Uint8Array
  HEAPU32: Uint32Array

  UTF8ToString: (ptr: Pointer) => string

  omalloc: (count: number) => Pointer
  ofree: (ptr: Pointer) => void
  getLastOnigError: () => Pointer
  createOnigScanner: (strPtrsPtr: Pointer, strLenPtr: Pointer, count: number) => Pointer
  freeOnigScanner: (ptr: Pointer) => void
  findNextOnigScannerMatch: (scanner: Pointer, strCacheId: number, strData: Pointer, strLength: number, position: number, options: number) => number
  // findNextOnigScannerMatchDbg: (scanner: Pointer, strCacheId: number, strData: Pointer, strLength: number, position: number, options: number) => number
}

let onigBinding: IOnigBinding | null = null
// let defaultDebugCall = false

function throwLastOnigError(onigBinding: IOnigBinding): void {
  throw new ShikiError(onigBinding.UTF8ToString(onigBinding.getLastOnigError()))
}

class UtfString {
  private static _utf8ByteLength(str: string): number {
    let result = 0
    for (let i = 0, len = str.length; i < len; i++) {
      const charCode = str.charCodeAt(i)

      let codepoint = charCode
      let wasSurrogatePair = false

      if (charCode >= 0xD800 && charCode <= 0xDBFF) {
        // Hit a high surrogate, try to look for a matching low surrogate
        if (i + 1 < len) {
          const nextCharCode = str.charCodeAt(i + 1)
          if (nextCharCode >= 0xDC00 && nextCharCode <= 0xDFFF) {
            // Found the matching low surrogate
            codepoint = (((charCode - 0xD800) << 10) + 0x10000) | (nextCharCode - 0xDC00)
            wasSurrogatePair = true
          }
        }
      }

      if (codepoint <= 0x7F)
        result += 1

      else if (codepoint <= 0x7FF)
        result += 2

      else if (codepoint <= 0xFFFF)
        result += 3

      else
        result += 4

      if (wasSurrogatePair)
        i++
    }

    return result
  }

  public readonly utf16Length: number
  public readonly utf8Length: number
  public readonly utf16Value: string
  public readonly utf8Value: Uint8Array
  public readonly utf16OffsetToUtf8: Uint32Array | null
  public readonly utf8OffsetToUtf16: Uint32Array | null

  constructor(str: string) {
    const utf16Length = str.length
    const utf8Length = UtfString._utf8ByteLength(str)
    const computeIndicesMapping = (utf8Length !== utf16Length)
    const utf16OffsetToUtf8 = computeIndicesMapping ? new Uint32Array(utf16Length + 1) : null!
    if (computeIndicesMapping)
      utf16OffsetToUtf8[utf16Length] = utf8Length

    const utf8OffsetToUtf16 = computeIndicesMapping ? new Uint32Array(utf8Length + 1) : null!
    if (computeIndicesMapping)
      utf8OffsetToUtf16[utf8Length] = utf16Length

    const utf8Value = new Uint8Array(utf8Length)

    let i8 = 0
    for (let i16 = 0; i16 < utf16Length; i16++) {
      const charCode = str.charCodeAt(i16)

      let codePoint = charCode
      let wasSurrogatePair = false

      if (charCode >= 0xD800 && charCode <= 0xDBFF) {
        // Hit a high surrogate, try to look for a matching low surrogate
        if (i16 + 1 < utf16Length) {
          const nextCharCode = str.charCodeAt(i16 + 1)
          if (nextCharCode >= 0xDC00 && nextCharCode <= 0xDFFF) {
            // Found the matching low surrogate
            codePoint = (((charCode - 0xD800) << 10) + 0x10000) | (nextCharCode - 0xDC00)
            wasSurrogatePair = true
          }
        }
      }

      if (computeIndicesMapping) {
        utf16OffsetToUtf8[i16] = i8
        if (wasSurrogatePair)
          utf16OffsetToUtf8[i16 + 1] = i8

        if (codePoint <= 0x7F) {
          utf8OffsetToUtf16[i8 + 0] = i16
        }
        else if (codePoint <= 0x7FF) {
          utf8OffsetToUtf16[i8 + 0] = i16
          utf8OffsetToUtf16[i8 + 1] = i16
        }
        else if (codePoint <= 0xFFFF) {
          utf8OffsetToUtf16[i8 + 0] = i16
          utf8OffsetToUtf16[i8 + 1] = i16
          utf8OffsetToUtf16[i8 + 2] = i16
        }
        else {
          utf8OffsetToUtf16[i8 + 0] = i16
          utf8OffsetToUtf16[i8 + 1] = i16
          utf8OffsetToUtf16[i8 + 2] = i16
          utf8OffsetToUtf16[i8 + 3] = i16
        }
      }

      if (codePoint <= 0x7F) {
        utf8Value[i8++] = codePoint
      }
      else if (codePoint <= 0x7FF) {
        utf8Value[i8++] = 0b11000000 | ((codePoint & 0b00000000000000000000011111000000) >>> 6)
        utf8Value[i8++] = 0b10000000 | ((codePoint & 0b00000000000000000000000000111111) >>> 0)
      }
      else if (codePoint <= 0xFFFF) {
        utf8Value[i8++] = 0b11100000 | ((codePoint & 0b00000000000000001111000000000000) >>> 12)
        utf8Value[i8++] = 0b10000000 | ((codePoint & 0b00000000000000000000111111000000) >>> 6)
        utf8Value[i8++] = 0b10000000 | ((codePoint & 0b00000000000000000000000000111111) >>> 0)
      }
      else {
        utf8Value[i8++] = 0b11110000 | ((codePoint & 0b00000000000111000000000000000000) >>> 18)
        utf8Value[i8++] = 0b10000000 | ((codePoint & 0b00000000000000111111000000000000) >>> 12)
        utf8Value[i8++] = 0b10000000 | ((codePoint & 0b00000000000000000000111111000000) >>> 6)
        utf8Value[i8++] = 0b10000000 | ((codePoint & 0b00000000000000000000000000111111) >>> 0)
      }

      if (wasSurrogatePair)
        i16++
    }

    this.utf16Length = utf16Length
    this.utf8Length = utf8Length
    this.utf16Value = str
    this.utf8Value = utf8Value
    this.utf16OffsetToUtf8 = utf16OffsetToUtf8
    this.utf8OffsetToUtf16 = utf8OffsetToUtf16
  }

  public createString(onigBinding: IOnigBinding): Pointer {
    const result = onigBinding.omalloc(this.utf8Length)
    onigBinding.HEAPU8.set(this.utf8Value, result)
    return result
  }
}

export class OnigString implements IOnigString {
  private static LAST_ID = 0
  private static _sharedPtr: Pointer = 0 // a pointer to a string of 10000 bytes
  private static _sharedPtrInUse: boolean = false

  public readonly id = (++OnigString.LAST_ID)
  private readonly _onigBinding: IOnigBinding
  public readonly content: string
  public readonly utf16Length: number
  public readonly utf8Length: number
  public readonly utf16OffsetToUtf8: Uint32Array | null
  public readonly utf8OffsetToUtf16: Uint32Array | null
  public readonly ptr: Pointer

  constructor(str: string) {
    if (!onigBinding)
      throw new ShikiError('Must invoke loadWasm first.')

    this._onigBinding = onigBinding
    this.content = str
    const utfString = new UtfString(str)
    this.utf16Length = utfString.utf16Length
    this.utf8Length = utfString.utf8Length
    this.utf16OffsetToUtf8 = utfString.utf16OffsetToUtf8
    this.utf8OffsetToUtf16 = utfString.utf8OffsetToUtf16

    if (this.utf8Length < 10000 && !OnigString._sharedPtrInUse) {
      if (!OnigString._sharedPtr)
        OnigString._sharedPtr = onigBinding.omalloc(10000)

      OnigString._sharedPtrInUse = true
      onigBinding.HEAPU8.set(utfString.utf8Value, OnigString._sharedPtr)
      this.ptr = OnigString._sharedPtr
    }
    else {
      this.ptr = utfString.createString(onigBinding)
    }
  }

  public convertUtf8OffsetToUtf16(utf8Offset: number): number {
    if (this.utf8OffsetToUtf16) {
      if (utf8Offset < 0)
        return 0

      if (utf8Offset > this.utf8Length)
        return this.utf16Length

      return this.utf8OffsetToUtf16[utf8Offset]
    }
    return utf8Offset
  }

  public convertUtf16OffsetToUtf8(utf16Offset: number): number {
    if (this.utf16OffsetToUtf8) {
      if (utf16Offset < 0)
        return 0

      if (utf16Offset > this.utf16Length)
        return this.utf8Length

      return this.utf16OffsetToUtf8[utf16Offset]
    }
    return utf16Offset
  }

  public dispose(): void {
    if (this.ptr === OnigString._sharedPtr)
      OnigString._sharedPtrInUse = false

    else
      this._onigBinding.ofree(this.ptr)
  }
}

export class OnigScanner implements IOnigScanner {
  private readonly _onigBinding: IOnigBinding
  private readonly _ptr: Pointer

  constructor(patterns: string[]) {
    if (!onigBinding)
      throw new ShikiError('Must invoke loadWasm first.')

    const strPtrsArr: Pointer[] = []
    const strLenArr: number[] = []
    for (let i = 0, len = patterns.length; i < len; i++) {
      const utfString = new UtfString(patterns[i])
      strPtrsArr[i] = utfString.createString(onigBinding)
      strLenArr[i] = utfString.utf8Length
    }
    const strPtrsPtr = onigBinding.omalloc(4 * patterns.length)
    onigBinding.HEAPU32.set(strPtrsArr, strPtrsPtr / 4)

    const strLenPtr = onigBinding.omalloc(4 * patterns.length)
    onigBinding.HEAPU32.set(strLenArr, strLenPtr / 4)

    const scannerPtr = onigBinding.createOnigScanner(strPtrsPtr, strLenPtr, patterns.length)

    for (let i = 0, len = patterns.length; i < len; i++)
      onigBinding.ofree(strPtrsArr[i])

    onigBinding.ofree(strLenPtr)
    onigBinding.ofree(strPtrsPtr)

    if (scannerPtr === 0)
      throwLastOnigError(onigBinding)

    this._onigBinding = onigBinding
    this._ptr = scannerPtr
  }

  public dispose(): void {
    this._onigBinding.freeOnigScanner(this._ptr)
  }

  public findNextMatchSync(string: string | OnigString, startPosition: number, options: number): IOnigMatch | null
  public findNextMatchSync(string: string | OnigString, startPosition: number, debugCall: boolean): IOnigMatch | null
  public findNextMatchSync(string: string | OnigString, startPosition: number): IOnigMatch | null
  public findNextMatchSync(string: string | OnigString, startPosition: number, arg?: number | boolean): IOnigMatch | null {
    // let debugCall = defaultDebugCall
    let options = FindOption.None
    if (typeof arg === 'number') {
      // if (arg & FindOption.DebugCall)
      //   debugCall = true
      options = arg
    }
    else if (typeof arg === 'boolean') {
      // debugCall = arg
    }
    if (typeof string === 'string') {
      string = new OnigString(string)
      const result = this._findNextMatchSync(string, startPosition, false, options)
      string.dispose()
      return result
    }
    return this._findNextMatchSync(string, startPosition, false, options)
  }

  private _findNextMatchSync(string: OnigString, startPosition: number, debugCall: boolean, options: number): IOnigMatch | null {
    const onigBinding = this._onigBinding
    // let resultPtr: Pointer
    // if (debugCall)
    //   resultPtr = onigBinding.findNextOnigScannerMatchDbg(this._ptr, string.id, string.ptr, string.utf8Length, string.convertUtf16OffsetToUtf8(startPosition), options)

    // else
    const resultPtr = onigBinding.findNextOnigScannerMatch(this._ptr, string.id, string.ptr, string.utf8Length, string.convertUtf16OffsetToUtf8(startPosition), options)

    if (resultPtr === 0) {
      // no match
      return null
    }
    const HEAPU32 = onigBinding.HEAPU32
    let offset = resultPtr / 4 // byte offset -> uint32 offset
    const index = HEAPU32[offset++]
    const count = HEAPU32[offset++]
    const captureIndices: IOnigCaptureIndex[] = []
    for (let i = 0; i < count; i++) {
      const beg = string.convertUtf8OffsetToUtf16(HEAPU32[offset++])
      const end = string.convertUtf8OffsetToUtf16(HEAPU32[offset++])
      captureIndices[i] = {
        start: beg,
        end,
        length: end - beg,
      }
    }
    return {
      index,
      captureIndices,
    }
  }
}

function isInstantiatorOptionsObject(dataOrOptions: any): dataOrOptions is { instantiator: WebAssemblyInstantiator } {
  return (typeof dataOrOptions.instantiator === 'function')
}

function isInstantiatorModule(dataOrOptions: any): dataOrOptions is { default: WebAssemblyInstantiator } {
  return (typeof dataOrOptions.default === 'function')
}

function isDataOptionsObject(dataOrOptions: any): dataOrOptions is { data: ArrayBufferView | ArrayBuffer | Response } {
  return (typeof dataOrOptions.data !== 'undefined')
}

function isResponse(dataOrOptions: any): dataOrOptions is Response {
  return (typeof Response !== 'undefined' && dataOrOptions instanceof Response)
}

function isArrayBuffer(data: any): data is ArrayBuffer | ArrayBufferView {
  return (typeof ArrayBuffer !== 'undefined' && (data instanceof ArrayBuffer || ArrayBuffer.isView(data)))
    // eslint-disable-next-line node/prefer-global/buffer
    || (typeof Buffer !== 'undefined' && Buffer.isBuffer?.(data))
    || (typeof SharedArrayBuffer !== 'undefined' && data instanceof SharedArrayBuffer)
    || (typeof Uint32Array !== 'undefined' && data instanceof Uint32Array)
}

let initPromise: Promise<void>

export function loadWasm(options: LoadWasmOptions): Promise<void> {
  if (initPromise)
    return initPromise

  async function _load(): Promise<void> {
    onigBinding = await createOnigasm(async (info) => {
      let instance: LoadWasmOptions | WebAssemblyInstance = options
      instance = await instance
      if (typeof instance === 'function')
        instance = await instance(info)
      if (typeof instance === 'function')
        instance = await instance(info)

      if (isInstantiatorOptionsObject(instance)) {
        instance = await instance.instantiator(info)
      }
      else if (isInstantiatorModule(instance)) {
        instance = await instance.default(info)
      }
      else {
        if (isDataOptionsObject(instance))
          instance = instance.data

        if (isResponse(instance)) {
          if (typeof WebAssembly.instantiateStreaming === 'function')
            instance = await _makeResponseStreamingLoader(instance)(info)
          else
            instance = await _makeResponseNonStreamingLoader(instance)(info)
        }
        else if (isArrayBuffer(instance)) {
          instance = await _makeArrayBufferLoader(instance)(info)
        }
        // import("shiki/onig.wasm") returns `{ default: WebAssembly.Module }` on cloudflare workers
        // https://developers.cloudflare.com/workers/wrangler/bundling/
        else if (instance instanceof WebAssembly.Module) {
          instance = await _makeArrayBufferLoader(instance)(info)
        }
        else if ('default' in instance && instance.default instanceof WebAssembly.Module) {
          instance = await _makeArrayBufferLoader(instance.default)(info)
        }
      }

      if ('instance' in instance)
        instance = (instance as WebAssembly.WebAssemblyInstantiatedSource).instance
      if ('exports' in instance)
        instance = (instance as WebAssembly.Instance).exports
      return instance
    })
  }

  initPromise = _load()
  return initPromise
}

function _makeArrayBufferLoader(data: ArrayBufferView | ArrayBuffer | WebAssembly.Module): WebAssemblyInstantiator {
  return importObject => WebAssembly.instantiate(data, importObject)
}
function _makeResponseStreamingLoader(data: Response): WebAssemblyInstantiator {
  return importObject => WebAssembly.instantiateStreaming(data, importObject)
}
function _makeResponseNonStreamingLoader(data: Response): WebAssemblyInstantiator {
  return async (importObject) => {
    const arrayBuffer = await data.arrayBuffer()
    return WebAssembly.instantiate(arrayBuffer, importObject)
  }
}

// export function createOnigString(str: string) {
//   return new OnigString(str)
// }

// export function createOnigScanner(patterns: string[]) {
//   return new OnigScanner(patterns)
// }

// export function setDefaultDebugCall(_defaultDebugCall: boolean): void {
//   defaultDebugCall = _defaultDebugCall
// }
