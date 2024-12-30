import fs from 'fs-extra'
import { prepareTheme } from './themes'

await fs.ensureDir('./dist')
await fs.emptyDir('./dist')
await prepareTheme()
