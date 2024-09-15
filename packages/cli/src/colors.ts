function normalizeHex(hex: string): string {
  hex = hex.replace(/#/, '')
  if (hex.length === 3)
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  if (hex.length === 4)
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
  if (hex.length === 6)
    hex = `${hex}ff`
  return hex.toLowerCase()
}

function hexToRgba(hex: string): { r: number, g: number, b: number, a: number } {
  hex = normalizeHex(hex)
  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)
  const a = Number.parseInt(hex.slice(6, 8), 16) / 255
  return { r, g, b, a }
}

function RgbToHex(r: number, g: number, b: number): string {
  return [r, g, b]
    .map((x) => {
      const hex = x.toString(16)
      return hex.length === 1 ? `0${hex}` : hex
    })
    .join('')
}

export function hexApplyAlpha(hex: string, type: 'dark' | 'light' = 'dark'): string {
  const { r, g, b, a } = hexToRgba(hex)
  if (type === 'dark')
    return RgbToHex(r * a, g * a, b * a)

  else
    return RgbToHex(r * a + 255 * (1 - a), g * a + 255 * (1 - a), b * a + 255 * (1 - a))
}
