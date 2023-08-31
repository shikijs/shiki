module.exports = {
  preset: 'ts-jest',
  testMatch: ['<rootDir>/packages/**/__tests__/**/*test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/tmp/'],
  testTimeout: 10000,
  testEnvironment: 'node',
  globals: {
    __BROWSER__: false
  },
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        target: 'esnext',
        lib: ['ESNext', 'DOM', 'WebWorker']
      }
    ]
  }
}
