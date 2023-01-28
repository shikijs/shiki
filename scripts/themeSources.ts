/**
 * All themes in vscode are copied over, with some transformations
 */

/**
 * Remove these themes bundled in vscode
 */
export const vscodeThemesToRemove = [
  // Included in dark_plus
  'dark_vs',
  'dark_plus_experimental',
  // Included in light_plus
  'light_vs',
  'light_plus_experimental',
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
 * Key is the extension's identifier, as can be found in the extension's marketplace URL.
 * For example, for https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode,
 * the identifier is `astro-build.astro-vscode`
 *
 * Value is a list of themes names, as can be found by F1 -> Preferences: Color Theme
 */
export const marketplaceThemeSources: Record<string, string[]> = {
  'equinusocio.vsc-material-theme': [
    'Material Theme',
    'Material Theme Darker',
    'Material Theme Lighter',
    'Material Theme Ocean',
    'Material Theme Palenight'
  ],
  'dracula-theme.theme-dracula': ['Dracula', 'Dracula Soft'],
  'GitHub.github-vscode-theme': ['GitHub Dark', 'GitHub Light', 'GitHub Dark Dimmed'],
  'antfu.theme-vitesse': ['Vitesse Dark', 'Vitesse Light'],
  'zhuangtongfa.material-theme': ['One Dark Pro']
}
