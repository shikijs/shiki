export function normalizeColor(color: undefined): undefined
export function normalizeColor(color: string | string[]): string
export function normalizeColor(color: string | string[] | undefined): string | undefined
export function normalizeColor(color: string | string[] | undefined): string | undefined {
  // Some themes have an array of colors (not yet sure why), here we pick the first one
  // https://github.com/shikijs/shiki/issues/894
  // https://github.com/shikijs/textmate-grammars-themes/pull/117
  if (Array.isArray(color))
    color = color[0]

  if (!color)
    return undefined

  color = (color.charCodeAt(0) === 35 ? color.slice(1) : color).toLowerCase()

  // #RGB => #RRGGBB - Monaco does not support hex color with 3 or 4 digits
  if (color.length === 3 || color.length === 4)
    color = color.split('').map(c => c + c).join('')

  return color
}
