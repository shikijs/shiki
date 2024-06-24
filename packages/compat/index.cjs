async function createHighlighter(...args) {
  const { createHighlighter } = await import('./dist/index.mjs')
  return createHighlighter(...args)
}

async function loadTheme(...args) {
  const { loadTheme } = await import('./dist/index.mjs')
  return loadTheme(...args)
}

module.exports = createHighlighter
module.exports.createHighlighter = createHighlighter
module.exports.loadTheme = loadTheme
