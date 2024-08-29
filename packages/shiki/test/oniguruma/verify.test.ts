import { fileURLToPath } from 'node:url'
import { basename } from 'node:path'
import { promises as fs } from 'node:fs'
import { describe, expect, it } from 'vitest'
import fg from 'fast-glob'
import type { Instance } from './types'
import { JavaScriptOnigScanner } from './scanner-js'

const files = await fg('*.json', {
  cwd: fileURLToPath(new URL('./__records__', import.meta.url)),
  absolute: true,
  onlyFiles: true,
})

for (const file of files) {
  describe(`record: ${basename(file, '.json')}`, async () => {
    const instances = JSON.parse(await fs.readFile(file, 'utf-8')) as Instance[]
    let i = 0
    for (const instance of instances) {
      describe(`instances ${i++}`, () => {
        const scanner = new JavaScriptOnigScanner(instance.constractor[0], false)
        let j = 0
        for (const execution of instance.executions) {
          it(`case ${j++}`, () => {
            // onTestFailed(() => {
            //   console.log({
            //     patterns: scanner.patterns,
            //     regexps: scanner.regexps,
            //   })
            // })
            const result = scanner.findNextMatchSync(...execution.args)
            expect(result).toEqual(execution.result)
          })
        }
      })
    }
  })
}
