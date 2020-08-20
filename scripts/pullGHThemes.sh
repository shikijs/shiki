rm -rf tmp
mkdir -p tmp/themes
node scripts/pullThemesFromGitHub.js
node scripts/normalizeThemePaths.js