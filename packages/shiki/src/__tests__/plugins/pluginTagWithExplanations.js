function getConfig(config) {
  return config
}

let _config

module.exports = config => {
  _config = getConfig(config)

  return {
    name: 'pluginTagWithExplanations',
    config: {
      requestExplanation: true
    },
    tags: {
      token: {
        styles: context => {
          let bgColor = 'red'

          if (context.token?.content === 'console' && context.token?.explanation.length > 0) {
            const firstScope = context.token.explanation[0].scopes.filter(scope => {
              return scope.themeMatches && scope.themeMatches.length > 0
            })
            if (
              firstScope &&
              firstScope.length > 0 &&
              firstScope[0].themeMatches[0].scope === 'variable.other'
            ) {
              bgColor = 'blue'
            }
          }

          return {
            'background-color': bgColor
          }
        }
      }
    }
  }
}
