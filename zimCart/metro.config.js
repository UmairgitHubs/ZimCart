const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "react-native-css-interop/jsx-runtime": "react-native-css-interop/dist/runtime/jsx-runtime",
  "react-native-css-interop/jsx-dev-runtime": "react-native-css-interop/dist/runtime/jsx-runtime",
}

module.exports = withNativeWind(config, { input: "./src/global.css" });
