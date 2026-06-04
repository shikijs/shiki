import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki'
import fs from 'node:fs/promises'
import { createHighlighter, createOnigurumaEngine } from 'shiki'

export type Fixture = 'ts' | 'tsx' | 'css' | 'json' | 'md'

export const FIXTURE_LANG: Record<Fixture, BundledLanguage> = {
  ts: 'typescript',
  tsx: 'tsx',
  css: 'css',
  json: 'json',
  md: 'markdown',
}

export const ALL_FIXTURES: Fixture[] = ['ts', 'tsx', 'css', 'json', 'md']

export async function loadFixture(name: Fixture): Promise<string> {
  return fs.readFile(
    new URL(`../fixtures/${name}.sample`, import.meta.url),
    'utf-8',
  )
}

export async function loadAllFixtures(): Promise<Record<Fixture, string>> {
  const entries = await Promise.all(
    ALL_FIXTURES.map(async f => [f, await loadFixture(f)] as const),
  )
  return Object.fromEntries(entries) as Record<Fixture, string>
}

/** Amplify a sample by repetition to simulate a "large file". */
export function amplify(source: string, times: number): string {
  return source.repeat(times)
}

export type BenchHighlighter = HighlighterGeneric<BundledLanguage, BundledTheme>

/** A pre-warmed highlighter with the requested langs + the two themes most benches use. */
export async function createBenchHighlighter(
  langs: BundledLanguage[] = ['typescript', 'tsx', 'css', 'json', 'markdown'],
  themes: BundledTheme[] = ['vitesse-dark', 'vitesse-light'],
): Promise<BenchHighlighter> {
  return createHighlighter({
    langs,
    themes,
    engine: await createOnigurumaEngine(() => import('shiki/wasm')),
  })
}
