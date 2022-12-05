function getStyleBackgroundColorFromTheme(theme) {
  return theme.colors['activityBar.activeBackground'] || 'red'
}

function getConfig(config) {
  return config
}

let _config

module.exports = config => {
  _config = getConfig(config)

  return {
    name: 'pluginWithTheme',
    config: {
      requestTheme: true
    },
    tags: {
      pre: {
        styles: context => {
          return {
            'background-color': getStyleBackgroundColorFromTheme(context.theme)
          }
        }
      }
    }
  }
}
