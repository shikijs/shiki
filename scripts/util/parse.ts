import { parse as jsoncParse, ParseError } from 'jsonc-parser'

export function parseJson(jsonc: string) {
  const errors: ParseError[] = []
  const result = jsoncParse(jsonc, errors, { allowTrailingComma: true })
  if (errors.length) {
    throw errors[0]
  }
  return result
}
