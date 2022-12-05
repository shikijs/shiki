function getConfig(config) {
  return { ...config, ...{ classToAdd: 'plugin-as-function' } }
}

let _config

module.exports = config => {
  _config = getConfig(config)

  return {
    name: 'pluginAsFunction',
    tags: {
      pre: {
        classNames: [_config.classToAdd]
      }
    }
  }
}
