import fs from 'fs'
import path from 'path'
import { vscodeThemesToRename, vscodeThemesToRemove } from '../themeSources'
import chalk from 'chalk'
import { parseJson } from '../util/parse'

const THEME_FOLDER_PATH = path.join(__dirname, '../..', 'tmp/themes')

/**
 * Remove unneeded themes
 */
let files = fs.readdirSync(THEME_FOLDER_PATH)
for (let f of files) {
  const fName = f.replace(/\.json$/i, '')

  if (vscodeThemesToRemove.includes(fName)) {
    const fPath = path.resolve(THEME_FOLDER_PATH, f)
    fs.unlinkSync(fPath)
    console.log(`${chalk.red('removed')} ${chalk.blue(fPath)}`)
  }
}

/**
 * Rename some themes
 */
files = fs.readdirSync(THEME_FOLDER_PATH)
for (let f of files) {
  const fPath = path.resolve(THEME_FOLDER_PATH, f)
  const fName = f.replace(/\.json$/i, '')
  if (vscodeThemesToRename[fName]) {
    const fNewPath = path.resolve(THEME_FOLDER_PATH, vscodeThemesToRename[fName] + '.json')
    fs.renameSync(fPath, fNewPath)
    console.log(
      `${chalk.red('renamed')} ${chalk.blue(f)} to ${chalk.blue(
        vscodeThemesToRename[fName] + '.json'
      )}`
    )
  }
}

/**
 * - Make sure each theme's file name matches its `name` key
 */
files = fs.readdirSync(THEME_FOLDER_PATH)
for (let f of files) {
  normalizeThemeFile(f)
}

/**
 * - Make sure each theme's file name matches its `name` key
 */
export function normalizeThemeFile(f: string) {
  const fPath = path.resolve(THEME_FOLDER_PATH, f)
  const fNameWithoutSuffix = f.replace(/\.json$/i, '')
  const fName = fNameWithoutSuffix.toLowerCase()

  if (fs.existsSync(fPath)) {
    const parsedContent = parseJson(fs.readFileSync(fPath, 'utf-8'))

    if (!parsedContent.name || parsedContent.name !== fName) {
      parsedContent.name = fName
      fs.writeFileSync(fPath, JSON.stringify(parsedContent, null, 2))
      console.log(`${chalk.red('normalized')} ${f}'s \`name\` to ${chalk.yellow(fName)}`)
    }
  }
}
