import type { Instantiator, IOnigBinding } from '.'

function getHeapMax(): number {
  return 2147483648
}

function _emscripten_get_now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now()
}

const alignUp = (x: number, multiple: number): number => x + ((multiple - (x % multiple)) % multiple)

export default async function main(init: Instantiator): Promise<IOnigBinding> {
  let wasmMemory: any
  let buffer: ArrayBuffer

  const binding = {} as IOnigBinding

  function updateGlobalBufferAndViews(buf: ArrayBuffer): void {
    buffer = buf
    binding.HEAPU8 = new Uint8Array(buf)
    binding.HEAPU32 = new Uint32Array(buf)
  }

  function _emscripten_memcpy_big(dest: number, src: number, num: number): void {
    binding.HEAPU8.copyWithin(dest, src, src + num)
  }

  function emscripten_realloc_buffer(size: number): undefined | 1 {
    try {
      wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16)
      updateGlobalBufferAndViews(wasmMemory.buffer)
      return 1
    }
    catch {}
  }
  function _emscripten_resize_heap(requestedSize: number): boolean {
    const oldSize = binding.HEAPU8.length
    requestedSize = requestedSize >>> 0
    const maxHeapSize = getHeapMax()
    if (requestedSize > maxHeapSize)
      return false

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

  const UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf8') : undefined
  function UTF8ArrayToString(heapOrArray: Uint8Array, idx: number, maxBytesToRead = 1024): string {
    const endIdx = idx + maxBytesToRead
    let endPtr = idx
    while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr
    if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
      return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr))
    }
    let str = ''
    while (idx < endPtr) {
      let u0 = heapOrArray[idx++]
      if (!(u0 & 128)) {
        str += String.fromCharCode(u0)
        continue
      }
      const u1 = heapOrArray[idx++] & 63
      if ((u0 & 224) === 192) {
        str += String.fromCharCode(((u0 & 31) << 6) | u1)
        continue
      }
      const u2 = heapOrArray[idx++] & 63
      if ((u0 & 240) === 224) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2
      }
      else {
        u0 = ((u0 & 7) << 18)
          | (u1 << 12)
          | (u2 << 6)
          | (heapOrArray[idx++] & 63)
      }
      if (u0 < 65536) {
        str += String.fromCharCode(u0)
      }
      else {
        const ch = u0 - 65536
        str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023))
      }
    }
    return str
  }
  function UTF8ToString(ptr: number, maxBytesToRead?: number): string {
    return ptr ? UTF8ArrayToString(binding.HEAPU8, ptr, maxBytesToRead) : ''
  }

  const asmLibraryArg = {
    emscripten_get_now: _emscripten_get_now,
    emscripten_memcpy_big: _emscripten_memcpy_big,
    emscripten_resize_heap: _emscripten_resize_heap,
    fd_write: () => 0,
  }

  async function createWasm(): Promise<void> {
    const info = {
      env: asmLibraryArg,
      wasi_snapshot_preview1: asmLibraryArg,
    }
    const exports = await init(info)
    wasmMemory = exports.memory
    updateGlobalBufferAndViews(wasmMemory.buffer)
    Object.assign(binding, exports)
    binding.UTF8ToString = UTF8ToString
  }

  await createWasm()

  return binding
}
