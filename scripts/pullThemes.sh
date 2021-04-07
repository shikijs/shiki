# clean up
rm -rf tmp/themes
mkdir -p tmp/themes

echo "> Getting VS Code themes"
if [ ! -d tmp/vscode ]; then
  git clone https://github.com/microsoft/vscode.git tmp/vscode --depth=1
else
  (cd tmp/vscode && git checkout . && git pull)
fi
cp tmp/vscode/extensions/theme-*/themes/*.json tmp/themes
npx esno scripts/themes/processVSCThemes.ts
echo "> Done getting VS Code themes"

echo "> Getting themes from GitHub"
npx esno scripts/themes/pullThemesFromGitHub.ts
echo "> Done getting themes from GitHub"

echo "> Getting themes from VS Code marketplace"
npx esno scripts/themes/pullThemesFromMarketplace.ts
echo "> Done getting themes from VS Code marketplace"

echo "> Normalizing themes"
npx esno scripts/themes/normalizeThemePaths.ts
echo "> Done normalizing themes"

echo "> Copying themes"
cp tmp/themes/*.json packages/shiki/themes
echo "> Done copying themes"

echo "> Updating source files"
npx esno scripts/themes/updateThemeSrc.ts
echo "> Done updating source files"

echo "> Formatting theme files"
npx prettier --write packages/shiki/themes/*
echo "> Done formatting theme files"

echo "> All done"
