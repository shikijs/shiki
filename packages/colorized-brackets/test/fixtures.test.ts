/* eslint-disable no-console */
import { lstatSync, readdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join, sep } from 'node:path'
import c from 'ansis'
import { createHighlighter } from 'shiki'
import { describe, expect, it } from 'vitest'
import { transformerColorizedBrackets } from '../src'
import {
  parseActualBrackets,
  parseExpectedBrackets,
  prettifyBrackets,
} from './utils'

const SHOULD_LOG = false

/**
 * `tests/samples` contains code snippets that annotate expected colors with `@colors` comments.
 * `Y`, `P`, `B` are for the 3 levels of matched brackets (yellow, purple, blue), and `R` is for mismatched brackets (red).
 * Values before `@colors` indicate the expected color of the bracket on the preceding line.
 * Values after `@colors` are explicitly indexed.
 * For example:
 *
 * ```ts
 * function first<T>(array: T[]) {
 *   //          Y YY        PPY Y @colors
 *   return array[0];
 *   //          P P @colors
 * }
 * // @colors 0=Y
 * ```
 *
 * In the final line, there's not room underneath the `}` to annotate the color, so an explicit index `0=Y` is used after `@colors`.
 */
describe('file-driven tests', async () => {
  const testCaseFiles: [string][] = readdirSync(join(import.meta.dirname, 'fixtures'), {
    recursive: true,
  })
    .filter(
      (fileName): fileName is string =>
        typeof fileName === 'string'
        && lstatSync(join(import.meta.dirname, 'fixtures', fileName)).isFile(),
    )
    .map<[string]>(fileName => [fileName])
  const langs = Array.from(
    new Set(testCaseFiles.map(fileName => fileName[0].split(sep)[0])),
  )
  const highlighter = await createHighlighter({
    langs,
    themes: ['dark-plus'],
  })

  it.each(testCaseFiles)('%s', async (fileName) => {
    const path = join(import.meta.dirname, 'fixtures', fileName)
    const lang = fileName.split(sep).at(0) ?? 'text'
    const content = await readFile(path, { encoding: 'utf-8' })
    const expectedBrackets = parseExpectedBrackets(content)
    const html = highlighter.codeToHtml(content, {
      lang,
      theme: 'dark-plus',
      transformers: [
        transformerColorizedBrackets({
          themes: { 'dark-plus': ['Y', 'P', 'B', 'R'] },
        }),
      ],
    })
    const actualBrackets = parseActualBrackets(html)
    // Logging the colored brackets is much easier to read
    if (SHOULD_LOG) {
      console.log(c.bold(fileName))
      console.log('  Expected:', prettifyBrackets(expectedBrackets))
      console.log('  Actual:  ', prettifyBrackets(actualBrackets))
    }
    expect(prettifyBrackets(actualBrackets, { noAnsi: true })).toEqual(
      prettifyBrackets(expectedBrackets, { noAnsi: true }),
    )
  })
})
