export function trimEndSlash(str: string) {
  if (str.endsWith('/') || str.endsWith('\\')) return str.slice(0, -1)
  return str
}

export function dirname(str: string) {
  const parts = str.split(/[\/\\]/g)
  return parts[parts.length - 2]
}

export function join(...parts: string[]) {
  return parts.map(trimEndSlash).join('/')
}
