import { ShikiError } from '@shikijs/types'

export function resolveLangAlias(name: string, alias?: Record<string, string>): string {
  if (!alias)
    return name
  if (alias[name]) {
    const resolved = new Set<string>([name])
    while (alias[name]) {
      name = alias[name]
      if (resolved.has(name))
        throw new ShikiError(`Circular alias \`${Array.from(resolved).join(' -> ')} -> ${name}\``)
      resolved.add(name)
    }
  }
  return name
}
