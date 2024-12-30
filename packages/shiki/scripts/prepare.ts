import { languageNames } from '@shikijs/langs'
import { themeNames } from '@shikijs/themes'
import fs from 'fs-extra'

await fs.ensureDir('./src/langs')
await fs.emptyDir('./src/langs')
await fs.ensureDir('./src/themes')
await fs.emptyDir('./src/themes')

for (const lang of languageNames) {
  await fs.writeFile(
    `./src/langs/${lang}.mjs`,
    `export { default } from '@shikijs/langs/${lang}'\n`,
    'utf-8',
  )
  await fs.writeFile(
    `./src/langs/${lang}.d.mts`,
    `export { default } from '@shikijs/langs/${lang}'\n`,
    'utf-8',
  )
}

for (const theme of themeNames) {
  await fs.writeFile(
    `./src/themes/${theme}.mjs`,
    `export { default } from '@shikijs/themes/${theme}'\n`,
    'utf-8',
  )
  await fs.writeFile(
    `./src/themes/${theme}.d.mts`,
    `export { default } from '@shikijs/themes/${theme}'\n`,
    'utf-8',
  )
}
