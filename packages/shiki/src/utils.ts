export function trimEndSlash(str: string) {
  if (str.endsWith('/') || str.endsWith('\\')) return str.slice(0, -1)
  return str
}

export function trimStartDot(str: string) {
  if (str.startsWith('./')) return str.slice(2)
  return str
}

export function dirname(str: string) {
  const parts = str.split(/[\/\\]/g)
  return parts[parts.length - 2]
}

export function dirpathparts(str: string) {
  const parts = str.split(/[\/\\]/g)
  return parts.slice(0, parts.length - 1)
}

export function join(...parts: string[]) {
  return parts.map(trimEndSlash).map(trimStartDot).join('/')
}

export function groupBy<TElement, TKey>(
  elements: TElement[],
  keyGetter: (element: TElement) => TKey
): Map<TKey, TElement[]> {
  const map = new Map<TKey, TElement[]>()
  for (const element of elements) {
    const key = keyGetter(element)
    if (map.has(key)) {
      const group = map.get(key)
      group.push(element)
    } else {
      map.set(key, [element])
    }
  }
  return map
}
