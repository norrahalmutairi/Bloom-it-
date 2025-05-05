module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Handle Firebase dependencies
      ["module:react-native-dotenv"],
      // Optional plugin to handle object spread operators properly
      "@babel/plugin-proposal-object-rest-spread"
    ],
  };
}; 