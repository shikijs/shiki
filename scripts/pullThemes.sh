# clean up
rm -rf tmp
mkdir -p tmp/themes

echo "> Getting themes from GitHub"
node scripts/pullThemesFromGitHub.js
echo "> Done getting themes from GitHub"

echo "> Normalizing themes"
node scripts/normalizeThemePaths.js
echo "> Done normalizing themes"

echo "> Copying themes"
cp tmp/themes/*.json packages/shiki/themes
echo "> Done copying themes"

echo "> Updating source files"
node scripts/updateThemeSrc.js
echo "> Done updating source files"

echo "> All done"
