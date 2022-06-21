module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin', [
    'module-resolver',
    {
      alias: {
        api: './src/api',
        assets: './assets',
        components: './src/components',
        constants: './src/constants',
        contexts: './src/contexts',
        helpers: './src/helpers',
        types: './src/types',
      },
    },
  ]],
};
