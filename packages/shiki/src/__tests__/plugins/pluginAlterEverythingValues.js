module.exports = {
  name: 'pluginAlterEverythingValues',
  tags: {
    pre: {
      attributes: {
        'data-test': 'valuePre'
      },
      classNames: ['valuePre1', 'valuePre2'],
      styles: {
        'background-color': 'red',
        color: 'blue'
      }
    },
    code: {
      attributes: {
        'data-test': 'valueCode'
      }
    },
    line: {
      attributes: {
        'data-test': 'valueLine'
      },
      classNames: ['valueLine1', 'valueLine2'],
      styles: {
        'background-color': 'yellow',
        color: 'green'
      }
    },
    token: {
      attributes: {
        'data-test': 'valueToken'
      },
      classNames: ['valueToken1', 'valueToken2'],
      styles: {
        'background-color': 'green',
        color: 'yellow'
      }
    }
  }
}
