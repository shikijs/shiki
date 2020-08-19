const https = require('https')

async function get(url) {
  return new Promise((r, reject) => {
    https
      .get(url, res => {
        const { statusCode } = res
        if (statusCode !== 200) {
          reject('request failed')
        }

        res.setEncoding('utf-8')
        let rawData = ''
        res.on('data', chunk => (rawData += chunk))
        res.on('end', () => {
          try {
            r(rawData)
          } catch (e) {
            console.log(e)
            reject('parse failed')
          }
        })
      })
      .on('error', e => {
        reject('get failed')
      })
  })
}

module.exports = {
  get
}
