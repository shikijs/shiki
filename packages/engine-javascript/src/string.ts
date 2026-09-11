import type { RegexEngineString } from '@shikijs/types'

/**
 * String with an `id`, so scanners can reuse searches on it (like `OnigString`).
 */
export interface JavaScriptEngineString extends RegexEngineString {
  readonly id: number
}

let lastStringId = 0

export function createJavaScriptEngineString(content: string): JavaScriptEngineString {
  return {
    content,
    id: ++lastStringId,
  }
}
