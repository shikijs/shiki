/* eslint-disable no-irregular-whitespace */
import { expect, it } from 'vitest'
import {
  codeToHtml,
} from '../src'

it('renders ansi to html', async () => {
  const out = await codeToHtml(`[0;30;43m WARN [0m using --force I sure hope you know what you are doing
Scope: all 6 workspace projects
Lockfile is up to date, resolution step is skipped
Packages: [0;32m+952[0m
[0;32m++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++[0m
Progress: resolved [0;104m952[0m, reused [0;104m910[0m, downloaded [0;104m42[0m, added [0;104m952[0m, done
Done in 15.7s`, { theme: 'monokai', lang: 'ansi' })

  expect(out).toMatchFileSnapshot('./out/ansi.html')
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

  expect(out).toMatchFileSnapshot('./out/ansi-background.html')
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

  expect(out).toMatchFileSnapshot('./out/ansi-dark-plus.html')
})
