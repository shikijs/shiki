import { getHighlighter } from '../index'

test('Nord highlighter highlights simple JavaScript', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord'
  })
  const out = highlighter.codeToHtml(`console.log('shiki');`, 'js')
  expect(out).toMatchSnapshot()
})

test('Individual lines are highlighted', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord'
  })
  const code = `
let a = 1;
let b = 2;
console.log(a+b);
console.log('shiki');
`

  const out = highlighter.codeToHtml(code, 'js', { highlightLines: [2, 4] })
  expect(out).toBe(
    `<pre class=\"shiki highlighted\" style=\"background-color: #2e3440\"><code>
<span class=\"hl\"><span style=\"color: #81A1C1\">let</span><span style=\"color: #D8DEE9FF\"> </span><span style=\"color: #D8DEE9\">a</span><span style=\"color: #D8DEE9FF\"> </span><span style=\"color: #81A1C1\">=</span><span style=\"color: #D8DEE9FF\"> </span><span style=\"color: #B48EAD\">1</span><span style=\"color: #81A1C1\">;</span></span>
<span style=\"color: #81A1C1\">let</span><span style=\"color: #D8DEE9FF\"> </span><span style=\"color: #D8DEE9\">b</span><span style=\"color: #D8DEE9FF\"> </span><span style=\"color: #81A1C1\">=</span><span style=\"color: #D8DEE9FF\"> </span><span style=\"color: #B48EAD\">2</span><span style=\"color: #81A1C1\">;</span>
<span class=\"hl\"><span style=\"color: #8FBCBB\">console</span><span style=\"color: #ECEFF4\">.</span><span style=\"color: #88C0D0\">log</span><span style=\"color: #D8DEE9FF\">(</span><span style=\"color: #D8DEE9\">a</span><span style=\"color: #81A1C1\">+</span><span style=\"color: #D8DEE9\">b</span><span style=\"color: #D8DEE9FF\">)</span><span style=\"color: #81A1C1\">;</span></span>
<span style=\"color: #8FBCBB\">console</span><span style=\"color: #ECEFF4\">.</span><span style=\"color: #88C0D0\">log</span><span style=\"color: #D8DEE9FF\">(</span><span style=\"color: #ECEFF4\">&apos;</span><span style=\"color: #A3BE8C\">shiki</span><span style=\"color: #ECEFF4\">&apos;</span><span style=\"color: #D8DEE9FF\">)</span><span style=\"color: #81A1C1\">;</span></code></pre>`
  )
})

test('Line ranges are highlighted', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord'
  })
  const code = `let a = 1;
let b = 2;
console.log(a+b);
console.log('shiki');
`
  const out = highlighter.codeToHtml(code, 'js', { highlightLines: ['1-3'] })
  expect(out).toBe(
    `<pre class="shiki highlighted" style="background-color: #2e3440"><code><span class="hl"><span style="color: #81A1C1">let</span><span style="color: #D8DEE9FF"> </span><span style="color: #D8DEE9">a</span><span style="color: #D8DEE9FF"> </span><span style="color: #81A1C1">=</span><span style="color: #D8DEE9FF"> </span><span style="color: #B48EAD">1</span><span style="color: #81A1C1">;</span></span>
<span class="hl"><span style="color: #81A1C1">let</span><span style="color: #D8DEE9FF"> </span><span style="color: #D8DEE9">b</span><span style="color: #D8DEE9FF"> </span><span style="color: #81A1C1">=</span><span style="color: #D8DEE9FF"> </span><span style="color: #B48EAD">2</span><span style="color: #81A1C1">;</span></span>
<span class="hl"><span style="color: #8FBCBB">console</span><span style="color: #ECEFF4">.</span><span style="color: #88C0D0">log</span><span style="color: #D8DEE9FF">(</span><span style="color: #D8DEE9">a</span><span style="color: #81A1C1">+</span><span style="color: #D8DEE9">b</span><span style="color: #D8DEE9FF">)</span><span style="color: #81A1C1">;</span></span>
<span style="color: #8FBCBB">console</span><span style="color: #ECEFF4">.</span><span style="color: #88C0D0">log</span><span style="color: #D8DEE9FF">(</span><span style="color: #ECEFF4">&apos;</span><span style="color: #A3BE8C">shiki</span><span style="color: #ECEFF4">&apos;</span><span style="color: #D8DEE9FF">)</span><span style="color: #81A1C1">;</span></code></pre>`
  )
})

test('Combinations of lines are highlighted', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord'
  })
  const code = `let a = 1;
let b = 2;
console.log(a+b);
console.log('shiki');
`
  const out = highlighter.codeToHtml(code, 'js', { highlightLines: [1, '3-4'] })
  expect(out).toBe(
    `<pre class="shiki highlighted" style="background-color: #2e3440"><code><span class="hl"><span style="color: #81A1C1">let</span><span style="color: #D8DEE9FF"> </span><span style="color: #D8DEE9">a</span><span style="color: #D8DEE9FF"> </span><span style="color: #81A1C1">=</span><span style="color: #D8DEE9FF"> </span><span style="color: #B48EAD">1</span><span style="color: #81A1C1">;</span></span>
<span style="color: #81A1C1">let</span><span style="color: #D8DEE9FF"> </span><span style="color: #D8DEE9">b</span><span style="color: #D8DEE9FF"> </span><span style="color: #81A1C1">=</span><span style="color: #D8DEE9FF"> </span><span style="color: #B48EAD">2</span><span style="color: #81A1C1">;</span>
<span class="hl"><span style="color: #8FBCBB">console</span><span style="color: #ECEFF4">.</span><span style="color: #88C0D0">log</span><span style="color: #D8DEE9FF">(</span><span style="color: #D8DEE9">a</span><span style="color: #81A1C1">+</span><span style="color: #D8DEE9">b</span><span style="color: #D8DEE9FF">)</span><span style="color: #81A1C1">;</span></span>
<span class="hl"><span style="color: #8FBCBB">console</span><span style="color: #ECEFF4">.</span><span style="color: #88C0D0">log</span><span style="color: #D8DEE9FF">(</span><span style="color: #ECEFF4">&apos;</span><span style="color: #A3BE8C">shiki</span><span style="color: #ECEFF4">&apos;</span><span style="color: #D8DEE9FF">)</span><span style="color: #81A1C1">;</span></span></code></pre>`
  )
})
