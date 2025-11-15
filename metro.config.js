const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Enhance server middleware for fonts
config.server = {
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      if (req.url.includes(".ttf")) {
        res.setHeader("Cache-Control", "public, max-age=31536000");
      }
      return middleware(req, res, next);
    };
  },
};

// Redirect react-native-maps to the web mock
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    "react-native-maps": path.resolve(__dirname, "web-map-mock.js"),
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });
