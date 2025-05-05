// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Ensure that Firebase is properly bundled
defaultConfig.resolver.sourceExts.push('cjs');
defaultConfig.resolver.assetExts.push('lottie');

// We don't need to resolve modules directly here
// Let the normal bundling process handle it
module.exports = defaultConfig; 