import fs from 'fs-extra'
import { prepareLangs } from './prepare/langs'
import { prepareTheme } from './prepare/themes'

await fs.ensureDir('./src/langs')
await fs.emptyDir('./src/langs')
await fs.ensureDir('./src/themes')
await fs.emptyDir('./src/themes')
await prepareLangs()
await prepareTheme()
