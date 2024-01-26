async function getHighlighter(...args) {
  const { getHighlighter } = await import('./dist/index.mjs')
  return getHighlighter(...args)
}

async function loadTheme(...args) {
  const { loadTheme } = await import('./dist/index.mjs')
  return loadTheme(...args)
}

module.exports = getHighlighter
module.exports.getHighlighter = getHighlighter
module.exports.loadTheme = loadTheme
