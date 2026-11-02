import type {
  CodeToTokensWithThemesOptions,
  ShikiPrimitive,
  ThemedToken,
  ThemeRegistrationAny,
} from '@shikijs/types'
import type { FontStyle, IToken, StateStack, StateStackImpl } from '@shikijs/vscode-textmate'
import { EncodedTokenMetadata, INITIAL } from '@shikijs/vscode-textmate'
import { getGrammarStack, GrammarState } from '../textmate/grammar-state'
import { applyColorReplacements, isNoneTheme, isPlainLang, resolveColorReplacements, splitLines } from '../utils'

/**
 * The parts of vscode-textmate's `Grammar` we need. They exist on every grammar at runtime,
 * but `IGrammar` does not expose them.
 */
interface GrammarInternals {
  name: string
  _tokenTypeMatchers: unknown[]
  _basicScopeAttributesProvider: { getDefaultAttributes: () => { languageId: number } }
  balancedBracketSelectors: { matchesAlways: boolean, matchesNever: boolean, match: (scopes: string[]) => boolean } | null
  getMetadataForScope: (scope: string) => { languageId: number, tokenType: number }
  themeProvider: {
    getDefaults: () => { fontStyle: number, foregroundId: number, backgroundId: number }
    themeMatch: (scopePath: any) => { fontStyle: number, foregroundId: number, backgroundId: number } | null
  }
  tokenizeLine: (line: string, prevState: StateStack, timeLimit?: number) => { tokens: IToken[], ruleStack: StateStack }
}

/**
 * A node of the scope trie. `parent` and `scopeName` make it usable as the scope path
 * that `Theme.match()` reads.
 */
interface ScopeNode {
  parent: ScopeNode | null
  scopeName: string
  children?: Map<string, ScopeNode>
  /** Token attributes of this scope path, per theme index */
  attributes: number[]
}

const NOT_SET_TOKEN_TYPE = 8
const MAX_LINE_LENGTH = 500
const MAX_STACK_DEPTH = 200
const MAX_SCOPE_NODES = 10_000
const MAX_SCOPES_PER_CHAR = 16

/**
 * Tokenize `code` for several themes with a single grammar scan.
 *
 * Scanning does not depend on the theme, only the attributes of each scope do. So we scan once
 * with `tokenizeLine`, which keeps the scope names of each token, and compute the attributes of
 * each scope path per theme the same way vscode-textmate's `AttributedScopeStack` does while
 * scanning. Adjacent tokens with equal attributes are merged, as `tokenizeLine2` does. The result
 * equals calling `tokenizeWithTheme` once per theme.
 *
 * Returns `undefined` when the per-theme path must be used instead.
 */
export function tokenizeWithThemes(
  primitive: ShikiPrimitive,
  code: string,
  themes: (ThemeRegistrationAny | string)[],
  options: CodeToTokensWithThemesOptions,
): { tokens: ThemedToken[][], state: GrammarState }[] | undefined {
  const lang = primitive.resolveLangAlias(options.lang || 'text')
  if (isPlainLang(lang) || lang === 'ansi' || themes.some(t => isNoneTheme(t)) || options.includeExplanation)
    return

  // Same order as `codeToTokensBase`, so the same error is thrown first
  const firstTheme = primitive.setTheme(themes[0]).theme
  const grammar = primitive.getLanguage(options.lang || 'text') as unknown as GrammarInternals
  // Token type overrides are not set by Shiki; keep the per-theme path if a grammar has them.
  if (grammar._tokenTypeMatchers.length > 0)
    return

  if (options.grammarState) {
    // Let the per-theme path throw its usual errors
    if (options.grammarState.lang !== grammar.name || !themes.every(t => options.grammarState!.themes.includes(primitive.getTheme(t).name)))
      return
  }

  const {
    tokenizeMaxLineLength = 0,
    tokenizeTimeLimit = 500,
  } = options

  // Each token keeps its scope path as a node of this trie, shared by all themes
  const roots = new Map<string, ScopeNode>()
  let nodeCount = 0
  const childOf = (parent: ScopeNode | null, scopeName: string): ScopeNode => {
    const siblings = parent ? (parent.children ??= new Map()) : roots
    let node = siblings.get(scopeName)
    if (!node) {
      node = { parent, scopeName, attributes: [] }
      siblings.set(scopeName, node)
      nodeCount += 1
    }
    return node
  }
  const brackets = grammar.balancedBracketSelectors
  const matchBrackets = !!brackets && !brackets.matchesAlways && !brackets.matchesNever

  // `tokenizeLine` returns the full scope list of every token, so its cost grows with tokens
  // times nesting depth. Keep the per-theme path for long lines, deep stacks, and inputs with
  // many scopes per character (real code has about 3) or many distinct scope paths (real code
  // has a few hundred).
  const skipLine = (line: string): boolean => line === '' || (tokenizeMaxLineLength > 0 && line.length >= tokenizeMaxLineLength)
  const lines = splitLines(code)
  const contextLines = options.grammarState || options.grammarContextCode == null
    ? []
    : splitLines(options.grammarContextCode)
  const isLong = ([line]: [string, number]): boolean => !skipLine(line) && line.length > MAX_LINE_LENGTH
  if (lines.some(isLong) || contextLines.some(isLong))
    return

  let scopeBudget = MAX_SCOPE_NODES + MAX_SCOPES_PER_CHAR * (code.length + (contextLines.length ? options.grammarContextCode!.length : 0))
  const scan = (lines: [string, number][], stack: StateStack): { tokens: (ScannedToken[] | undefined)[], stack: StateStack } | undefined => {
    const tokens: (ScannedToken[] | undefined)[] = []
    for (const [line] of lines) {
      if (skipLine(line)) {
        tokens.push(undefined)
        continue
      }
      if (stack.depth > MAX_STACK_DEPTH || nodeCount > MAX_SCOPE_NODES || scopeBudget < 0)
        return
      const result = grammar.tokenizeLine(line, stack, tokenizeTimeLimit)
      tokens.push(result.tokens.map((token) => {
        scopeBudget -= token.scopes.length
        let node: ScopeNode | null = null
        for (const scopeName of token.scopes)
          node = childOf(node, scopeName)
        return {
          startIndex: token.startIndex,
          node,
          brackets: matchBrackets && brackets!.match(token.scopes),
        }
      }))
      stack = result.ruleStack
    }
    return { tokens, stack }
  }

  // Scan with the first theme active, as its attributes end up in the returned stack
  const initialStack = options.grammarState
    ? getGrammarStack(options.grammarState, firstTheme.name) ?? INITIAL
    : options.grammarContextCode != null
      ? scan(contextLines, INITIAL)?.stack
      : INITIAL
  if (!initialStack)
    return
  const result = scan(lines, initialStack)
  if (!result)
    return
  const { tokens: scanned, stack } = result

  return themes.map((themeInput, themeIndex) => {
    const { theme, colorMap } = primitive.setTheme(themeInput)
    const colorReplacements = resolveColorReplacements(theme, options)
    const provider = grammar.themeProvider
    const defaults = provider.getDefaults()
    const rootAttributes = EncodedTokenMetadata.set(
      0,
      grammar._basicScopeAttributesProvider.getDefaultAttributes().languageId,
      NOT_SET_TOKEN_TYPE,
      null,
      defaults.fontStyle,
      defaults.foregroundId,
      defaults.backgroundId,
    )

    // Same as `AttributedScopeStack.createRootAndLookUpScopeName()` and `_pushAttributed()`
    const attributesOf = (node: ScopeNode | null): number => {
      const pending: ScopeNode[] = []
      while (node && node.attributes[themeIndex] === undefined) {
        pending.push(node)
        node = node.parent
      }
      let attributes = node ? node.attributes[themeIndex] : rootAttributes
      for (let i = pending.length - 1; i >= 0; i--) {
        const basic = grammar.getMetadataForScope(pending[i].scopeName)
        const style = provider.themeMatch(pending[i])
        attributes = EncodedTokenMetadata.set(
          attributes,
          basic.languageId,
          basic.tokenType,
          null,
          style ? style.fontStyle : -1,
          style ? style.foregroundId : 0,
          style ? style.backgroundId : 0,
        )
        pending[i].attributes[themeIndex] = attributes
      }
      return attributes
    }

    const final: ThemedToken[][] = []
    for (let i = 0; i < lines.length; i++) {
      const [line, lineOffset] = lines[i]
      const lineTokens = scanned[i]
      if (!lineTokens) {
        final.push(line === ''
          ? []
          : [{ content: line, offset: lineOffset, color: '', fontStyle: 0 }])
        continue
      }

      const actual: ThemedToken[] = []
      let start = -1
      let metadata = 0
      const push = (end: number): void => {
        if (start === end)
          return
        actual.push({
          content: line.substring(start, end),
          offset: lineOffset + start,
          color: applyColorReplacements(colorMap[EncodedTokenMetadata.getForeground(metadata)], colorReplacements),
          fontStyle: EncodedTokenMetadata.getFontStyle(metadata) as FontStyle,
        })
      }
      // Same as the binary branch of vscode-textmate's `LineTokens.produceFromScopes()`
      for (let j = 0; j < lineTokens.length; j++) {
        let next = attributesOf(lineTokens[j].node)
        if (brackets?.matchesAlways || lineTokens[j].brackets)
          next = EncodedTokenMetadata.set(next, 0, NOT_SET_TOKEN_TYPE, true, -1, 0, 0)
        if (start !== -1 && next === metadata)
          continue
        if (start !== -1)
          push(lineTokens[j].startIndex)
        start = lineTokens[j].startIndex
        metadata = next
      }
      push(line.length)
      final.push(actual)
    }

    const themeStack = themeIndex === 0
      ? stack
      : restack(stack as StateStackImpl, childOf, attributesOf)
    return {
      tokens: final,
      state: new GrammarState(themeStack, grammar.name, theme.name),
    }
  })
}

/**
 * Rebuild a stack with the attributes of another theme. The rules and scope names stay the same.
 */
function restack(
  stack: StateStackImpl,
  childOf: (parent: ScopeNode | null, scopeName: string) => ScopeNode,
  attributesOf: (node: ScopeNode | null) => number,
): StateStackImpl {
  // Nothing was tokenized; `INITIAL` is recognized by identity, keep it
  if (stack === INITIAL)
    return stack
  const frames: StateStackImpl[] = []
  for (let s: StateStackImpl | null = stack; s; s = s.parent)
    frames.push(s)

  // `StateStackImpl` is only exported as a type, reach the class through an instance
  const StateStack = stack.constructor as typeof StateStackImpl
  let result: StateStackImpl | null = null
  let parentNode: ScopeNode | null = null
  for (let i = frames.length - 1; i >= 0; i--) {
    const frame = frames[i].toStateStackFrame()
    let node: ScopeNode | null = parentNode
    for (const item of frame.nameScopesList) {
      for (const scopeName of item.scopeNames)
        node = childOf(node, scopeName)
      item.encodedTokenAttributes = attributesOf(node)
    }
    parentNode = node
    for (const item of frame.contentNameScopesList) {
      for (const scopeName of item.scopeNames)
        node = childOf(node, scopeName)
      item.encodedTokenAttributes = attributesOf(node)
    }
    result = StateStack.pushFrame(result, frame)
  }
  return result!
}

interface ScannedToken {
  startIndex: number
  node: ScopeNode | null
  brackets: boolean
}
