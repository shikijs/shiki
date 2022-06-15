/**
 * All themes in vscode are copied over, with some transformations
 */

/**
 * Remove these themes bundled in vscode
 */
export const vscodeThemesToRemove = [
  // Included in dark_plus
  'dark_vs',
  // Included in light_plus
  'light_vs',
  'Red-color-theme',
  'dimmed-monokai-color-theme',
  'kimbie-dark-color-theme',
  'quietlight-color-theme',
  'abyss-color-theme',
  'hc_black',
  'tomorrow-night-blue-color-theme'
]

/**
 * Rename these themes bundled in vscode
 */
export const vscodeThemesToRename = {
  dark_plus: 'dark-plus',
  light_plus: 'light-plus',
  'monokai-color-theme': 'monokai',
  'solarized-dark-color-theme': 'solarized-dark',
  'solarized-light-color-theme': 'solarized-light'
}

/**
 * All theme sources on github.com.
 *
 * To add one:
 * - Insert `[name, url]` to the list sorted by `name`
 * - Run `pnpm update:themes`, examine the changes
 */
export const githubThemeSources: [string, string][] = [
  [
    'nord',
    'https://github.com/arcticicestudio/nord-visual-studio-code/blob/develop/themes/nord-color-theme.json'
  ],
  ['min-light', 'https://github.com/misolori/min-theme/blob/master/themes/min-light.json'],
  ['min-dark', 'https://github.com/misolori/min-theme/blob/master/themes/min-dark.json'],
  [
    'slack-ochin',
    'https://github.com/slack-theme/visual-studio-code/blob/master/themes/ochin.json'
  ],
  [
    'slack-dark',
    'https://github.com/slack-theme/visual-studio-code/blob/master/themes/dark-mode.json'
  ],
  [
    'poimandres',
    'https://github.com/drcmda/poimandres-theme/blob/main/themes/poimandres-color-theme.json'
  ],
  ['rose-pine', 'https://github.com/rose-pine/vscode/blob/main/themes/rose-pine-color-theme.json'],
  [
    'rose-pine-dawn',
    'https://github.com/rose-pine/vscode/blob/main/themes/rose-pine-dawn-color-theme.json'
  ],
  [
    'rose-pine-moon',
    'https://github.com/rose-pine/vscode/blob/main/themes/rose-pine-moon-color-theme.json'
  ]
]

/**
 * Themes from VS Code marketplace
 * Some themes have compilation step and do not include the built theme on GitHub,
 * so pull from VS Code marketplace instead.
 *
 * Key is publisher + extId
 * Value is a list. Each item represents a file to extract from the downloaded VSIX.
 * If given a single path `extension/foo/bar.json`, extract `bar.json` to `tmp/themes/bar.json`
 * If given ['baz.json', `extension/foo/bar.json`], extract `bar.json` to `tmp/themes/baz.json`
 */
export const marketplaceThemeSources: { [extPublisherAndId: string]: [string, string][] } = {
  'equinusocio.vsc-material-theme': [
    ['material-darker.json', 'extension/build/themes/Material-Theme-Darker.json'],
    ['material-default.json', 'extension/build/themes/Material-Theme-Default.json'],
    ['material-lighter.json', 'extension/build/themes/Material-Theme-Lighter.json'],
    ['material-ocean.json', 'extension/build/themes/Material-Theme-Ocean.json'],
    ['material-palenight.json', 'extension/build/themes/Material-Theme-Palenight.json']
  ],
  'dracula-theme.theme-dracula': [
    ['dracula.json', 'extension/theme/dracula.json'],
    ['dracula-soft.json', 'extension/theme/dracula-soft.json']
  ],
  'GitHub.github-vscode-theme': [
    ['github-dark-dimmed.json', 'extension/themes/dark-dimmed.json'],
    ['github-dark.json', 'extension/themes/dark-default.json'],
    ['github-light.json', 'extension/themes/light-default.json']
  ],
  'antfu.theme-vitesse': [
    ['vitesse-dark.json', 'extension/themes/vitesse-dark.json'],
    ['vitesse-light.json', 'extension/themes/vitesse-light.json']
  ],
  'zhuangtongfa.material-theme': [['one-dark-pro.json', 'extension/themes/OneDark-Pro.json']]
}
