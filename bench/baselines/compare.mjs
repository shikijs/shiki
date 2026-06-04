#!/usr/bin/env node
/* eslint-disable no-console */
// Compares two vitest bench JSON outputs and produces a markdown delta table.
//
// Usage:
//   node bench/baselines/compare.mjs <before.json> <after.json> > delta.md
//
// Flags any row with RME (relative margin of error) > 5% as `noisy` — those
// numbers are unreliable on noisy hardware (containerised VMs, busy laptops,
// shared CI runners). The summary computes the geomean over *clean* rows only.

import { readFileSync } from 'node:fs'
import process from 'node:process'

const NOISE_THRESHOLD_PCT = 5

const [, , beforePath, afterPath] = process.argv
if (!beforePath || !afterPath) {
  console.error('Usage: compare.mjs <before.json> <after.json>')
  process.exit(2)
}

const before = JSON.parse(readFileSync(beforePath, 'utf-8'))
const after = JSON.parse(readFileSync(afterPath, 'utf-8'))

/**
 * @param {{ files: { groups: { fullName: string, benchmarks: { name: string, hz: number, mean: number, rme: number }[] }[] }[] }} report
 * @returns {Map<string, { hz: number, mean: number, rme: number }>} flat map of fullName::name → stats
 */
function flatten(report) {
  const out = new Map()
  for (const file of report.files) {
    for (const group of file.groups) {
      for (const b of group.benchmarks) {
        const key = `${group.fullName} :: ${b.name}`
        out.set(key, { hz: b.hz, mean: b.mean, rme: b.rme })
      }
    }
  }
  return out
}

const a = flatten(before)
const b = flatten(after)

const rows = []
for (const [key, beforeStats] of a) {
  const afterStats = b.get(key)
  if (!afterStats)
    continue
  const speedup = afterStats.hz / beforeStats.hz
  const noisy = beforeStats.rme > NOISE_THRESHOLD_PCT || afterStats.rme > NOISE_THRESHOLD_PCT
  rows.push({ key, before: beforeStats, after: afterStats, speedup, noisy })
}

rows.sort((x, y) => y.speedup - x.speedup)

console.log('# Bench delta\n')
console.log(`Generated from \`${beforePath}\` (before) and \`${afterPath}\` (after).\n`)
console.log(`Rows marked **noisy** had RME > ${NOISE_THRESHOLD_PCT}% on either run; their `)
console.log('absolute deltas are unreliable on noisy hardware. Clean rows are the ones')
console.log('to trust.\n')
console.log('| Bench | Before (op/s) | After (op/s) | Δ | RME before/after |')
console.log('|---|---:|---:|---:|---:|')

let cleanLogSpeedupSum = 0
let cleanCount = 0
let cleanRegressed = 0
let cleanImproved = 0
for (const r of rows) {
  const pct = ((r.speedup - 1) * 100)
  const sign = pct >= 0 ? '+' : ''
  const arrow = pct > 5 ? '⬆' : pct < -5 ? '⬇' : '·'
  const tag = r.noisy ? ' **(noisy)**' : ''
  if (!r.noisy) {
    cleanLogSpeedupSum += Math.log(r.speedup)
    cleanCount += 1
    if (pct > 1)
      cleanImproved += 1
    else if (pct < -1)
      cleanRegressed += 1
  }
  console.log(`| ${r.key.replaceAll('|', '\\|')}${tag} | ${r.before.hz.toFixed(0)} | ${r.after.hz.toFixed(0)} | ${arrow} ${sign}${pct.toFixed(1)}% (${r.speedup.toFixed(2)}x) | ${r.before.rme.toFixed(2)}% / ${r.after.rme.toFixed(2)}% |`)
}

const geomean = cleanCount > 0 ? Math.exp(cleanLogSpeedupSum / cleanCount) : 0
console.log()
console.log(`**Clean rows (RME ≤ ${NOISE_THRESHOLD_PCT}% on both runs):** ${cleanCount} of ${rows.length}.`)
console.log(`**Clean improvements (>1%):** ${cleanImproved}.`)
console.log(`**Clean regressions (<-1%):** ${cleanRegressed}.`)
console.log(`**Geomean speedup on clean rows:** ${geomean.toFixed(3)}x.`)
