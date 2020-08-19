rm -rf tmp
mkdir -p tmp/themes
node scripts/updateThemesOnGitHub.js
node scripts/normalizeThemePaths.js