/* eslint-disable no-irregular-whitespace */
import { expect, it } from 'vitest'
import {
  getHighlighter,
} from '../src'

it('renders ansi to html', async () => {
  const highlighter = await getHighlighter({ themes: ['monokai'] })

  const out = highlighter.codeToHtml(`[0;30;43m WARN [0m using --force I sure hope you know what you are doing
Scope: all 6 workspace projects
Lockfile is up to date, resolution step is skipped
Packages: [0;32m+952[0m
[0;32m++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++[0m
Progress: resolved [0;104m952[0m, reused [0;104m910[0m, downloaded [0;104m42[0m, added [0;104m952[0m, done
Done in 15.7s`, { theme: 'monokai', lang: 'ansi' })

  expect(out).toMatchInlineSnapshot(`
    "<pre class=\\"shiki monokai\\" style=\\"background-color:#272822;color:#F8F8F2\\" tabindex=\\"0\\" lang=\\"ansi\\"><code><span class=\\"line\\"><span style=\\"color:#333333\\"> WARN </span><span style=\\"color:#F8F8F2\\"> using --force I sure hope you know what you are doing</span></span>
    <span class=\\"line\\"><span style=\\"color:#F8F8F2\\">Scope: all 6 workspace projects</span></span>
    <span class=\\"line\\"><span style=\\"color:#F8F8F2\\">Lockfile is up to date, resolution step is skipped</span></span>
    <span class=\\"line\\"><span style=\\"color:#F8F8F2\\">Packages: </span><span style=\\"color:#86B42B\\">+952</span></span>
    <span class=\\"line\\"><span style=\\"color:#86B42B\\">++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++</span></span>
    <span class=\\"line\\"><span style=\\"color:#F8F8F2\\">Progress: resolved </span><span style=\\"color:#F8F8F2\\">952</span><span style=\\"color:#F8F8F2\\">, reused </span><span style=\\"color:#F8F8F2\\">910</span><span style=\\"color:#F8F8F2\\">, downloaded </span><span style=\\"color:#F8F8F2\\">42</span><span style=\\"color:#F8F8F2\\">, added </span><span style=\\"color:#F8F8F2\\">952</span><span style=\\"color:#F8F8F2\\">, done</span></span>
    <span class=\\"line\\"><span style=\\"color:#F8F8F2\\">Done in 15.7s</span></span></code></pre>"
  `)
})
