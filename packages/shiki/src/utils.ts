export function trimEndSlash(str: string) {
  if (str.endsWith('/') || str.endsWith('\\')) return str.slice(0, -1)
  return str
}

export function dirname(str: string) {
  return trimEndSlash(str).split(/\/|\\/g).slice(-1)[0]
}

export function join(...parts: string[]) {
  return parts.map(trimEndSlash).join('/')
}
