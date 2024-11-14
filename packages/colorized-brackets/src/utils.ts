import type { ThemedToken } from 'shiki'
import type { TransformerColorizedBracketsOptions } from './types'

export function getEmbeddedLang(token: ThemedToken): string | undefined {
  return token.explanation?.[0].scopes
    .findLast(scope => scope.scopeName.match(/^source.\w+$/))
    ?.scopeName
    .split('.')[1]
}

export function resolveConfig(
  config: TransformerColorizedBracketsOptions,
  lang: string,
): Omit<TransformerColorizedBracketsOptions, 'langs'> {
  return {
    themes: config.langs[lang]?.themes ?? config.themes,
    bracketPairs: config.langs[lang]?.bracketPairs ?? config.bracketPairs,
  }
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#escaping
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function shouldIgnoreToken(
  token: ThemedToken,
  scopesAllowList?: string[],
  scopesDenyList?: string[],
): boolean {
  if (!token.explanation)
    return true

  const commentLastIndex
    = token.explanation?.[0].scopes.findLastIndex(scope =>
      scope.scopeName.startsWith('comment.'),
    ) ?? -1
  const stringLastIndex
    = token.explanation?.[0].scopes.findLastIndex(scope =>
      scope.scopeName.startsWith('string.'),
    ) ?? -1
  const embeddedLastIndex
    = token.explanation?.[0].scopes.findLastIndex(
      scope =>
        scope.scopeName.startsWith('meta.embedded.')
        || scope.scopeName.startsWith('scope.embedded.')
        // jsdoc type declarations
        || scope.scopeName === 'entity.name.type.instance.jsdoc'
        // jsdoc default value declarations
        || scope.scopeName === 'variable.other.jsdoc'
        // liquid template {{ }}
        || scope.scopeName === 'meta.object.liquid',
    ) ?? -1
  // skip all comments and strings (but not if a deeper scope match is meta.embedded eg template expressions)
  if (
    commentLastIndex > embeddedLastIndex
    || stringLastIndex > embeddedLastIndex
  ) {
    return true
  }

  if (
    scopesAllowList
    && scopesAllowList.length
    && !token.explanation?.some(explanation =>
      explanation.scopes.some(scope =>
        scopesAllowList.some(
          allowed =>
            scope.scopeName === allowed
            || scope.scopeName.startsWith(`${allowed}.`),
        ),
      ),
    )
  ) {
    return true
  }

  if (
    scopesDenyList
    && scopesDenyList.length
    && token.explanation?.some(explanation =>
      explanation.scopes.some(scope =>
        scopesDenyList.some(
          denied =>
            scope.scopeName === denied
            || scope.scopeName.startsWith(`${denied}.`),
        ),
      ),
    )
  ) {
    return true
  }

  return false
}
