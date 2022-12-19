import fsExtra from 'fs-extra'
import { TARGET_WEBSERVER } from './shared.mjs'

export default () => {
  if (fsExtra.existsSync(TARGET_WEBSERVER)) {
    fsExtra.rm(TARGET_WEBSERVER, { force: true, recursive: true })
  }
}
