/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

import { IOnigLib, Thenable } from 'vscode-textmate';

let onigasmLib: Thenable<IOnigLib> = null;

export function getOnigasm(): Thenable<IOnigLib> {
	if (!onigasmLib) {
		let onigasmModule = require('onigasm');
		let fs = require('fs');
		let path = require('path');
		const wasmBin = fs.readFileSync(path.join(__dirname, '../node_modules/onigasm/lib/onigasm.wasm')).buffer;
		onigasmLib = onigasmModule.loadWASM(wasmBin).then((_: any) => {
			return {
				createOnigScanner(patterns: string[]) { return new onigasmModule.OnigScanner(patterns); },
				createOnigString(s: string) { return new onigasmModule.OnigString(s); }
			};
		});
	}
	return onigasmLib;
}