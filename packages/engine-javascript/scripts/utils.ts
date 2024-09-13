export function expandRecursiveBackReference(
  regex: string,
  name: string,
  fallback: string,
  recursive = 2,
) {
  const refMarker = new RegExp(`\\\\g<${name}>`, 'g')
  const groupMaker = new RegExp(`\\(\\?<${name}>`, 'g')
  const normalized = regex.replace(groupMaker, '(?:')

  let out = regex
  for (let i = 0; i < recursive; i++) {
    out = out.replace(refMarker, normalized)
  }

  out = out
    .replace(refMarker, fallback)

  return out
}
