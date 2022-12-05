module.exports = {
  name: 'simple',
  config: { requestExplanation: true },
  tags: {
    pre: {
      classNames: () => {
        return ['test1', 'test2']
      }
    },
    line: {
      classNames: context => {
        return ['test3', 'test4']
      },
      styles: {
        color: 'red'
      }
    }
  }
}
