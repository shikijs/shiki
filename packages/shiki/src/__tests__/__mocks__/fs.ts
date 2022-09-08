// __mocks__/fs.ts
import path from 'path'

const fs = jest.createMockFromModule<any>('fs')

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null)
function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null)
  for (const file in newMockFiles) {
    const dir = path.dirname(file)

    if (!mockFiles[dir]) {
      mockFiles[dir] = []
    }
    mockFiles[dir].push(path.basename(file))
  }
}

// A custom version of `fs.promises.readFile` that reads from the special mocked out
// file list set via __setMockFiles
function promisesReadFile(directoryPath) {
  return mockFiles[directoryPath] || []
}

fs.__setMockFiles = __setMockFiles
fs.promises = {
  readFile: promisesReadFile
}

module.exports = fs
