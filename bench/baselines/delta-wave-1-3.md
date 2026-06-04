# Bench delta

Generated from `bench/baselines/before-wave-1-3.json` (before) and `bench/baselines/after-wave-1-3.json` (after).

Rows marked **noisy** had RME > 5% on either run; their
absolute deltas are unreliable on noisy hardware. Clean rows are the ones
to trust.

| Bench                                                                                                   | Before (op/s) | After (op/s) |                 Δ | RME before/after |
| ------------------------------------------------------------------------------------------------------- | ------------: | -----------: | ----------------: | ---------------: |
| bench/explanation/explanation.bench.ts > codeToTokens — includeExplanation:true (full) :: css           |           220 |          509 | ⬆ +131.0% (2.31x) |    0.57% / 0.37% |
| bench/explanation/explanation.bench.ts > codeToTokens — includeExplanation:true (full) :: ts            |            58 |          116 |  ⬆ +99.7% (2.00x) |    2.21% / 1.02% |
| bench/explanation/explanation.bench.ts > codeToTokens — includeExplanation:true (full) :: tsx           |           258 |          492 |  ⬆ +90.9% (1.91x) |    1.07% / 0.45% |
| bench/explanation/explanation.bench.ts > codeToTokens — includeExplanation:true (full) :: json          |           141 |          259 |  ⬆ +83.0% (1.83x) |    1.36% / 1.49% |
| bench/explanation/explanation.bench.ts > codeToTokens — includeExplanation:true (full) :: md            |           199 |          353 |  ⬆ +77.3% (1.77x) |    0.86% / 1.20% |
| bench/transformers/transformers.bench.ts > all-transformers stack :: ts                                 |            93 |          137 |  ⬆ +46.7% (1.47x) |    3.85% / 1.88% |
| bench/large-files/large-files.bench.ts > codeToHtml — large MD (10x ~37 KB) :: codeToHtml **(noisy)**   |            69 |          100 |  ⬆ +46.2% (1.46x) |    5.71% / 2.09% |
| bench/transformers/transformers.bench.ts > transformerStyleToClass :: ts                                |           218 |          316 |  ⬆ +44.7% (1.45x) |    2.56% / 1.66% |
| bench/explanation/explanation.bench.ts > codeToTokens — includeExplanation:"scopeName" :: tsx           |           802 |         1090 |  ⬆ +36.0% (1.36x) |    2.60% / 0.50% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToHtml with mergeSameStyleTokens :: json                 |          1839 |         2411 |  ⬆ +31.1% (1.31x) |    3.73% / 2.69% |
| bench/explanation/explanation.bench.ts > codeToTokens — includeExplanation:"scopeName" :: css           |           764 |         1002 |  ⬆ +31.0% (1.31x) |    0.49% / 0.32% |
| bench/transformers/transformers.bench.ts > transformerColorizedBrackets :: ts **(noisy)**               |           114 |          147 |  ⬆ +29.2% (1.29x) |    8.96% / 2.25% |
| bench/explanation/explanation.bench.ts > codeToTokens — includeExplanation:"scopeName" :: json          |          2348 |         3031 |  ⬆ +29.1% (1.29x) |    0.64% / 0.58% |
| bench/large-files/large-files.bench.ts > codeToHtml — large MD (50x ~185 KB) :: codeToHtml              |            16 |           20 |  ⬆ +24.9% (1.25x) |    3.43% / 2.01% |
| bench/explanation/explanation.bench.ts > codeToTokens — includeExplanation:"scopeName" :: md            |           713 |          862 |  ⬆ +20.9% (1.21x) |    0.56% / 0.45% |
| bench/transformers/transformers.bench.ts > transformerDecorations (built-in) :: ts **(noisy)**          |           254 |          304 |  ⬆ +19.8% (1.20x) |    2.48% / 5.09% |
| bench/transformers/transformers.bench.ts > transformerNotationDiff :: ts                                |           226 |          263 |  ⬆ +16.6% (1.17x) |    2.56% / 1.85% |
| bench/transformers/transformers.bench.ts > transformerNotationErrorLevel :: ts                          |           259 |          299 |  ⬆ +15.5% (1.16x) |    2.01% / 1.24% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToTokensBase (engine only) :: css                        |          1896 |         2163 |  ⬆ +14.1% (1.14x) |    0.69% / 0.65% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToTokens (single theme) :: json                          |          5260 |         6000 |  ⬆ +14.1% (1.14x) |    1.36% / 1.72% |
| bench/explanation/explanation.bench.ts > codeToTokens — includeExplanation:false (control) :: json      |          5194 |         5815 |  ⬆ +11.9% (1.12x) |    0.39% / 0.68% |
| bench/explanation/explanation.bench.ts > codeToTokens — includeExplanation:false (control) :: md        |          1484 |         1660 |  ⬆ +11.8% (1.12x) |    0.45% / 0.51% |
| bench/large-files/large-files.bench.ts > codeToHtml — large TS (100x ~220 KB) :: codeToHtml **(noisy)** |             3 |            3 |  ⬆ +11.5% (1.12x) |    9.88% / 2.90% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToTokensBase (engine only) :: tsx                        |          2148 |         2389 |  ⬆ +11.2% (1.11x) |    0.99% / 0.75% |
| bench/large-files/large-files.bench.ts > multi-theme — large TS (10x) :: codeToHtml light+dark          |            15 |           17 |  ⬆ +11.0% (1.11x) |    2.62% / 2.59% |
| bench/multi-theme/multi-theme.bench.ts > codeToHtml — themes (5 themes) :: md                           |           227 |          245 |   ⬆ +8.2% (1.08x) |    3.81% / 1.48% |
| bench/transformers/transformers.bench.ts > transformerCompactLineOptions :: ts                          |           304 |          329 |   ⬆ +8.1% (1.08x) |    1.44% / 1.60% |
| bench/transformers/transformers.bench.ts > transformerRenderWhitespace :: ts                            |           250 |          269 |   ⬆ +7.6% (1.08x) |    2.37% / 2.65% |
| bench/multi-theme/multi-theme.bench.ts > codeToHtml — themes (5 themes) :: tsx                          |           373 |          402 |   ⬆ +7.5% (1.08x) |    1.03% / 0.88% |
| bench/multi-theme/multi-theme.bench.ts > codeToHtml — themes (light-dark()) :: ts                       |           166 |          179 |   ⬆ +7.5% (1.07x) |    1.55% / 1.64% |
| bench/transformers/transformers.bench.ts > transformerMetaHighlight :: ts                               |           300 |          322 |   ⬆ +7.4% (1.07x) |    1.72% / 1.77% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToTokens (single theme) :: md                            |          1471 |         1570 |   ⬆ +6.7% (1.07x) |    1.04% / 3.01% |
| bench/multi-theme/multi-theme.bench.ts > codeToHtml — themes (light+dark) :: json                       |          1228 |         1309 |   ⬆ +6.6% (1.07x) |    2.63% / 2.59% |
| bench/multi-theme/multi-theme.bench.ts > codeToHtml — themes (light-dark()) :: json                     |          1136 |         1207 |   ⬆ +6.3% (1.06x) |    3.11% / 3.01% |
| bench/multi-theme/multi-theme.bench.ts > codeToHtml — themes (5 themes) :: css                          |           317 |          337 |   ⬆ +6.3% (1.06x) |    1.26% / 1.60% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToHtml with mergeSameStyleTokens :: css                  |          1226 |         1283 |   · +4.6% (1.05x) |    2.78% / 1.93% |
| bench/multi-theme/multi-theme.bench.ts > codeToHtml — themes (light+dark) :: ts                         |           152 |          159 |   · +4.5% (1.05x) |    1.95% / 2.06% |
| bench/multi-theme/multi-theme.bench.ts > codeToHtml — themes (5 themes) :: ts                           |            70 |           73 |   · +4.5% (1.04x) |    1.67% / 1.12% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToTokensBase (engine only) :: json                       |          3899 |         4071 |   · +4.4% (1.04x) |    4.50% / 2.37% |
| bench/multi-theme/multi-theme.bench.ts > codeToHtml — themes (light-dark()) :: tsx                      |           844 |          880 |   · +4.3% (1.04x) |    1.48% / 1.51% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToTokensBase (engine only) :: ts                         |           393 |          409 |   · +4.1% (1.04x) |    0.77% / 1.67% |
| bench/transformers/transformers.bench.ts > transformerNotationFocus :: ts                               |           269 |          277 |   · +3.0% (1.03x) |    1.40% / 1.52% |
| bench/multi-theme/multi-theme.bench.ts > codeToHtml — themes (light-dark()) :: css                      |           705 |          724 |   · +2.6% (1.03x) |    1.68% / 1.67% |
| bench/multi-theme/multi-theme.bench.ts > codeToHtml — themes (5 themes) :: json                         |           649 |          663 |   · +2.1% (1.02x) |    1.88% / 2.02% |
| bench/multi-theme/multi-theme.bench.ts > codeToTokensWithThemes :: tsx                                  |          1034 |         1052 |   · +1.7% (1.02x) |    0.46% / 0.51% |
| bench/multi-theme/multi-theme.bench.ts > codeToHtml — themes (light+dark) :: css                        |           676 |          678 |   · +0.4% (1.00x) |    2.61% / 1.76% |
| bench/multi-theme/multi-theme.bench.ts > codeToTokensWithThemes :: css                                  |           937 |          934 |   · -0.3% (1.00x) |    0.47% / 0.39% |
| bench/multi-theme/multi-theme.bench.ts > codeToHtml — themes (light+dark) :: md                         |           487 |          484 |   · -0.8% (0.99x) |    2.60% / 2.31% |
| bench/multi-theme/multi-theme.bench.ts > codeToTokensWithThemes :: ts                                   |           198 |          193 |   · -2.5% (0.97x) |    0.57% / 0.76% |
| bench/explanation/explanation.bench.ts > codeToTokens — includeExplanation:false (control) :: css       |          1692 |         1646 |   · -2.7% (0.97x) |    0.50% / 0.86% |
| bench/explanation/explanation.bench.ts > codeToTokens — includeExplanation:"scopeName" :: ts            |           201 |          193 |   · -4.1% (0.96x) |    0.87% / 1.79% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToHtml with mergeSameStyleTokens :: md                   |           874 |          832 |   · -4.8% (0.95x) |    2.43% / 3.47% |
| bench/transformers/transformers.bench.ts > transformerNotationHighlight :: ts                           |           245 |          231 |   ⬇ -5.8% (0.94x) |    2.26% / 3.64% |
| bench/explanation/explanation.bench.ts > codeToTokens — includeExplanation:false (control) :: tsx       |          2048 |         1922 |   ⬇ -6.1% (0.94x) |    0.42% / 1.49% |
| bench/large-files/large-files.bench.ts > codeToHtml — large TS (50x ~110 KB) :: codeToHtml **(noisy)**  |             7 |            6 |   ⬇ -6.8% (0.93x) |   2.46% / 10.36% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToHtml (single theme) :: ts                              |           389 |          361 |   ⬇ -7.3% (0.93x) |    1.45% / 1.48% |
| bench/multi-theme/multi-theme.bench.ts > codeToHtml — themes (light-dark()) :: md                       |           499 |          457 |   ⬇ -8.3% (0.92x) |    2.71% / 2.29% |
| bench/explanation/explanation.bench.ts > codeToTokens — includeExplanation:false (control) :: ts        |           369 |          336 |   ⬇ -9.1% (0.91x) |    0.64% / 1.17% |
| bench/multi-theme/multi-theme.bench.ts > codeToHtml — themes (light+dark) :: tsx                        |           834 |          755 |   ⬇ -9.5% (0.91x) |    1.69% / 1.89% |
| bench/large-files/large-files.bench.ts > codeToHtml — large TS (10x ~22 KB) :: codeToTokensBase         |            42 |           37 |  ⬇ -12.2% (0.88x) |    1.30% / 1.98% |
| bench/multi-theme/multi-theme.bench.ts > codeToTokensWithThemes :: json                                 |          2447 |         2067 |  ⬇ -15.5% (0.84x) |    0.67% / 1.38% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToHtml with mergeSameStyleTokens :: tsx                  |          1708 |         1368 |  ⬇ -19.9% (0.80x) |    2.05% / 2.19% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToHtml (single theme) :: tsx                             |          1962 |         1553 |  ⬇ -20.8% (0.79x) |    1.86% / 2.04% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToTokens (single theme) :: css                           |          1927 |         1525 |  ⬇ -20.9% (0.79x) |    0.81% / 3.55% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToTokensBase (engine only) :: md                         |          1457 |         1140 |  ⬇ -21.7% (0.78x) |    1.28% / 1.05% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToHtml with mergeSameStyleTokens :: ts                   |           312 |          240 |  ⬇ -23.1% (0.77x) |    2.02% / 2.50% |
| bench/large-files/large-files.bench.ts > codeToHtml — large TS (10x ~22 KB) :: codeToTokens **(noisy)** |            40 |           31 |  ⬇ -24.2% (0.76x) |    0.97% / 5.51% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToHtml (single theme) :: css                             |          1600 |         1175 |  ⬇ -26.5% (0.73x) |    2.32% / 1.96% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToHtml (single theme) :: json                            |          2787 |         2041 |  ⬇ -26.8% (0.73x) |    3.05% / 2.60% |
| bench/multi-theme/multi-theme.bench.ts > codeToTokensWithThemes :: md                                   |           769 |          562 |  ⬇ -26.9% (0.73x) |    0.56% / 2.31% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToHast (single theme) :: tsx                             |          2290 |         1450 |  ⬇ -36.7% (0.63x) |    2.78% / 2.24% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToHtml (single theme) :: md                              |          1167 |          728 |  ⬇ -37.6% (0.62x) |    2.24% / 2.20% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToHast (single theme) :: ts                              |           465 |          281 |  ⬇ -39.6% (0.60x) |    1.85% / 2.25% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToTokens (single theme) :: tsx                           |          2169 |         1250 |  ⬇ -42.3% (0.58x) |    2.83% / 3.45% |
| bench/large-files/large-files.bench.ts > codeToHtml — large TS (10x ~22 KB) :: codeToHtml **(noisy)**   |            32 |           16 |  ⬇ -49.2% (0.51x) |    1.87% / 9.12% |
| bench/large-files/large-files.bench.ts > codeToHtml — large TS (10x ~22 KB) :: codeToHast **(noisy)**   |            37 |           19 |  ⬇ -49.9% (0.50x) |    2.09% / 7.38% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToTokens (single theme) :: ts **(noisy)**                |           476 |          118 |  ⬇ -75.3% (0.25x) |   1.02% / 11.24% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToHast (single theme) :: css **(noisy)**                 |          2039 |          455 |  ⬇ -77.7% (0.22x) |   3.15% / 26.17% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToHast (single theme) :: json **(noisy)**                |          4507 |          147 |  ⬇ -96.7% (0.03x) |  5.61% / 120.10% |
| bench/code-to-hast/code-to-hast.bench.ts > codeToHast (single theme) :: md **(noisy)**                  |          1653 |           37 |  ⬇ -97.7% (0.02x) |   3.03% / 68.90% |

**Clean rows (RME ≤ 5% on both runs):** 68 of 80.
**Clean improvements (>1%):** 41.
**Clean regressions (<-1%):** 24.
**Geomean speedup on clean rows:** 1.039x.
