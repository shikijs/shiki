module.exports = config => {
  return {
    name: 'pluginHookBefore',
    hooks: {
      before: context => {
        let tokens = context.tokens[0]

        tokens = tokens.map(token => {
          if (token.content && token.content === 'console') {
            token.content = token.content.replace('console', 'Logger')
          }
          return token
        })

        context.tokens[0] = tokens

        return { tokens: context.tokens }
      }
    }
  }
}
