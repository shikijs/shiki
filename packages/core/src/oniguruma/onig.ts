import type { IOnigBinding, Instantiator } from './types'

export default async function main(init: Instantiator): Promise<IOnigBinding> {
  let wasmMemory: any
  let buffer: ArrayBuffer

  const binding = {} as IOnigBinding

  function updateGlobalBufferAndViews(buf: ArrayBuffer) {
    buffer = buf
    binding.HEAPU8 = new Uint8Array(buf)
    binding.HEAPU32 = new Uint32Array(buf)
  }

  function _emscripten_get_now() {
    return typeof performance !== 'undefined' ? performance.now() : Date.now()
  }
  function _emscripten_memcpy_big(dest: number, src: number, num: number) {
    binding.HEAPU8.copyWithin(dest, src, src + num)
  }
  function getHeapMax() {
    return 2147483648
  }
  function emscripten_realloc_buffer(size: number) {
    try {
      wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16)
      updateGlobalBufferAndViews(wasmMemory.buffer)
      return 1
    }
    catch (e) {}
  }
  function _emscripten_resize_heap(requestedSize: number) {
    const oldSize = binding.HEAPU8.length
    requestedSize = requestedSize >>> 0
    const maxHeapSize = getHeapMax()
    if (requestedSize > maxHeapSize)
      return false

    const alignUp = (x: number, multiple: number) => x + ((multiple - (x % multiple)) % multiple)
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
    const exports = await init(info)
    wasmMemory = exports.memory
    updateGlobalBufferAndViews(wasmMemory.buffer)
    Object.assign(binding, exports)
  }

  await createWasm()

  return binding
}
