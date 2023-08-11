export default async function main(Onig) {
  Onig = Onig || {}

  const Module = typeof Onig != 'undefined' ? Onig : {}
  let promises = []
  const out = Module.print || console.log.bind(console)
  var err = Module.printErr || console.warn.bind(console)
  if (Module.thisProgram) thisProgram = Module.thisProgram
  if (Module.quit) quit_ = Module.quit
  if (Module.wasmBinary) wasmBinary = Module.wasmBinary

  let wasmMemory
  const UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf8') : undefined
  function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
    const endIdx = idx + maxBytesToRead
    let endPtr = idx
    while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr
    if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr))

    let str = ''
    while (idx < endPtr) {
      let u0 = heapOrArray[idx++]
      if (!(u0 & 128)) {
        str += String.fromCharCode(u0)
        continue
      }
      const u1 = heapOrArray[idx++] & 63
      if ((u0 & 224) == 192) {
        str += String.fromCharCode(((u0 & 31) << 6) | u1)
        continue
      }
      const u2 = heapOrArray[idx++] & 63
      if ((u0 & 240) == 224) u0 = ((u0 & 15) << 12) | (u1 << 6) | u2
      else u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63)

      if (u0 < 65536) {
        str += String.fromCharCode(u0)
      } else {
        const ch = u0 - 65536
        str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023))
      }
    }
    return str
  }
  let buffer, HEAPU8, HEAPU32
  function updateGlobalBufferAndViews(buf) {
    buffer = buf
    Module.HEAP8 = new Int8Array(buf)
    Module.HEAP16 = new Int16Array(buf)
    Module.HEAP32 = new Int32Array(buf)
    Module.HEAPU8 = HEAPU8 = new Uint8Array(buf)
    Module.HEAPU16 = new Uint16Array(buf)
    Module.HEAPU32 = HEAPU32 = new Uint32Array(buf)
    Module.HEAPF32 = new Float32Array(buf)
    Module.HEAPF64 = new Float64Array(buf)
  }
  const __ATINIT__ = []
  function initRuntime() {
    callRuntimeCallbacks(__ATINIT__)
  }
  function addOnInit(cb) {
    __ATINIT__.unshift(cb)
  }

  async function createWasm() {
    const info = { env: asmLibraryArg, wasi_snapshot_preview1: asmLibraryArg }
    function receiveInstance(instance, module) {
      const exports = instance.exports
      Module.asm = exports
      wasmMemory = Module.asm.memory
      updateGlobalBufferAndViews(wasmMemory.buffer)
      addOnInit(Module.asm.__wasm_call_ctors)
    }
    const exports = await Module.instantiateWasm(info)
    receiveInstance(exports)
    return exports
  }
  function callRuntimeCallbacks(callbacks) {
    while (callbacks.length > 0) callbacks.shift()(Module)
  }
  let _emscripten_get_now
  if (typeof dateNow != 'undefined') _emscripten_get_now = dateNow
  else _emscripten_get_now = () => performance.now()
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
    } catch (e) {}
  }
  function _emscripten_resize_heap(requestedSize) {
    const oldSize = HEAPU8.length
    requestedSize = requestedSize >>> 0
    const maxHeapSize = getHeapMax()
    if (requestedSize > maxHeapSize) return false

    const alignUp = (x, multiple) => x + ((multiple - (x % multiple)) % multiple)
    for (let cutDown = 1; cutDown <= 4; cutDown *= 2) {
      let overGrownHeapSize = oldSize * (1 + 0.2 / cutDown)
      overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296)
      const newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536))
      const replacement = emscripten_realloc_buffer(newSize)
      if (replacement) return true
    }
    return false
  }
  const printCharBuffers = [null, [], []]
  function printChar(stream, curr) {
    const buffer = printCharBuffers[stream]
    if (curr === 0 || curr === 10) {
      ;(stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0))
      buffer.length = 0
    } else {
      buffer.push(curr)
    }
  }
  function _fd_write(fd, iov, iovcnt, pnum) {
    let num = 0
    for (let i = 0; i < iovcnt; i++) {
      const ptr = HEAPU32[iov >> 2]
      const len = HEAPU32[(iov + 4) >> 2]
      iov += 8
      for (let j = 0; j < len; j++) printChar(fd, HEAPU8[ptr + j])

      num += len
    }
    HEAPU32[pnum >> 2] = num
    return 0
  }
  var asmLibraryArg = { emscripten_get_now: _emscripten_get_now, emscripten_memcpy_big: _emscripten_memcpy_big, emscripten_resize_heap: _emscripten_resize_heap, fd_write: _fd_write }
  await createWasm()
  Module.___wasm_call_ctors = function () {
    return (Module.___wasm_call_ctors = Module.asm.__wasm_call_ctors).apply(null, arguments)
  }
  Module.___errno_location = function () {
    return (Module.___errno_location = Module.asm.__errno_location).apply(null, arguments)
  }
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
  Module.stackSave = function () {
    return (Module.stackSave = Module.asm.stackSave).apply(null, arguments)
  }
  Module.stackRestore = function () {
    return (Module.stackRestore = Module.asm.stackRestore).apply(null, arguments)
  }
  Module.stackAlloc = function () {
    return (Module.stackAlloc = Module.asm.stackAlloc).apply(null, arguments)
  }
  Module.dynCall_jiji = function () {
    return (Module.dynCall_jiji = Module.asm.dynCall_jiji).apply(null, arguments)
  }

  initRuntime()

  await Promise.all(promises)

  return Module
}
