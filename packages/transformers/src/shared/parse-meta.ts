export function parseMetaString(meta: string, keys: string[]): null | Record<string, number[]> {
  if (!meta)
    return null
  // fall back to `highlight` when no key explicitly given
  meta = meta.replace(/(?<=\s|^)\{([\d,-]+)\}/g, `highlight={$1}`)
  const regex = new RegExp(`(?:(${keys.join('|')})=)\\{([\\d,-]+)\\}`, 'g')

  const matches = [...meta.matchAll(regex)]
  if (matches.length === 0)
    return null

  const result: Record<string, number[]> = {}

  matches.forEach((match) => {
    const key = match[1]
    const lines = match[2]
      .split(',')
      .flatMap((v) => {
        const num = v.split('-').map(v => Number.parseInt(v, 10))
        if (num.length === 1)
          return [num[0]]
        return Array.from({ length: num[1] - num[0] + 1 }, (_, i) => i + num[0])
      })

    if (!result[key]) {
      result[key] = []
    }
    result[key].push(...lines)
  })
  return result
}
