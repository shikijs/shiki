export class TwoslashIncludesManager extends Map<string, string> {
  add(name: string, code: string) {
    const lines: string[] = []

    code.split('\n').forEach((l, _i) => {
      const trimmed = l.trim()

      if (trimmed.startsWith('// - ')) {
        const key = trimmed.split('// - ')[1].split(' ')[0]
        this.set(`${name}-${key}`, lines.join('\n'))
      }
      else {
        lines.push(l)
      }
    })
    this.set(name, lines.join('\n'))
  }

  applyInclude(code: string) {
    const reMarker = /\/\/ @include: (.*)$/gm

    // Basically run a regex over the code replacing any // @include: thing with
    // 'thing' from the map

    // const toReplace: [index:number, length: number, str: string][] = []
    const toReplace: [number, number, string][] = []

    for (const match of code.matchAll(reMarker)) {
      const key = match[1]
      const replaceWith = this.get(key)

      if (!replaceWith) {
        const msg = `Could not find an include with the key: '${key}'.\nThere is: ${Array.from(this.keys())}.`
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
      .forEach((r) => {
        newCode = newCode.slice(0, r[0]) + r[2] + newCode.slice(r[0] + r[1])
      })
    return newCode
  }
}

/**
 * An "include [name]" segment in a raw meta string is a sequence of words,
 * possibly connected by dashes, following "include " and ending at a word boundary.
 */
const INCLUDE_META_REGEX = /include\s+([\w-]+)\b.*/

/**
 * Given a raw meta string for code block like 'twoslash include main-hello-world meta=miscellaneous',
 * capture the name of the reusable code block as "main-hello-world", and ignore anything
 * before and after this segment.
 */
export function parseIncludeMeta(meta?: string): string | null {
  if (!meta)
    return null

  const match = meta.match(INCLUDE_META_REGEX)

  return match?.[1] ?? null
}
