/**
 * Split a string into lines, each line preserves the line ending.
 *
 * @param code - The code string to split into lines
 * @param preserveEnding - Whether to preserve line endings in the result
 * @returns Array of tuples containing [line content, offset index]
 *
 * @example
 * ```ts
 * splitLines('hello\nworld', false)
 * // => [['hello', 0], ['world', 6]]
 *
 * splitLines('hello\nworld', true)
 * // => [['hello\n', 0], ['world', 6]]
 * ```
 */
export function splitLines(code: string, preserveEnding = false): [string, number][] {
  // Handle empty string edge case
  if (code.length === 0) {
    return [['', 0]]
  }

  const parts = code.split(/(\r?\n)/g)
  let index = 0
  const lines: [string, number][] = []

  for (let i = 0; i < parts.length; i += 2) {
    const line = preserveEnding
      ? parts[i] + (parts[i + 1] || '')
      : parts[i]
    lines.push([line, index])
    index += parts[i].length
    index += parts[i + 1]?.length || 0
  }

  return lines
}
