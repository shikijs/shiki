const fs = require('fs')
const path = require('path')
const { GRAMMAR_FOLDER_PATH, normalizeGrammarFile } = require('./normalizeGrammarFile')

const files = fs.readdirSync(GRAMMAR_FOLDER_PATH)

const toRemove = ['html-derivative', 'ignore', 'MagicRegExp', 'platform', 'sassdoc', 'searchResult']

const specialNewNames = {
  'asp-vb-net': 'vb',
  batchfile: 'bat',
  coffeescript: 'coffee',
  cpp: 'cpp',
  csharp: 'csharp',
  cshtml: 'razor',
  dockerfile: 'docker',
  'git-commit': 'git-commit',
  'git-rebase': 'git-rebase',
  JavaScript: 'javascript',
  JavaScriptReact: 'jsx',
  JSON: 'json',
  JSONC: 'jsonc',
  MagicPython: 'python',
  'shell-unix-bash': 'shellscript',
  svelte: 'svelte',
  TypeScriptReact: 'tsx',
  ini: 'ini',
  php: 'php',
  'php-html': 'php-html',
  perl6: 'perl6',
  haml: 'haml',
  'fortran_free-form': 'fortran',
  plsql: 'pls',
  sas: 'sas',
  prolog: 'prolog',
  'language-x86_64-assembly': 'asm',
  wat: 'wasm',
  wenyan: '文言'
}

for (let f of files) {
  const [fbase] = f.split('.')
  if (toRemove.includes(fbase)) {
    const fpath = path.resolve(GRAMMAR_FOLDER_PATH, f)
    fs.unlinkSync(fpath)
    console.log(`removed ${fpath}`)
  }
  normalizeGrammarFile(f, specialNewNames[fbase])
}
