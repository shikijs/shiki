import type { TwoslashTypesCache } from './types'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import process from 'node:process'

export interface FileSystemTypeResultCacheOptions {
  /**
   * The directory to store the cache files.
   *
   * @default '.vitepress/cache/twoslash'
   */
  dir?: string
}

export function createFileSystemTypesCache(options: FileSystemTypeResultCacheOptions = {}): TwoslashTypesCache {
  const dir = resolve(process.cwd(), options.dir ?? '.vitepress/cache/twoslash')

  return {
    init() {
      mkdirSync(dir, { recursive: true })
    },
    read(code) {
      const hash = createHash('SHA256').update(code).digest('hex').slice(0, 12)
      const filePath = join(dir, `${hash}.json`)
      if (!existsSync(filePath)) {
        return null
      }
      return JSON.parse(readFileSync(filePath, { encoding: 'utf-8' }))
    },
    write(code, data) {
      const hash = createHash('SHA256').update(code).digest('hex').slice(0, 12)
      const filePath = join(dir, `${hash}.json`)
      const json = JSON.stringify(data)
      writeFileSync(filePath, json, { encoding: 'utf-8' })
    },
  }
}
