import { getHighlighter } from '../../index'
import pluginHookAfter from './pluginHookAfter'
import pluginHookBefore from './pluginHookBefore'
import pluginTagAsObject from './pluginTagAsObject'
import pluginTagAsFunction from './pluginTagAsFunction'
import pluginTagWithExplanationRequest from './pluginTagWithExplanations'
import pluginTagWithThemeRequest from './pluginTagWithTheme'
import pluginTagAlterEverythingWithValues from './pluginAlterEverythingValues'
import pluginTagAlterEverythingWithFunctions from './pluginAlterEverythingFunctions'

test('Loads without element modifications when no plugin is used', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })

  const out = highlighter.codeToHtml("console.log('shiki');", { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Loads and applies a tag plugin that was returned as an object', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })

  highlighter.usePlugin(pluginTagAsObject)

  const out = highlighter.codeToHtml("console.log('shiki');", { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Loads and applies a tag plugin that was returned as a function', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })

  highlighter.usePlugin(pluginTagAsFunction({ classToAdd: 'not-the-one-it-should-be' }))

  const out = highlighter.codeToHtml("console.log('shiki');", { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Loads and applies a tag plugin that requests theme information', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })

  highlighter.usePlugin(pluginTagWithThemeRequest())

  const out = highlighter.codeToHtml("console.log('shiki');", { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Loads and applies a tag plugin that requests token explanations', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })

  highlighter.usePlugin(pluginTagWithExplanationRequest())

  const out = highlighter.codeToHtml("console.log('shiki');", { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Loads and applies a tag plugin that alters everything via values', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })

  highlighter.usePlugin(pluginTagAlterEverythingWithValues)

  const out = highlighter.codeToHtml("console.log('shiki');", { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Loads and applies a plugin that alters everything via functions', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })

  highlighter.usePlugin(pluginTagAlterEverythingWithFunctions)

  const out = highlighter.codeToHtml("console.log('shiki');", { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Loads and applies multiple tag plugins with overwriting duplicate keys', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })

  highlighter
    .usePlugin(pluginTagAlterEverythingWithValues)
    .usePlugin(pluginTagAlterEverythingWithFunctions)

  const out = highlighter.codeToHtml("console.log('shiki');", { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Loads and applies a before hook plugin', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })

  highlighter.usePlugin(pluginHookBefore)

  const out = highlighter.codeToHtml("console.log('shiki');", { lang: 'js' })

  expect(out).toMatchSnapshot()
})

test('Loads and applies an after hook plugin', async () => {
  const highlighter = await getHighlighter({
    theme: 'nord',
    langs: ['js']
  })

  highlighter.usePlugin(pluginHookAfter)

  const out = highlighter.codeToHtml("console.log('shiki');", { lang: 'js' })

  expect(out).toMatchSnapshot()
})
