import { getHighlighter } from '../index'

test('renders ansi to html with default theme', async () => {
  const highlighter = await getHighlighter({ theme: 'monokai' })

  const out = highlighter.ansiToHtml(`[0;30;43m WARN [0m using --force I sure hope you know what you are doing
Scope: all 6 workspace projects
Lockfile is up to date, resolution step is skipped
Packages: [0;32m+952[0m
[0;32m++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++[0m
Progress: resolved [0;104m952[0m, reused [0;104m910[0m, downloaded [0;104m42[0m, added [0;104m952[0m, done
Done in 15.7s`)

  expect(out).toMatchSnapshot()
})

test('renders ansi to html with provided theme', async () => {
  const highlighter = await getHighlighter({ themes: ['monokai', 'nord'] })

  const out = highlighter.ansiToHtml(
    `[0;30;43m WARN [0m using --force I sure hope you know what you are doing
Scope: all 6 workspace projects
Lockfile is up to date, resolution step is skipped
Packages: [0;32m+952[0m
[0;32m++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++[0m
Progress: resolved [0;104m952[0m, reused [0;104m910[0m, downloaded [0;104m42[0m, added [0;104m952[0m, done
Done in 15.7s`,
    { theme: 'nord' }
  )

  expect(out).toMatchSnapshot()
})

test('renders ansi to tokens', async () => {
  const highlighter = await getHighlighter({ theme: 'monokai' })

  const out =
    highlighter.ansiToThemedTokens(`[0;30;43m WARN [0m using --force I sure hope you know what you are doing
Scope: all 6 workspace projects
Lockfile is up to date, resolution step is skipped
Packages: [0;32m+952[0m
[0;32m++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++[0m
Progress: resolved [0;104m952[0m, reused [0;104m910[0m, downloaded [0;104m42[0m, added [0;104m952[0m, done
Done in 15.7s`)

  expect(out).toMatchSnapshot()
})
