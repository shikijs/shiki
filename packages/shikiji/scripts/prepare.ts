import fs from 'fs-extra'
import { prepareLangs } from './prepare/langs'
import { prepareTheme } from './prepare/themes'

await fs.ensureDir('./src/assets/langs')
await fs.emptyDir('./src/assets/langs')
await prepareLangs()
await prepareTheme()
