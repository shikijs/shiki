import type { JSX } from 'solid-js'

export function normalizeCSSProperties(css?: string | Record<string, string>): JSX.CSSProperties {
  if (typeof css === 'string') {
    const style: Record<string, string> = {}
    css?.split(';').forEach((pair) => {
      const [key, value] = pair.split(':')
      if (key && value)
        style[key.trim()] = value.trim()
    })
    return style as JSX.CSSProperties
  }
  return css as JSX.CSSProperties
}
