import type { ThemeRegistration } from 'shikiji-core'

export interface CssVariablesThemeOptions {
  /**
   * Theme name. Need to unique if multiple css variables themes are created
   *
   * @default 'css-variables'
   */
  name?: string

  /**
   * Prefix for css variables
   *
   * @default '--shiki-'
   */
  variablePrefix?: string

  /**
   * Default value for css variables, the key is without the prefix
   *
   * @example `{ 'token-comment': '#888' }` will generate `var(--shiki-token-comment, #888)` for comments
   */
  variableDefaults?: Record<string, string>

  /**
   * Enable font style
   *
   * @default true
   */
  fontStyle?: boolean
}

/**
 * A factory function to create a css-variable-based theme
 *
 * @experimental This API is experimental and may change without following semver
 * @see https://shikiji.netlify.app/guide/theme-colors#css-variables-theme
 */
export function createCssVariablesTheme(options: CssVariablesThemeOptions = {}): ThemeRegistration {
  const {
    name = 'css-variables',
    variablePrefix = '--shiki-',
    fontStyle = true,
  } = options

  const variable = (name: string) => {
    if (options.variableDefaults?.[name])
      return `var(${variablePrefix}${name}, ${options.variableDefaults[name]})`
    return `var(${variablePrefix}${name})`
  }

  const theme: ThemeRegistration = {
    name,
    type: 'dark',
    colors: {
      'editor.foreground': variable('foreground'),
      'editor.background': variable('background'),
      'terminal.ansiBlack': variable('ansi-black'),
      'terminal.ansiRed': variable('ansi-red'),
      'terminal.ansiGreen': variable('ansi-green'),
      'terminal.ansiYellow': variable('ansi-yellow'),
      'terminal.ansiBlue': variable('ansi-blue'),
      'terminal.ansiMagenta': variable('ansi-magenta'),
      'terminal.ansiCyan': variable('ansi-cyan'),
      'terminal.ansiWhite': variable('ansi-white'),
      'terminal.ansiBrightBlack': variable('ansi-bright-black'),
      'terminal.ansiBrightRed': variable('ansi-bright-red'),
      'terminal.ansiBrightGreen': variable('ansi-bright-green'),
      'terminal.ansiBrightYellow': variable('ansi-bright-yellow'),
      'terminal.ansiBrightBlue': variable('ansi-bright-blue'),
      'terminal.ansiBrightMagenta': variable('ansi-bright-magenta'),
      'terminal.ansiBrightCyan': variable('ansi-bright-cyan'),
      'terminal.ansiBrightWhite': variable('ansi-bright-white'),
    },
    tokenColors: [
      {
        scope: [
          'keyword.operator.accessor',
          'meta.group.braces.round.function.arguments',
          'meta.template.expression',
          'markup.fenced_code meta.embedded.block',
        ],
        settings: {
          foreground: variable('foreground'),
        },
      },
      {
        scope: 'emphasis',
        settings: {
          fontStyle: 'italic',
        },
      },
      {
        scope: ['strong', 'markup.heading.markdown', 'markup.bold.markdown'],
        settings: {
          fontStyle: 'bold',
        },
      },
      {
        scope: ['markup.italic.markdown'],
        settings: {
          fontStyle: 'italic',
        },
      },
      {
        scope: 'meta.link.inline.markdown',
        settings: {
          fontStyle: 'underline',
          foreground: variable('token-link'),
        },
      },
      {
        scope: ['string', 'markup.fenced_code', 'markup.inline'],
        settings: {
          foreground: variable('token-string'),
        },
      },
      {
        scope: ['comment', 'string.quoted.docstring.multi'],
        settings: {
          foreground: variable('token-comment'),
        },
      },
      {
        scope: [
          'constant.numeric',
          'constant.language',
          'constant.other.placeholder',
          'constant.character.format.placeholder',
          'variable.language.this',
          'variable.other.object',
          'variable.other.class',
          'variable.other.constant',
          'meta.property-name',
          'meta.property-value',
          'support',
        ],
        settings: {
          foreground: variable('token-constant'),
        },
      },
      {
        scope: [
          'keyword',
          'storage.modifier',
          'storage.type',
          'storage.control.clojure',
          'entity.name.function.clojure',
          'entity.name.tag.yaml',
          'support.function.node',
          'support.type.property-name.json',
          'punctuation.separator.key-value',
          'punctuation.definition.template-expression',
        ],
        settings: {
          foreground: variable('token-keyword'),
        },
      },
      {
        scope: 'variable.parameter.function',
        settings: {
          foreground: variable('token-parameter'),
        },
      },
      {
        scope: [
          'support.function',
          'entity.name.type',
          'entity.other.inherited-class',
          'meta.function-call',
          'meta.instance.constructor',
          'entity.other.attribute-name',
          'entity.name.function',
          'constant.keyword.clojure',
        ],
        settings: {
          foreground: variable('token-function'),
        },
      },
      {
        scope: [
          'entity.name.tag',
          'string.quoted',
          'string.regexp',
          'string.interpolated',
          'string.template',
          'string.unquoted.plain.out.yaml',
          'keyword.other.template',
        ],
        settings: {
          foreground: variable('token-string-expression'),
        },
      },
      {
        scope: [
          'punctuation.definition.arguments',
          'punctuation.definition.dict',
          'punctuation.separator',
          'meta.function-call.arguments',
        ],
        settings: {
          foreground: variable('token-punctuation'),
        },
      },
      {
        // [Custom] Markdown links
        scope: [
          'markup.underline.link',
          'punctuation.definition.metadata.markdown',
        ],
        settings: {
          foreground: variable('token-link'),
        },
      },
      {
        // [Custom] Markdown list
        scope: ['beginning.punctuation.definition.list.markdown'],
        settings: {
          foreground: variable('token-string'),
        },
      },
      {
        // [Custom] Markdown punctuation definition brackets
        scope: [
          'punctuation.definition.string.begin.markdown',
          'punctuation.definition.string.end.markdown',
          'string.other.link.title.markdown',
          'string.other.link.description.markdown',
        ],
        settings: {
          foreground: variable('token-keyword'),
        },
      },
    ],
  }

  if (!fontStyle) {
    theme.tokenColors = theme.tokenColors?.map((tokenColor) => {
      if (tokenColor.settings?.fontStyle)
        // @ts-expect-error force delete readonly property
        delete tokenColor.settings.fontStyle
      return tokenColor
    })
  }

  return theme
}
