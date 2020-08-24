const fs = require('fs')
const path = require('path')

const themeDir = path.resolve(__dirname, '../packages/themes/data')
const themePath = path.resolve(__dirname, '../packages/themes/src/theme.ts')

const files = fs.readdirSync(themeDir)
const themeIds = files.map(f => f.replace('.json', ''))

const themeContent = `export type Theme =
${themeIds.map(id => `  | '${id}'`).join('\n')}

export const themes = [
${themeIds.map(id => `  '${id}'`).join(',\n')}
]
`

fs.writeFileSync(themePath, themeContent)
