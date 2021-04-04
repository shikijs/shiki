import { parse as plistParse } from 'fast-plist'
import fs from 'fs'
import https from 'https'
import yaml from 'js-yaml'
import kebabCase from 'lodash.kebabcase'
import path from 'path'
import url from 'url'

export async function get(url: string): Promise<string> {
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
