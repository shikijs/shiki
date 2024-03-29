/* ---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *-------------------------------------------------------- */

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
  findNextOnigScannerMatchDbg: (scanner: Pointer, strCacheId: number, strData: Pointer, strLength: number, position: number, options: number) => number
}

export interface IOnigCaptureIndex {
  start: number
  end: number
  length: number
}

export interface IOnigMatch {
  index: number
  captureIndices: IOnigCaptureIndex[]
}

export interface OnigScanner {
  // We need the bivariant type here
  // eslint-disable-next-line ts/method-signature-style
  findNextMatchSync(string: string | OnigString, startPosition: number): IOnigMatch | null
  readonly dispose?: () => void
}

export interface OnigString {
  readonly content: string
  readonly dispose?: () => void
}
