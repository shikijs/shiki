import { describe, expect, it, vi } from 'vitest'
import { shikiToMonaco } from '../src/index'

describe('shikiToMonaco', () => {
  it('updates color map when theme changes', async () => {
    const highlighter = {
      getLoadedThemes: () => ['theme1', 'theme2'],
      getTheme: (id: string) => {
        if (id === 'theme1') {
          return {
            type: 'dark',
            colors: { 'editor.foreground': '#000000' },
            rules: [
              { token: 'keyword', foreground: '#000000' },
            ],
          }
        }
        else { // id === 'theme2'
          return {
            type: 'light',
            colors: {},
            rules: [{ token: 'string', foreground: '#000000' }],
          }
        }
      },
      setTheme: (id: string) => {
        if (id === 'theme1') {
          return { colorMap: ['#000000', '#ff0000'] }
        }
        else {
          // theme2 has sparse color map at index 0
          const map = [] as string[]
          map[1] = '#ffffff' // index 0 is empty
          return { colorMap: map }
        }
      },
      getLoadedLanguages: () => ['javascript'],
      getLanguage: (_lang: string) => ({
        tokenizeLine2: (line: string, stack: any) => {
          return {
            tokens: new Uint32Array([
              0, // startIndex
              0, // metadata: color index 0 (all 0s)
            ]),
            ruleStack: stack,
          }
        },
      }),
    } as any

    const monaco = {
      editor: {
        defineTheme: vi.fn(),
        setTheme: vi.fn(),
        create: vi.fn(),
      },
      languages: {
        register: vi.fn(),
        getLanguages: () => [{ id: 'javascript' }],
        setTokensProvider: vi.fn(),
      },
    } as any

    shikiToMonaco(highlighter, monaco)

    // Initial theme should be set (first one)
    // monaco.editor.setTheme is replaced by shikiToMonaco, so we can't check it as a spy directly
    // expect(monaco.editor.setTheme).toHaveBeenCalledWith('vitesse-dark')

    // Capture the tokens provider
    const setTokensProviderCall = monaco.languages.setTokensProvider.mock.calls[0]
    const tokensProvider = setTokensProviderCall[1]

    // Tokenize a simple string
    const state = tokensProvider.getInitialState()
    const code = 'const a = 1'

    // Tokenize with first theme
    const result1 = tokensProvider.tokenize(code, state)
    const scopes1 = result1.tokens.map((t: any) => t.scopes)

    // Switch theme
    monaco.editor.setTheme('theme2')

    // Tokenize with second theme
    const result2 = tokensProvider.tokenize(code, state)
    const scopes2 = result2.tokens.map((t: any) => t.scopes)

    // The scopes should be correct for the second theme.
    // Since we don't know the exact scopes, we can check if they are consistent with what we expect
    // or at least different if the themes are very different (though scopes might be same if they map to same textmate scopes).
    // But `shikiToMonaco` resolves scopes based on colors.
    // If `vitesse-dark` and `vitesse-light` have different colors for the same token,
    // `shikiToMonaco` might generate different scopes (because it generates scopes like `token.color-hex`).
    // Wait, looking at `index.ts`:
    // `const scope = color ? (findScopeByColorAndStyle(color, fontStyle) || '') : ''`
    // And `findScopeByColorAndStyle` looks up in `colorStyleToScopeMap`.
    // `colorStyleToScopeMap` maps `color|fontStyle` -> `rule.token`.
    // `rule.token` is the TextMate scope (e.g. `keyword.control`).

    // So if both themes map `keyword` to some color, `scopes` should be `keyword`.
    // The issue is that it renders "incorrect color".
    // Monaco renders color based on the scope.
    // If `shikiToMonaco` returns the correct scope (e.g. `keyword`), Monaco will look up that scope in the theme's rules and apply the color.
    // Since `monaco.editor.setTheme` also calls `_setTheme` (the original monaco one), Monaco should have the correct theme loaded.

    // So if `scopes` are correct, the color should be correct.
    // Unless `scopes` are WRONG.
    // Why would `scopes` be wrong?
    // If `colorMap` has wrong colors, `normalizeColor(colorMap[colorIdx])` returns wrong color.
    // Then `findScopeByColorAndStyle` looks up wrong color.
    // If that wrong color exists in `colorStyleToScopeMap` (which is updated for the new theme), it might find a scope that happens to have that color, or find nothing.
    // If it finds nothing, scope is empty string.

    // So if the bug exists, `scopes2` might be empty or wrong.

    // We expect scopes to be non-empty for keywords.
    // 'const' is a keyword.
    expect(scopes1[0]).not.toBe('')
    expect(scopes2[0]).toBe('') // Should be empty because theme2 has no color at index 0

    // Also, if the bug is that it uses the OLD color map:
    // `colorIdx` from `tokenizeLine2` refers to the NEW theme's color map (presumably).
    // If `colorMap` (the array) still has OLD colors, then `colorMap[colorIdx]` gives a color from the OLD theme at that index.
    // But `colorStyleToScopeMap` is updated to the NEW theme.
    // So we look up an OLD color in the NEW theme's map.
    // Likely we won't find it, so scope becomes empty.

    // So the failure mode is likely empty scopes or incorrect scopes.
  })
})
