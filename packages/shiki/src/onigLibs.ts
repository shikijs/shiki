/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict'

import { IOnigLib } from 'vscode-textmate'

let onigasmLib: Promise<IOnigLib> = null

export function getOnigasm(): Promise<IOnigLib> {
  if (!onigasmLib) {
    const onigasmModule = require('onigasm')
    const onigasmIndexpath = require.resolve('onigasm')

    const fs = require('fs')
    const path = require('path')
    const wasmBin = fs.readFileSync(path.join(onigasmIndexpath, '../onigasm.wasm')).buffer
    onigasmLib = onigasmModule.loadWASM(wasmBin).then((_: any) => {
      return {
        createOnigScanner(patterns: string[]) {
          return new onigasmModule.OnigScanner(patterns)
        },
        createOnigString(s: string) {
          return new onigasmModule.OnigString(s)
        }
      }
    })
  }
  return onigasmLib
}
