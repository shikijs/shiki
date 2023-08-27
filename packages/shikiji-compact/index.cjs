async function getHighlighter(...args) {
  const { getHighlighter } = await import('./dist/index.mjs')
  return getHighlighter(...args)
}

module.exports = getHighlighter
module.exports.getHighlighter = getHighlighter
