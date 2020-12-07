const fs = require('fs')
const path = require('path')

const themeDir = path.resolve(__dirname, '../packages/shiki/themes')
const themePath = path.resolve(__dirname, '../packages/shiki/src/themes.ts')
const readmePath = path.resolve(__dirname, '../docs/themes.md')

const files = fs.readdirSync(themeDir)
const themeIds = files.map(f => f.replace('.json', ''))

const themeContent = `export type Theme =
${themeIds.map(id => `  | '${id}'`).join('\n')}

export const themes = [
${themeIds.map(id => `  '${id}'`).join(',\n')}
]
`

fs.writeFileSync(themePath, themeContent)

const readmeReplaceContent = `export type Theme =
${themeIds.map(id => `  | '${id}'`).join('\n')}
`

const readmeSrc = fs.readFileSync(readmePath, 'utf-8')
const newReadmeSrc = readmeSrc.replace(/## Literal Values\n\n```ts([^`]+)```/, (_match, langs) => {
  return '## Literal Values\n\n```ts\n' + readmeReplaceContent + '```'
})

fs.writeFileSync(readmePath, newReadmeSrc)
