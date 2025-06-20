import type { FontStyle, IRawThemeSetting, StateStack } from '@shikijs/vscode-textmate'
import type { SpecialLanguage } from './langs'
import type { CodeOptionsThemes } from './options'
import type { SpecialTheme, ThemeRegistrationAny } from './themes'

/**
 * GrammarState is a special reference object that holds the state of a grammar.
 *
 * It's used to highlight code snippets that are part of the target language.
 */
export interface GrammarState {
  readonly lang: string
  readonly theme: string
  readonly themes: string[]
  /**
   * @internal
   */
  getInternalStack: (theme?: string) => StateStack | undefined
  getScopes: (theme?: string) => string[] | undefined
}

export interface CodeToTokensBaseOptions<Languages extends string = string, Themes extends string = string> extends TokenizeWithThemeOptions {
  lang?: Languages | SpecialLanguage
  theme?: Themes | ThemeRegistrationAny | SpecialTheme
}

export type CodeToTokensOptions<Languages extends string = string, Themes extends string = string> = Omit<CodeToTokensBaseOptions<Languages, Themes>, 'theme'>
  & CodeOptionsThemes<Themes>

export interface CodeToTokensWithThemesOptions<Languages = string, Themes = string> extends TokenizeWithThemeOptions {
  lang?: Languages | SpecialLanguage

  /**
   * A map of color names to themes.
   *
   * `light` and `dark` are required, and arbitrary color names can be added.
   *
   * @example
   * ```ts
   * themes: {
   *   light: 'vitesse-light',
   *   dark: 'vitesse-dark',
   *   soft: 'nord',
   *   // custom colors
   * }
   * ```
   */
  themes: Partial<Record<string, Themes | ThemeRegistrationAny | SpecialTheme>>
}

export interface ThemedTokenScopeExplanation {
  scopeName: string
  themeMatches?: IRawThemeSetting[]
}

export interface ThemedTokenExplanation {
  content: string
  scopes: ThemedTokenScopeExplanation[]
}

/**
 * A single token with color, and optionally with explanation.
 *
 * For example:
 *
 * ```json
 * {
 *   "content": "shiki",
 *   "color": "#D8DEE9",
 *   "explanation": [
 *     {
 *       "content": "shiki",
 *       "scopes": [
 *         {
 *           "scopeName": "source.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "meta.objectliteral.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "meta.object.member.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "meta.array.literal.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "variable.other.object.js",
 *           "themeMatches": [
 *             {
 *               "name": "Variable",
 *               "scope": "variable.other",
 *               "settings": {
 *                 "foreground": "#D8DEE9"
 *               }
 *             },
 *             {
 *               "name": "[JavaScript] Variable Other Object",
 *               "scope": "source.js variable.other.object",
 *               "settings": {
 *                 "foreground": "#D8DEE9"
 *               }
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 * ```
 */
export interface ThemedToken extends TokenStyles, TokenBase {}

export interface TokenBase {
  /**
   * The content of the token
   */
  content: string
  /**
   * The start offset of the token, relative to the input code. 0-indexed.
   */
  offset: number
  /**
   * Explanation of
   *
   * - token text's matching scopes
   * - reason that token text is given a color (one matching scope matches a rule (scope -> color) in the theme)
   */
  explanation?: ThemedTokenExplanation[]
}

export interface TokenStyles {
  /**
   * 6 or 8 digit hex code representation of the token's color
   */
  color?: string
  /**
   * 6 or 8 digit hex code representation of the token's background color
   */
  bgColor?: string
  /**
   * Font style of token. Can be None/Italic/Bold/Underline
   */
  fontStyle?: FontStyle
  /**
   * Override with custom inline style for HTML renderer.
   * When specified, `color` and `fontStyle` will be ignored.
   * Prefer use object style for merging with other styles.
   */
  htmlStyle?: Record<string, string>
  /**
   * Extra HTML attributes for the token.
   */
  htmlAttrs?: Record<string, string>
}

export interface ThemedTokenWithVariants extends TokenBase {
  /**
   * An object of color name to token styles
   */
  variants: Record<string, TokenStyles>
}

export interface TokenizeWithThemeOptions {
  /**
   * Include explanation of why a token is given a color.
   *
   * You can optionally pass `scopeName` to only include explanation for scopes,
   * which is more performant than full explanation.
   *
   * @default false
   */
  includeExplanation?: boolean | 'scopeName'

  /**
   * A map of color names to new color values.
   *
   * The color key starts with '#' and should be lowercased.
   *
   * This will be merged with theme's `colorReplacements` if any.
   */
  colorReplacements?: Record<string, string | Record<string, string>>

  /**
   * Lines above this length will not be tokenized for performance reasons.
   *
   * @default 0 (no limit)
   */
  tokenizeMaxLineLength?: number

  /**
   * Time limit in milliseconds for tokenizing a single line.
   *
   * @default 500 (0.5s)
   */
  tokenizeTimeLimit?: number

  /**
   * Represent the state of the grammar, allowing to continue tokenizing from a intermediate grammar state.
   *
   * You can get the grammar state from `getLastGrammarState`.
   */
  grammarState?: GrammarState

  /**
   * The code context of the grammar.
   * Consider it a prepended code to the input code, that only participate the grammar inference but not presented in the final output.
   *
   * This will be ignored if `grammarState` is provided.
   */
  grammarContextCode?: string
}

/**
 * Result of `codeToTokens`, an object with 2D array of tokens and meta info like background and foreground color.
 */
export interface TokensResult {
  /**
   * 2D array of tokens, first dimension is lines, second dimension is tokens in a line.
   */
  tokens: ThemedToken[][]

  /**
   * Foreground color of the code.
   */
  fg?: string

  /**
   * Background color of the code.
   */
  bg?: string

  /**
   * A string representation of themes applied to the token.
   */
  themeName?: string

  /**
   * Custom style string to be applied to the root `<pre>` element.
   * When specified, `fg` and `bg` will be ignored.
   */
  rootStyle?: string

  /**
   * The last grammar state of the code snippet.
   */
  grammarState?: GrammarState
}
