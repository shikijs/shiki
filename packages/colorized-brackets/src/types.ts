/**
 * Colorized brackets plugin config
 *
 * @property themes - a record of theme names to bracket CSS colors; the final color is the unexpected bracket color
 * @property bracketPairs - bracket pair definitions
 * @property langs - language-specific configs that are merged with the base config
 * @property explicitTrigger - if true, the transformer only runs for code blocks with the `colorize-brackets` meta string
 */
export interface TransformerColorizedBracketsOptions {
  themes: Record<string, string[]>
  bracketPairs: BracketPair[]
  langs: Record<string, ColorizedBracketsLangConfig>
  explicitTrigger?: boolean
}

/**
 * Language-specific config
 *
 * @property themes - language-specific theme customizations; if not defined, it uses the theme customizations from the base config
 * @property bracketPairs - language-specific bracket pairs; if not defined, it uses the bracket from the base config
 */
export interface ColorizedBracketsLangConfig {
  themes?: Record<string, string[]>
  bracketPairs?: BracketPair[]
}

/**
 * Defines opening and closing brackets, and allowed Textmate scopes
 *
 * @property opener - the string that opens a bracket pair; multi-character strings are not yet supported
 * @property closer - the string that closes a bracket pair; multi-character strings are not yet supported
 * @property scopesAllowList - if defined, brackets will only be colored if at least 1 of their scopes matches a scope from this list
 * @property scopesDenyList - if defined, brackets will not be colored if any of their scopes match a scope from this list
 */
export interface BracketPair {
  opener: string
  closer: string
  scopesAllowList?: string[]
  scopesDenyList?: string[]
}
