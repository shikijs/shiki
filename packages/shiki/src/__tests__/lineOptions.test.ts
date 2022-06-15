import { getHighlighter } from '../index'

test('applies class to a single line', async () => {
  const highlighter = await getHighlighter({
    theme: 'css-variables',
    langs: ['js']
  })

  const code = `
console.log('line 1');
console.log('line 2');
`.trim()

  const html = highlighter.codeToHtml(code, {
    lang: 'js',
    lineOptions: [{ line: 1, classes: ['highlighted'] }]
  })
  expect(html).toMatchSnapshot()
})

test('splits plaintext into lines', async () => {
  const highlighter = await getHighlighter({
    theme: 'css-variables'
  })

  const code = `
lorem ipsum
dolor sit amet
`.trim()

  const html = highlighter.codeToHtml(code, {
    lang: 'txt',
    lineOptions: [{ line: 1, classes: ['highlighted'] }]
  })
  expect(html).toMatchSnapshot()
})

test('applies different classes to different lines', async () => {
  const highlighter = await getHighlighter({
    theme: 'css-variables',
    langs: ['js']
  })

  const code = `
console.log('line 1');
console.log('line 2');
console.log('line 3');
console.log('line 4');
console.log('line 5');
`.trim()

  const html = highlighter.codeToHtml(code, {
    lang: 'js',
    lineOptions: [
      { line: 1, classes: ['class-foo'] },
      { line: 3, classes: ['class-bar'] },
      { line: 4, classes: ['class-baz'] }
    ]
  })
  expect(html).toMatchSnapshot()
})

test('deduplicates classes per line', async () => {
  const highlighter = await getHighlighter({
    theme: 'css-variables',
    langs: ['js']
  })

  const code = `
console.log('line 1');
console.log('line 2');
`.trim()

  const html = highlighter.codeToHtml(code, {
    lang: 'js',
    lineOptions: [
      { line: 1, classes: ['highlighted'] },
      { line: 1, classes: ['highlighted'] }
    ]
  })
  expect(html).toMatchSnapshot()
})

test('ignores line numbers out of range', async () => {
  const highlighter = await getHighlighter({
    theme: 'css-variables',
    langs: ['js']
  })

  const code = `
console.log('line 1');
console.log('line 2');
console.log('line 3');
`.trim()

  const html = highlighter.codeToHtml(code, {
    lang: 'js',
    lineOptions: [
      { line: -1, classes: ['highlighted'] },
      { line: 0, classes: ['highlighted'] },
      { line: 2, classes: ['highlighted'] },
      { line: 4, classes: ['highlighted'] },
      { line: 5, classes: ['highlighted'] }
    ]
  })
  expect(html).toMatchSnapshot()
})
