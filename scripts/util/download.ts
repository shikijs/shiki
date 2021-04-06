import url from 'url'
import https from 'https'

export async function get(url: string, encoding: BufferEncoding = 'utf-8'): Promise<any> {
  return new Promise((r, reject) => {
    https
      .get(url, res => {
        const { statusCode } = res
        if (statusCode !== 200) {
          reject('request failed')
        }

        res.setEncoding(encoding)
        if (encoding === 'utf-8') {
          let rawData = ''
          res.on('data', chunk => (rawData += chunk))
          res.on('end', () => {
            try {
              r(rawData)
            } catch (e) {
              console.log(e)
              reject('get failed')
            }
          })
        } else if (encoding === 'binary') {
          let data = []
          res.on('data', chunk => data.push(Buffer.from(chunk, 'binary')))
          res.on('end', function () {
            r(Buffer.concat(data))
          })
          res.on('error', function (err) {
            console.log(err)
            reject('get failed')
          })
        }
      })
      .on('error', e => {
        reject('get failed')
      })
  })
}

export function convertGHURLToDownloadURL(ghURL: string) {
  const oldPath = url.parse(ghURL).path
  return 'https://raw.githubusercontent.com' + oldPath.replace('/blob/', '/')
}
