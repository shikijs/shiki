let _onigurumaPromise: Promise<{ data: ArrayBuffer }> | null = null
export async function getWasmInlined(): Promise<{ data: ArrayBuffer }> {
  if (!_onigurumaPromise) {
    // @ts-expect-error anyway
    _onigurumaPromise = import('vscode-oniguruma/release/onig.wasm')
      .then(r => ({ data: r.default as ArrayBuffer }))
  }
  return _onigurumaPromise
}
