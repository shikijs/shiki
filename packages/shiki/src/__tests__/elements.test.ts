import { getHighlighter, renderToHtml } from '../index'

test('Customize elements - pre', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })
  const tokens = highlighter.codeToThemedTokens(`console.log('shiki');`, 'js')
  const out = renderToHtml(tokens, {
    fg: highlighter.getForegroundColor('nord'),
    bg: highlighter.getBackgroundColor('nord'),
    elements: {
      pre({ className, style, children }) {
        return `<pre tabindex="1" class="${className}" style="${style}">${children}</pre>`
      }
    }
  })
  expect(out).toMatchSnapshot()
})

test('Customize elements - code', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })
  const tokens = highlighter.codeToThemedTokens(`console.log('shiki');`, 'js')
  const out = renderToHtml(tokens, {
    fg: highlighter.getForegroundColor('nord'),
    bg: highlighter.getBackgroundColor('nord'),
    elements: {
      code({ children }) {
        return `<code data-copy-text="hello">${children}</code>`
      }
    }
  })
  expect(out).toMatchSnapshot()
})

test('Customize elements - line', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })
  const tokens = highlighter.codeToThemedTokens(`console.log('shiki');`, 'js')
  const out = renderToHtml(tokens, {
    fg: highlighter.getForegroundColor('nord'),
    bg: highlighter.getBackgroundColor('nord'),
    elements: {
      line({ className, index, children }) {
        return `<span class="${className}"><span class="line-no">${index}</span>${children}</span>`
      }
    }
  })
  expect(out).toMatchSnapshot()
})

test('Customize elements - token', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })
  const tokens = highlighter.codeToThemedTokens(`console.log('shiki');`, 'js')
  const out = renderToHtml(tokens, {
    fg: highlighter.getForegroundColor('nord'),
    bg: highlighter.getBackgroundColor('nord'),
    elements: {
      token({ style, token, children }) {
        return `<span data-color="${token.color || ''}" style="${style}">${children}</span>`
      }
    }
  })
  expect(out).toMatchSnapshot()
})
