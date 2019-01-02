export type TVSCode =
  | 'abyss'
  | 'dark_vs'
  | 'light_vs'
  | 'hc_black'
  | 'dark_plus'
  | 'light_plus'
  | 'kimbie_dark'
  | 'monokai'
  | 'monokai_dimmed'
  | 'quietlight'
  | 'red'
  | 'solarized_dark'
  | 'solarized_light'

export type TMaterial =
  | 'Material-Theme-Darker-High-Contrast'
  | 'Material-Theme-Darker'
  | 'Material-Theme-Default-High-Contrast'
  | 'Material-Theme-Default'
  | 'Material-Theme-Lighter-High-Contrast'
  | 'Material-Theme-Lighter'
  | 'Material-Theme-Ocean-High-Contrast'
  | 'Material-Theme-Ocean'
  | 'Material-Theme-Palenight-High-Contrast'
  | 'Material-Theme-Palenight'

export type TNice =
  | 'nord'
  | 'min-light'
  | 'min-dark'
  | 'white'
  | 'white-night'
  | 'zeit'

export type TTheme = TVSCode | TMaterial | TNice