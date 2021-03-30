# clean up
rm -rf tmp/grammars
mkdir -p tmp/grammars

echo "> Getting VS Code grammars"
if [ ! -d tmp/vscode ]; then
  git clone git@github.com:microsoft/vscode.git tmp/vscode --depth=1
  # Two html file will cause `cp` to fail
  mv tmp/vscode/extensions/php/syntaxes/html.tmLanguage.json tmp/vscode/extensions/php/syntaxes/php-html.tmLanguage.json
else
  (cd tmp/vscode && git pull)
fi

cp tmp/vscode/extensions/**/syntaxes/*.json tmp/grammars
echo "> Done getting VS Code grammars"

echo "> Getting grammars from GitHub"
node scripts/pullGrammarsFromGitHub.js
echo "> Done getting grammars from GitHub"

echo "> Normalizing grammars"
node scripts/normalizeGrammarPaths.js
echo "> Done normalizing grammars"

echo "> Copying grammars"
cp tmp/grammars/*.json packages/shiki/languages
echo "> Done copying grammars"

echo "> Updating source files"
node scripts/updateLangSrc.js
echo "> Done updating source files"

echo "> All done"
