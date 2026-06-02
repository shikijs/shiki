export function normalizeCSSProperties(css?: string | Record<string, string>): React.CSSProperties {
  if (typeof css === 'string') {
    const style: Record<string, string> = {}
    css?.split(';').forEach((pair) => {
      const [key, value] = pair.split(':')
      if (key && value)
        style[key.trim()] = value.trim()
    })
    return style as React.CSSProperties
  }
  return css as React.CSSProperties
}
