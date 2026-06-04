# Benchmarks

Benchmark suites that exercise shiki's hot paths. All suites are run with
`pnpm bench` (see root `package.json` scripts).

## Suites

| Path            | What it measures                                                                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `code-to-hast/` | `codeToHtml`, `codeToHast`, `codeToTokens`, `codeToTokensBase` over representative langs (single theme)                                       |
| `transformers/` | Every transformer in `@shikijs/transformers` + `colorizedBrackets` + the built-in `decorations` transformer, individually and as a full stack |
| `multi-theme/`  | `codeToHtml` and `codeToTokensWithThemes` with 2-theme, 5-theme, and `light-dark()` configurations                                            |
| `explanation/`  | `codeToTokens` with `includeExplanation: false / "scopeName" / true` to characterise the per-token explanation cost                           |
| `large-files/`  | Amplified fixtures (10×, 50×, 100×) up to ~220 KB to surface throughput on real-world large inputs                                            |
| `engines/`      | The original engine matrix (JS / JS-precompiled / WASM). Needs `tm-grammars-themes` as a sibling clone.                                       |
| `bundle-test/`  | The original bundle-size + cold-throughput micro-bench (12-line Vue snippet).                                                                 |

The fixtures in `fixtures/` are vendored from
[shikijs/textmate-grammars-themes](https://github.com/shikijs/textmate-grammars-themes)
(MIT). See `fixtures/README.md` for sizes & attribution.

## Running

```sh
# All bench suites
pnpm bench

# A specific suite
pnpm exec vitest bench --run bench/code-to-hast

# Save a snapshot for later comparison
pnpm exec vitest bench --run --outputJson bench/baselines/my-run.json bench/code-to-hast

# Compare a previous snapshot against the current run
pnpm exec vitest bench --run --compare bench/baselines/before.json bench/code-to-hast
```

## Baselines

`baselines/` holds JSON snapshots that anchor perf work to concrete numbers.
They're machine-specific (CPU, RAM, Node version, OS scheduler all matter) so
treat them as relative baselines for the machine that produced them, not as
absolute targets. Re-generate on your own hardware before drawing conclusions.

When you land a perf change, generate a fresh snapshot next to the existing
ones so reviewers can `--compare` the two.

### `compare.mjs`

Pairs two JSON outputs and emits a markdown delta table:

```sh
node bench/baselines/compare.mjs bench/baselines/before.json bench/baselines/after.json > delta.md
```

Rows whose RME (relative margin of error) > 5 % on either side are flagged as
**noisy** and excluded from the geomean summary — those rows reflect host-OS
scheduler noise (containerised VMs, shared CI runners, busy laptops), not real
algorithmic deltas.

### Noise & methodology caveats

Benchmark hardware matters more than the numbers themselves. On a contended
host you can see 30–60 % drift between two identical back-to-back runs with
no code change at all. Before drawing conclusions:

1. Run on a quiet machine (ideally pinned cores, no other workloads).
2. Stash any pending source edits before capturing the **before** snapshot,
   then pop them and capture the **after** snapshot immediately afterwards —
   back-to-back, same machine, same load.
3. Repeat each side 2–3 times and pick the run with the lowest RMEs.
4. Treat any per-bench delta with RME > 5 % as suggestive, not conclusive.
   Trust the geomean over the clean subset.

`baselines/before-wave-1-3.json` and `baselines/after-wave-1-3.json` were
captured back-to-back on a containerised host. They are kept for traceability;
the noise level on the host made several rows unreliable. Re-run on stable
hardware to validate.
