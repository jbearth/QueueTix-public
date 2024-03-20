module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', "module:metro-react-native-babel-preset"],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@src': './src',
          },
        },
      ],
      "@babel/plugin-transform-flow-strip-types",
      "@babel/plugin-transform-class-properties",
    ],
  }
}