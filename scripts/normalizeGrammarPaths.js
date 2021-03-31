const fs = require('fs')
const path = require('path')
const { GRAMMAR_FOLDER_PATH, normalizeGrammarFile } = require('./normalizeGrammarFile')
const yaml = require('js-yaml')

/**
 * Remove these grammars
 */
const toRemove = [
  'html-derivative',
  'ignore',
  'MagicRegExp',
  'platform',
  'sassdoc',
  'searchResult',
  'log',
  'cuda-cpp'
]

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

let files = fs.readdirSync(GRAMMAR_FOLDER_PATH)

/**
 * Convert yml to json
 */
for (let f of files) {
  if (f.split('.').pop() === 'yml') {
    const fpath = path.resolve(GRAMMAR_FOLDER_PATH, f)
    const newPath = path.resolve(GRAMMAR_FOLDER_PATH, f.replace(/yml$/, 'json'))
    const newContent = yaml.load(fs.readFileSync(fpath, 'utf-8'))
    fs.unlinkSync(fpath)
    fs.writeFileSync(newPath, JSON.stringify(newContent, null, 2))
    console.log(`rewrote yml at ${fpath} to json at ${newPath}`)
  }
}

files = fs.readdirSync(GRAMMAR_FOLDER_PATH)
/**
 * Remove unneeded grammars
 */
for (let f of files) {
  const [fbase] = f.split('.')

  if (toRemove.includes(fbase)) {
    const fpath = path.resolve(GRAMMAR_FOLDER_PATH, f)
    fs.unlinkSync(fpath)
    console.log(`removed ${fpath}`)
  }
  normalizeGrammarFile(f, specialNewNames[fbase])
}
