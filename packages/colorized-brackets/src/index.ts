import type {
  CodeToTokensOptions,
  ShikiTransformer,
} from 'shiki'
import type { BracketPair, TransformerColorizedBracketsOptions } from './types'
import colorizeBracketTokens from './colorizeBracketTokens'
import splitBracketTokens from './splitBracketTokens'

const jinjaLikeBracketPairs: BracketPair[] = [
  { opener: '[', closer: ']' },
  { opener: '{', closer: '}' },
  { opener: '(', closer: ')' },
  { opener: '{{', closer: '}}' },
  { opener: '{%', closer: '%}' },
]

/**
 * Creates a new bracket colorizer transformer
 *
 * @example basic usage
 * ```ts
 * const html = await shiki.codeToHtml(code, {
 *   lang: 'ts',
 *   theme: 'dark-plus',
 *   transformers: [transformerColorizedBrackets()],
 * });
 * ```
 *
 * @param options
 * @param options.themes - custom themes; all Shiki built-in themes are supported without additional configuration
 * @param options.bracketPairs - bracket definitions; be default [], {}, (), and <> (TS-only)
 * @param options.langs - language-specific overrides for themes and bracketPairs
 * @returns Shiki transformer
 */
export function transformerColorizedBrackets(
  options: Partial<TransformerColorizedBracketsOptions> = {},
): ShikiTransformer {
  const config: TransformerColorizedBracketsOptions = {
    themes: options.themes ?? {},
    bracketPairs: options.bracketPairs ?? [
      { opener: '[', closer: ']' },
      { opener: '{', closer: '}' },
      { opener: '(', closer: ')' },
      {
        opener: '<',
        closer: '>',
        scopesAllowList: [
          'punctuation.definition.typeparameters.begin.ts',
          'punctuation.definition.typeparameters.end.ts',
          'entity.name.type.instance.jsdoc',
        ],
      },
    ],
    langs: {
      html: { bracketPairs: [] },
      jinja: { bracketPairs: jinjaLikeBracketPairs },
      liquid: { bracketPairs: jinjaLikeBracketPairs },
      ...options.langs,
    },
  }
  const transformer: ShikiTransformer = {
    name: 'colorizedBrackets',
    preprocess(code, options) {
      // includeExplanation is a valid option for codeToTokens
      // but is missing from the type definition here
      (options as CodeToTokensOptions).includeExplanation ||= 'scopeName'
    },
    tokens: function transformTokens(tokens) {
      const lang = this.options.lang

      for (let lineIndex = 0; lineIndex < tokens.length; lineIndex++) {
        const line = tokens[lineIndex]
        const newLine = line.flatMap(token =>
          splitBracketTokens(token, config, lang),
        )
        tokens[lineIndex] = newLine
      }

      colorizeBracketTokens(tokens.flat(), config, this.options, lang)
    },
  }
  return transformer
}
