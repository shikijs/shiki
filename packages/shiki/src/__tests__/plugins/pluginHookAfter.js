module.exports = config => {
  return {
    name: 'pluginHookAfter',
    hooks: {
      after: context => {
        return context.elementType === 'pre'
          ? { html: context.html.replace(/class="shiki/, 'class="highlighter ') }
          : { html: context.html }
      }
    }
  }
}
