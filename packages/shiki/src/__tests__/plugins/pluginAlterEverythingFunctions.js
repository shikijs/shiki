module.exports = {
  name: 'pluginAlterEverythingFunctions',
  tags: {
    pre: {
      attributes: () => {
        return {
          'data-test': 'funcPre'
        }
      },
      classNames: () => {
        return ['funcPre1', 'funcPre2']
      },
      styles: () => {
        return {
          'background-color': 'yellow',
          color: 'red'
        }
      }
    },

    code: {
      attributes: () => {
        return {
          'data-test': 'funcCode'
        }
      }
    },
    line: {
      attributes: () => {
        return {
          'data-test': 'funcLine'
        }
      },
      classNames: () => {
        return ['funcLine1', 'funcLine2']
      },
      styles: () => {
        return {
          'background-color': 'red',
          color: 'black'
        }
      }
    },
    token: {
      attributes: () => {
        return {
          'data-test': 'funcToken'
        }
      },
      classNames: () => {
        return ['funcToken1', 'funcToken2']
      },
      styles: () => {
        return {
          'background-color': 'grey',
          color: 'red'
        }
      }
    }
  }
}
