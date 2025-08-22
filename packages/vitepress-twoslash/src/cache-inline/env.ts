import process from 'node:process'

export function isEnabledEnv(key: string): boolean | null {
  const val = process.env?.[key]?.toLowerCase()
  if (val) {
    return {
      true: true,
      false: false,
      1: true,
      0: false,
      yes: true,
      no: false,
      y: true,
      n: false,
    }[val] || null
  }
  return null
}
