const fs = require('fs')
const path = require('path')
const { GRAMMAR_FOLDER_PATH, normalizeGrammarFile } = require('./normalizeGrammarFile')

const files = fs.readdirSync(GRAMMAR_FOLDER_PATH)

const toRemove = ['html-derivative', 'ignore', 'MagicRegExp', 'platform', 'sassdoc', 'searchResult']

const specialNewNames = {
  'asp-vb-net': 'vb',
  batchfile: 'bat',
  cpp: 'cpp',
  csharp: 'csharp',
  cshtml: 'razor',
  'git-commit': 'git-commit',
  'git-rebase': 'git-rebase',
  JavaScript: 'javascript',
  JavaScriptReact: 'jsx',
  JSON: 'json',
  JSONC: 'jsonc',
  log: 'log',
  MagicPython: 'python',
  'shell-unix-bash': 'shellscript',
  TypeScriptReact: 'tsx',
  ini: 'ini',
  perl6: 'perl6',
  haml: 'haml',
  'fortran_free-form': 'fortran',
  plsql: 'pls',
  sas: 'sas',
  prolog: 'prolog',
  'language-x86_64-assembly': 'asm',
  wat: 'wasm'
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
