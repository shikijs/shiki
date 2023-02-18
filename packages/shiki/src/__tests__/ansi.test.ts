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

test('renders ansi to html with css-variables theme', async () => {
  const highlighter = await getHighlighter({
    theme: 'css-variables'
  })

  const allAnsiStyles = `
[30mblack[0m
[30;2mblack (dim)[0m
[31mred[0m
[31;2mred (dim)[0m
[32mgreen[0m
[32;2mgreen (dim)[0m
[33myellow[0m
[33;2myellow (dim)[0m
[34mblue[0m
[34;2mblue (dim)[0m
[35mmagenta[0m
[35;2mmagenta (dim)[0m
[36mcyan[0m
[36;2mcyan (dim)[0m
[37mwhite[0m
[37;2mwhite (dim)[0m
[90mbrightBlack[0m
[90;2mbrightBlack (dim)[0m
[91mbrightRed[0m
[91;2mbrightRed (dim)[0m
[92mbrightGreen[0m
[92;2mbrightGreen (dim)[0m
[93mbrightYellow[0m
[93;2mbrightYellow (dim)[0m
[94mbrightBlue[0m
[94;2mbrightBlue (dim)[0m
[95mbrightMagenta[0m
[95;2mbrightMagenta (dim)[0m
[96mbrightCyan[0m
[96;2mbrightCyan (dim)[0m
[97mbrightWhite[0m
[97;2mbrightWhite (dim)[0m
[1mbold[0m
[3mitalic[0m
[3munderline[0m
[9mstrikethrough[0m
`

  const out = highlighter.ansiToHtml(allAnsiStyles)

  expect(out).toMatchSnapshot()
})
