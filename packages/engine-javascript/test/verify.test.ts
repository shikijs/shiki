import type { Execution } from './types'
import { promises as fs } from 'node:fs'
import { basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import { describe, expect, it, onTestFailed } from 'vitest'
import { JavaScriptScanner } from '../src'
import { defaultJavaScriptRegexConstructor } from '../src/engine-compile'

describe('verify', async () => {
  const files = await fg('*.wasm.json', {
    cwd: fileURLToPath(new URL('./__records__', import.meta.url)),
    absolute: true,
    onlyFiles: true,
  })

  const cache = new Map<string, RegExp | Error>()

  for (const file of files) {
    // Some token positions are off in this record
    const name = basename(file, '.wasm.json')

    describe(`record: ${name}`, async () => {
      const executions = JSON.parse(await fs.readFile(file, 'utf-8')) as Execution[]
      let i = 0

      it('', () => {})

      for (const execution of executions) {
        i += 1

        it(`case ${i}`, () => {
          const scanner = new JavaScriptScanner(execution.patterns, {
            cache,
            regexConstructor: pattern => defaultJavaScriptRegexConstructor(pattern),
          })

          onTestFailed(() => {
            console.error(execution.result?.index != null
              ? {
                  args: execution.args,
                  expected: {
                    pattern: scanner.patterns[execution.result.index],
                    regexp: scanner.regexps[execution.result.index],
                  },
                }
              : {
                  args: execution.args,
                  patterns: scanner.patterns,
                  regexps: scanner.regexps,
                })
          })
          const result = scanner.findNextMatchSync(...execution.args)
          expect(result).toEqual(execution.result)
        })
      }
    })
  }
})
