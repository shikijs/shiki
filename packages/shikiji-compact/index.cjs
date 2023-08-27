module.exports.getHighlighter = async (...args) => {
  const { getHighlighter } = await import('./dist/index.mjs')
  return getHighlighter(...args)
}
