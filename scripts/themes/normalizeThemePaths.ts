import fs from 'fs'
import path from 'path'
import json5 from 'json5'
import kebabCase from 'lodash.kebabcase'
import { vscodeThemesToRename, vscodeThemesToRemove } from '../themeSources'

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
    console.log(`removed ${fPath}`)
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
    console.log(`renamed ${f} to ${vscodeThemesToRename[fName]}.json`)
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
    const parsedContent = json5.parse(fs.readFileSync(fPath, 'utf-8'))

    if (!parsedContent.name || parsedContent.name !== fName) {
      parsedContent.name = fName
      fs.writeFileSync(fPath, JSON.stringify(parsedContent, null, 2))
      console.log(`normalized ${f}'s \`name\` as ${fName}`)
    }
  }
}
