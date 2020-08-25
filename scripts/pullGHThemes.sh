rm -rf tmp
mkdir -p tmp/themes
node scripts/pullThemesFromGitHub.js
node scripts/normalizeThemePaths.js
cp tmp/themes/*.json packages/themes/data
node scripts/updateThemeSrc.js