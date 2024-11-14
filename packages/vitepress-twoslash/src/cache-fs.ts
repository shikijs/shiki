import type { TypeResultCache } from '.'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path/posix'

export function createFileSystemTypeResultCache(options: {
  dir: string
}): TypeResultCache {
  return {
    init() {
      try {
        mkdirSync(options.dir)
      }
      catch { } // Dir has already existed
    },
    read(code) {
      const hash = createHash('SHA256').update(code).digest('hex')
      const filePath = join(options.dir, `${hash}.json`)
      if (!existsSync(filePath)) {
        return null
      }
      return JSON.parse(readFileSync(filePath, { encoding: 'utf-8' }))
    },
    write(code, data) {
      const hash = createHash('SHA256').update(code).digest('hex')
      const filePath = join(options.dir, `${hash}.json`)
      const json = JSON.stringify(data)

      writeFileSync(filePath, json, { encoding: 'utf-8' })
    },

  }
}
