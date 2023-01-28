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
  expect(out).toMatchInlineSnapshot(`
    "<pre class=\\"shiki monokai\\" style=\\"background-color: #272822\\"><code><span class=\\"line\\"><span style=\\"color: #F8F8F2\\"></span><span style=\\"color: #333333\\"> WARN </span><span style=\\"color: #F8F8F2\\"> using --force I sure hope you know what you are doing</span></span>
    <span class=\\"line\\"><span style=\\"color: #F8F8F2\\">Scope: all 6 workspace projects</span></span>
    <span class=\\"line\\"><span style=\\"color: #F8F8F2\\">Lockfile is up to date, resolution step is skipped</span></span>
    <span class=\\"line\\"><span style=\\"color: #F8F8F2\\">Packages: </span><span style=\\"color: #86B42B\\">+952</span><span style=\\"color: #F8F8F2\\"></span></span>
    <span class=\\"line\\"><span style=\\"color: #F8F8F2\\"></span><span style=\\"color: #86B42B\\">++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++</span><span style=\\"color: #F8F8F2\\"></span></span>
    <span class=\\"line\\"><span style=\\"color: #F8F8F2\\">Progress: resolved </span><span style=\\"color: #F8F8F2\\">952</span><span style=\\"color: #F8F8F2\\">, reused </span><span style=\\"color: #F8F8F2\\">910</span><span style=\\"color: #F8F8F2\\">, downloaded </span><span style=\\"color: #F8F8F2\\">42</span><span style=\\"color: #F8F8F2\\">, added </span><span style=\\"color: #F8F8F2\\">952</span><span style=\\"color: #F8F8F2\\">, done</span></span></code></pre>"
  `)
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
  expect(out).toMatchInlineSnapshot(`
    "<pre class=\\"shiki nord\\" style=\\"background-color: #2e3440ff\\"><code><span class=\\"line\\"><span style=\\"color: #d8dee9ff\\"></span><span style=\\"color: #3b4252\\"> WARN </span><span style=\\"color: #d8dee9ff\\"> using --force I sure hope you know what you are doing</span></span>
    <span class=\\"line\\"><span style=\\"color: #d8dee9ff\\">Scope: all 6 workspace projects</span></span>
    <span class=\\"line\\"><span style=\\"color: #d8dee9ff\\">Lockfile is up to date, resolution step is skipped</span></span>
    <span class=\\"line\\"><span style=\\"color: #d8dee9ff\\">Packages: </span><span style=\\"color: #a3be8c\\">+952</span><span style=\\"color: #d8dee9ff\\"></span></span>
    <span class=\\"line\\"><span style=\\"color: #d8dee9ff\\"></span><span style=\\"color: #a3be8c\\">++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++</span><span style=\\"color: #d8dee9ff\\"></span></span>
    <span class=\\"line\\"><span style=\\"color: #d8dee9ff\\">Progress: resolved </span><span style=\\"color: #d8dee9ff\\">952</span><span style=\\"color: #d8dee9ff\\">, reused </span><span style=\\"color: #d8dee9ff\\">910</span><span style=\\"color: #d8dee9ff\\">, downloaded </span><span style=\\"color: #d8dee9ff\\">42</span><span style=\\"color: #d8dee9ff\\">, added </span><span style=\\"color: #d8dee9ff\\">952</span><span style=\\"color: #d8dee9ff\\">, done</span></span></code></pre>"
  `)
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
  expect(out).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "color": "#F8F8F2",
          "content": "",
          "fontStyle": 0,
        },
        Object {
          "color": "#333333",
          "content": " WARN ",
          "fontStyle": 0,
        },
        Object {
          "color": "#F8F8F2",
          "content": " using --force I sure hope you know what you are doing",
          "fontStyle": 0,
        },
      ],
      Array [
        Object {
          "color": "#F8F8F2",
          "content": "Scope: all 6 workspace projects",
          "fontStyle": 0,
        },
      ],
      Array [
        Object {
          "color": "#F8F8F2",
          "content": "Lockfile is up to date, resolution step is skipped",
          "fontStyle": 0,
        },
      ],
      Array [
        Object {
          "color": "#F8F8F2",
          "content": "Packages: ",
          "fontStyle": 0,
        },
        Object {
          "color": "#86B42B",
          "content": "+952",
          "fontStyle": 0,
        },
        Object {
          "color": "#F8F8F2",
          "content": "",
          "fontStyle": 0,
        },
      ],
      Array [
        Object {
          "color": "#F8F8F2",
          "content": "",
          "fontStyle": 0,
        },
        Object {
          "color": "#86B42B",
          "content": "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
          "fontStyle": 0,
        },
        Object {
          "color": "#F8F8F2",
          "content": "",
          "fontStyle": 0,
        },
      ],
      Array [
        Object {
          "color": "#F8F8F2",
          "content": "Progress: resolved ",
          "fontStyle": 0,
        },
        Object {
          "color": "#F8F8F2",
          "content": "952",
          "fontStyle": 0,
        },
        Object {
          "color": "#F8F8F2",
          "content": ", reused ",
          "fontStyle": 0,
        },
        Object {
          "color": "#F8F8F2",
          "content": "910",
          "fontStyle": 0,
        },
        Object {
          "color": "#F8F8F2",
          "content": ", downloaded ",
          "fontStyle": 0,
        },
        Object {
          "color": "#F8F8F2",
          "content": "42",
          "fontStyle": 0,
        },
        Object {
          "color": "#F8F8F2",
          "content": ", added ",
          "fontStyle": 0,
        },
        Object {
          "color": "#F8F8F2",
          "content": "952",
          "fontStyle": 0,
        },
        Object {
          "color": "#F8F8F2",
          "content": ", done",
          "fontStyle": 0,
        },
      ],
    ]
  `)
})
