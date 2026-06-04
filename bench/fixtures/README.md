# Benchmark fixtures

Small representative samples used by the in-repo benchmarks under `bench/*`.
Vendored from [shikijs/textmate-grammars-themes](https://github.com/shikijs/textmate-grammars-themes)
(MIT, © Pine Wu & Anthony Fu) so benches are self-contained — no sibling clone required.

| File | Origin | Lines | Bytes |
|---|---|---|---|
| `ts.sample` | `samples/typescript.sample` | ~80 | ~2.2 KB |
| `tsx.sample` | `samples/tsx.sample` | ~30 | ~0.5 KB |
| `css.sample` | `samples/css.sample` | ~50 | ~0.6 KB |
| `json.sample` | `samples/json.sample` | ~40 | ~0.9 KB |
| `md.sample` | `samples/markdown.sample` | ~170 | ~3.7 KB |

Benches that need "large file" inputs amplify these fixtures by repetition
(`fixture.repeat(N)`) rather than checking in megabytes of code.
