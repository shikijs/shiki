export function parseHighlightLines(attrs: string) {
  if (!attrs)
    return null
  const match = attrs.match(/{([\d,-]+)}/)
  if (!match)
    return null
  const lines = match[1].split(',')
    .flatMap((v) => {
      const num = v.split('-').map(v => Number.parseInt(v, 10))
      if (num.length === 1)
        return [num[0]]
      else
        return Array.from({ length: num[1] - num[0] + 1 }, (_, i) => i + num[0])
    })

  return lines
}
