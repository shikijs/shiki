import { getHighlighter } from '../index'

test('Nord highlighter highlights simple JavaScript', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord'
  })
  const out = highlighter.codeToHtml(`console.log('shiki');`, 'js')
  expect(out).toBe(
    `<pre class=\"shiki\" style=\"background-color: #2e3440\"><code><span style=\"color: #8FBCBB\">console</span><span style=\"color: #ECEFF4\">.</span><span style=\"color: #88C0D0\">log</span><span style=\"color: #D8DEE9FF\">(</span><span style=\"color: #ECEFF4\">&apos;</span><span style=\"color: #A3BE8C\">shiki</span><span style=\"color: #ECEFF4\">&apos;</span><span style=\"color: #D8DEE9FF\">)</span><span style=\"color: #81A1C1\">;</span></code></pre>`
  )
})
