export class TwoslashIncludesManager {
  constructor(
    public map: Map<string, string> = new Map(),
  ) {}

  add(name: string, code: string): void {
    const lines: string[] = []

    code.split('\n').forEach((l, _i) => {
      const trimmed = l.trim()

      if (trimmed.startsWith('// - ')) {
        const key = trimmed.split('// - ')[1].split(' ')[0]
        this.map.set(`${name}-${key}`, lines.join('\n'))
      }
      else {
        lines.push(l)
      }
    })
    this.map.set(name, lines.join('\n'))
  }

  applyInclude(code: string): string {
    const reMarker = /\/\/ @include: (.*)$/gm

    // Basically run a regex over the code replacing any // @include: thing with
    // 'thing' from the map

    const toReplace: [index: number, length: number, replacementCode: string][] = []

    for (const match of code.matchAll(reMarker)) {
      const key = match[1]
      const replaceWith = this.map.get(key)

      if (!replaceWith) {
        const msg = `Could not find an include with the key: '${key}'.\nThere is: ${Array.from(this.map.keys())}.`
        throw new Error(msg)
      }
      else {
        toReplace.push([match.index, match[0].length, replaceWith])
      }
    }

    let newCode = code.toString()

    // Go backwards through the found changes so that we can retain index position
    toReplace
      .reverse()
      .forEach(([index, length, replacementCode]) => {
        newCode = newCode.slice(0, index) + replacementCode + newCode.slice(index + length)
      })

    return newCode
  }
}

/**
 * An "include [name]" segment in a raw meta string has a "name" that is a sequence of word
 * characters, possibly connected by dashes, that ends at a word boundary.
 */
const INCLUDE_META_REGEX = /include\s+([\w-]+)\b.*/

/**
 * @param meta The raw meta string of a code block, e.g. 'twoslash include main-hello-world meta=miscellaneous'.
 * @returns The name of the reusable code block, e.g. "main-hello-world", if it exists.
 */
export function parseIncludeMeta(meta?: string): string | null {
  if (!meta)
    return null

  const match = meta.match(INCLUDE_META_REGEX)
  return match?.[1] ?? null
}
