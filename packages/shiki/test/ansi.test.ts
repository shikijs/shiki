/* eslint-disable no-irregular-whitespace */
import { expect, it } from 'vitest'
import {
  codeToHtml,
  codeToTokens,
} from '../src'

it('renders ansi to html', async () => {
  const out = await codeToHtml(`[0;30;43m WARN [0m using --force I sure hope you know what you are doing
Scope: all 6 workspace projects
Lockfile is up to date, resolution step is skipped
Packages: [0;32m+952[0m
[0;32m++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++[0m
Progress: resolved [0;104m952[0m, reused [0;104m910[0m, downloaded [0;104m42[0m, added [0;104m952[0m, done
Done in 15.7s`, { theme: 'monokai', lang: 'ansi' })

  await expect(out).toMatchFileSnapshot('./out/ansi.html')
})

// https://github.com/shikijs/shiki/issues/432
it('renders ansi with background', async () => {
  const code = `
[0;32;1m❯[0m [0;32mpnpm[0m install --force[0m
[0;30;43m WARN [0m using --force I sure hope you know what you are doing[0m
Scope: all 6 workspace projects[0m
Lockfile is up to date, resolution step is skipped[0m
Packages: [0;32m+1038[0m[0m
[0;32m++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++[0m
`.trim()

  const out = await codeToHtml(code, { theme: 'monokai', lang: 'ansi' })

  await expect(out).toMatchFileSnapshot('./out/ansi-background.html')
})

// https://github.com/shikijs/shiki/issues/597
it('renders ansi to html with theme dark-plus', async () => {
  const out = await codeToHtml(`[0;30;43m WARN [0m using --force I sure hope you know what you are doing
Scope: all 6 workspace projects
Lockfile is up to date, resolution step is skipped
Packages: [0;32m+952[0m
[0;32m++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++[0m
Progress: resolved [0;104m952[0m, reused [0;104m910[0m, downloaded [0;104m42[0m, added [0;104m952[0m, done
Done in 15.7s`, { theme: 'dark-plus', lang: 'ansi' })

  await expect(out).toMatchFileSnapshot('./out/ansi-dark-plus.html')
})

// https://github.com/shikijs/shiki/issues/1257
it('renders ansi with multiple themes', async () => {
  const out = await codeToHtml('\x1B[32mhello\x1B[0m', {
    lang: 'ansi',
    themes: { light: 'github-light', dark: 'github-dark' },
  })

  await expect(out).toMatchFileSnapshot('./out/ansi-multi-themes.html')
})

// https://github.com/shikijs/shiki/issues/1350
it('ignores non-SGR escape sequences', async () => {
  const tokenize = async (code: string) =>
    (await codeToTokens(code, { lang: 'ansi', theme: 'github-dark' })).tokens

  // CSI sequences other than SGR: erase line, cursor movement, cursor visibility, and private `m` forms
  expect(await tokenize('\x1B[2Kcompiling main.js'))
    .toEqual(await tokenize('compiling main.js'))
  expect(await tokenize('\x1B[1G\x1B[32mok\x1B[0m done'))
    .toEqual(await tokenize('\x1B[32mok\x1B[0m done'))
  expect(await tokenize('\x1B[?25lworking\x1B[?25h'))
    .toEqual(await tokenize('working'))
  expect(await tokenize('\x1B[>4;2mplain \x1B[?1;2mtext'))
    .toEqual(await tokenize('plain text'))

  // Control strings terminated by BEL or ST: OSC hyperlinks, DCS, APC
  expect(await tokenize('\x1B]8;;https://example.com\x07docs\x1B]8;;\x07 \x1B[31merror\x1B[0m'))
    .toEqual(await tokenize('docs \x1B[31merror\x1B[0m'))
  expect(await tokenize('\x1B]8;;https://example.com\x1B\\docs\x1B]8;;\x1B\\ \x1B[31merror\x1B[0m'))
    .toEqual(await tokenize('docs \x1B[31merror\x1B[0m'))
  expect(await tokenize('\x1BP1$r0m\x1B\\a\x1B_Gi=1\x1B\\b'))
    .toEqual(await tokenize('ab'))

  // Other escape sequences, e.g. the charset selection `tput sgr0` emits before its SGR reset
  expect(await tokenize('\x1B[1mbold\x1B(B\x1B[0m plain \x1B7saved\x1B8'))
    .toEqual(await tokenize('\x1B[1mbold\x1B[0m plain saved'))
})
