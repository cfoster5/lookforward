module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    "react-native-reanimated/plugin",
    [
      "module-resolver",
      {
        alias: {
          api: "./src/api",
          assets: "./assets",
          components: "./src/components",
          "@/config": "./src/config",
          constants: "./src/constants",
          contexts: "./src/contexts",
          helpers: "./src/helpers",
          "@/hooks": "./src/hooks",
          "@/providers": "./src/providers",
          "@/stores": "./src/stores",
          "@/types": "./src/types",
        },
      },
    ],
  ],
};
