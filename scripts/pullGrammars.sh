# clean up
rm -rf tmp/grammars
mkdir -p tmp/grammars

echo "> Getting VS Code grammars"
if [ ! -d tmp/vscode ]; then
  git clone https://github.com/microsoft/vscode.git tmp/vscode --depth=1
else
  (cd tmp/vscode && git checkout . && git pull)
fi
# Two html file will cause `cp` to fail
mv tmp/vscode/extensions/php/syntaxes/html.tmLanguage.json tmp/vscode/extensions/php/syntaxes/php-html.tmLanguage.json
cp tmp/vscode/extensions/**/syntaxes/*.json tmp/grammars
echo "> Done getting VS Code grammars"

echo "> Getting grammars from GitHub"
npx esno scripts/grammars/pullGrammarsFromGitHub.ts
echo "> Done getting grammars from GitHub"

echo "> Getting grammars from VS Code marketplace"
npx esno scripts/grammars/pullGrammarsFromMarketplace.ts
echo "> Done getting grammars from VS Code marketplace"

echo "> Normalizing grammars"
npx esno scripts/grammars/normalizeGrammarPaths.ts
echo "> Done normalizing grammars"

echo "> Copying grammars"
cp tmp/grammars/*.json packages/shiki/languages
echo "> Done copying grammars"

echo "> Updating source files"
npx esno scripts/grammars/updateGrammarSourceFiles.ts
echo "> Done updating source files"

echo "> Formatting grammar files"
npx prettier --write packages/shiki/languages/*
echo "> Done formatting grammar files"

echo "> All done"
