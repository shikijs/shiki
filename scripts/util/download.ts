import url from 'url'
import https from 'https'

const steps = {
  Initial: 'Initial fetch',
  UTF8: 'Parse as UTF-8',
  Binary: 'Parse as binary'
}

export async function get(url: string, encoding: BufferEncoding = 'utf-8'): Promise<any> {
  return new Promise((r, reject) => {
    https
      .get(url, res => {
        const { statusCode, statusMessage } = res
        if (statusCode !== 200) {
          reject({ step: steps.Initial, message: `${statusCode} ${statusMessage}` })
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
              reject({ steps: steps.UTF8, message: e.message })
            }
          })
        } else if (encoding === 'binary') {
          let data = []
          res.on('data', chunk => data.push(Buffer.from(chunk, 'binary')))
          res.on('end', function () {
            r(Buffer.concat(data))
          })
          res.on('error', function (e) {
            console.log(e)
            reject({ steps: steps.Binary, message: e.message })
          })
        }
      })
      .on('error', e => {
        reject({ step: steps.Initial, message: e.message })
      })
  })
}

export function convertGHURLToDownloadURL(ghURL: string) {
  const oldPath = url.parse(ghURL).path
  return 'https://raw.githubusercontent.com' + oldPath.replace('/blob/', '/')
}
