/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-spread */
export default async function main(Module) {
  let wasmMemory
  let buffer, HEAPU8
  function updateGlobalBufferAndViews(buf) {
    buffer = buf
    Module.HEAP8 = new Int8Array(buf)
    Module.HEAP16 = new Int16Array(buf)
    Module.HEAP32 = new Int32Array(buf)
    Module.HEAPU8 = HEAPU8 = new Uint8Array(buf)
    Module.HEAPU16 = new Uint16Array(buf)
    Module.HEAPU32 = new Uint32Array(buf)
    Module.HEAPF32 = new Float32Array(buf)
    Module.HEAPF64 = new Float64Array(buf)
  }

  const _emscripten_get_now = () => performance.now()

  function _emscripten_memcpy_big(dest, src, num) {
    HEAPU8.copyWithin(dest, src, src + num)
  }
  function getHeapMax() {
    return 2147483648
  }
  function emscripten_realloc_buffer(size) {
    try {
      wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16)
      updateGlobalBufferAndViews(wasmMemory.buffer)
      return 1
    }
    catch (e) {}
  }
  function _emscripten_resize_heap(requestedSize) {
    const oldSize = HEAPU8.length
    requestedSize = requestedSize >>> 0
    const maxHeapSize = getHeapMax()
    if (requestedSize > maxHeapSize)
      return false

    const alignUp = (x, multiple) => x + ((multiple - (x % multiple)) % multiple)
    for (let cutDown = 1; cutDown <= 4; cutDown *= 2) {
      let overGrownHeapSize = oldSize * (1 + 0.2 / cutDown)
      overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296)
      const newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536))
      const replacement = emscripten_realloc_buffer(newSize)
      if (replacement)
        return true
    }
    return false
  }
  const asmLibraryArg = {
    emscripten_get_now: _emscripten_get_now,
    emscripten_memcpy_big: _emscripten_memcpy_big,
    emscripten_resize_heap: _emscripten_resize_heap,
    fd_write: () => 0,
  }

  async function createWasm() {
    const info = {
      env: asmLibraryArg,
      wasi_snapshot_preview1: asmLibraryArg,
    }
    function receiveInstance(instance) {
      const exports = instance.exports
      Module.asm = exports
      wasmMemory = Module.asm.memory
      updateGlobalBufferAndViews(wasmMemory.buffer)
    }
    const exports = await Module.instantiateWasm(info)
    receiveInstance(exports)
    return exports
  }

  await createWasm()
  Module._omalloc = function () {
    return (Module._omalloc = Module.asm.omalloc).apply(null, arguments)
  }
  Module._ofree = function () {
    return (Module._ofree = Module.asm.ofree).apply(null, arguments)
  }
  Module._getLastOnigError = function () {
    return (Module._getLastOnigError = Module.asm.getLastOnigError).apply(null, arguments)
  }
  Module._createOnigScanner = function () {
    return (Module._createOnigScanner = Module.asm.createOnigScanner).apply(null, arguments)
  }
  Module._freeOnigScanner = function () {
    return (Module._freeOnigScanner = Module.asm.freeOnigScanner).apply(null, arguments)
  }
  Module._findNextOnigScannerMatch = function () {
    return (Module._findNextOnigScannerMatch = Module.asm.findNextOnigScannerMatch).apply(null, arguments)
  }
  Module._findNextOnigScannerMatchDbg = function () {
    return (Module._findNextOnigScannerMatchDbg = Module.asm.findNextOnigScannerMatchDbg).apply(null, arguments)
  }

  return Module
}
