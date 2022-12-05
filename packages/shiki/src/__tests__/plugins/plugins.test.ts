import { getHighlighter } from '../../index'
import pluginAsObject from './pluginAsObject'
import pluginAsFunction from './pluginAsFunction'
import pluginWithExplanationRequest from './pluginWithExplanations'
import pluginWithThemeRequest from './pluginWithTheme'
import pluginAlterEverythingWithValues from './pluginAlterEverythingValues'
import pluginAlterEverythingWithFunctions from './pluginAlterEverythingFunctions'

test('Loads without element modifications when no plugin is used', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })

  const out = highlighter.codeToHtml("console.log('shiki');", { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Loads and applies a plugin that was returned as an object', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })

  highlighter.usePlugin(pluginAsObject)

  const out = highlighter.codeToHtml("console.log('shiki');", { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Loads and applies a plugin that was returned as a function', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })

  highlighter.usePlugin(pluginAsFunction({ classToAdd: 'not-the-one-it-should-be' }))

  const out = highlighter.codeToHtml("console.log('shiki');", { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Loads and applies a plugin that requests theme information', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })

  highlighter.usePlugin(pluginWithThemeRequest())

  const out = highlighter.codeToHtml("console.log('shiki');", { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Loads and applies a plugin that requests token explanations', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })

  highlighter.usePlugin(pluginWithExplanationRequest())

  const out = highlighter.codeToHtml("console.log('shiki');", { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Loads and applies a plugin that alters everything via values', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })

  highlighter.usePlugin(pluginAlterEverythingWithValues)

  const out = highlighter.codeToHtml("console.log('shiki');", { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Loads and applies a plugin that alters everything via functions', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })

  highlighter.usePlugin(pluginAlterEverythingWithFunctions)

  const out = highlighter.codeToHtml("console.log('shiki');", { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Loads and applies multiple plugins with overwriting duplicate keys', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })

  highlighter
    .usePlugin(pluginAlterEverythingWithValues)
    .usePlugin(pluginAlterEverythingWithFunctions)

  const out = highlighter.codeToHtml("console.log('shiki');", { lang: 'js' })

  expect(out).toMatchSnapshot()
})
