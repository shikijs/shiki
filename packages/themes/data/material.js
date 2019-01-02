const fs = require('fs')
const path = require('path')

const files = fs.readdirSync(path.resolve(__dirname, './material'))

files.map(f => {
  const absp = path.resolve(__dirname, './material', f)

  const newf = f.replace(/^Material-Theme/, 'Material-Theme-')
  const newp = path.resolve(__dirname, './material', newf)
  fs.renameSync(absp, newp)
})