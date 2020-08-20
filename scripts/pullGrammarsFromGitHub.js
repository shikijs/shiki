const { get, convertGHURLToDownloadURL } = require('./download')
const fs = require('fs')
const url = require('url')
const path = require('path')

const LANGUAGE_GRAMMAR_FOLDER_PATH = path.join(__dirname, '..', 'tmp/grammars')

const languageSources = [
  'https://github.com/prisma-labs/vscode-graphql/blob/master/grammars/graphql.json',
  'https://github.com/karuna/haml-vscode/blob/master/syntaxes/haml.json',
  'https://github.com/James-Yu/LaTeX-Workshop/blob/master/syntax/LaTeX.tmLanguage.json',
  'https://github.com/TheRealSyler/vscode-sass-indented/blob/master/syntaxes/sass.tmLanguage.json',
  'https://github.com/d4rkr00t/language-stylus/blob/master/syntaxes/stylus.json',
  'https://github.com/textmate/toml.tmbundle/blob/master/Syntaxes/TOML.tmLanguage',
  'https://github.com/vuejs/vetur/blob/master/syntaxes/vue-generated.json',
  'https://github.com/vuejs/vetur/blob/master/syntaxes/vue-html.tmLanguage.json',
  'https://github.com/vuejs/vetur/blob/master/syntaxes/vue-postcss.json'
]

async function go() {
  for (let l of languageSources) {
    const targetUrl = convertGHURLToDownloadURL(l)
    const newFileName = l.endsWith('.json')
      ? path.parse(url.parse(l).path).name.replace('.tmLanguage', '') + '.tmLanguage.json'
      : path.parse(url.parse(l).path).name.replace('.tmLanguage', '') + '.tmLanguage.plist'
    const content = await get(targetUrl)
    fs.writeFileSync(path.resolve(LANGUAGE_GRAMMAR_FOLDER_PATH, newFileName), content)
    console.log(`Downloaded ${newFileName}`)
  }
}

go()
