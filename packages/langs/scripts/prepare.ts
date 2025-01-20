import fs from 'fs-extra'
import { prepareLangs } from './langs'

await fs.ensureDir('./dist')
await fs.emptyDir('./dist')
await prepareLangs()
