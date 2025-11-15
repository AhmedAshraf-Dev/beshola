import "dotenv/config";

export default {
  expo: {
    name: "Beshola",
    slug: "Beshola",
    version: "1.0.0",
    orientation: "portrait",
    platforms: ["ios", "android", "web"],
    icon: "./assets/icon.png",
    scheme: "Beshola",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.Beshola",
      buildNumber: "1.0.0",
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.Beshola",
      versionCode: 1,
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.INTERNET",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
      ],
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID,
        },
      },
    },
    web: {
      bundler: "metro",
      favicon: "./assets/display/logo.jpeg",
    },
    plugins: ["expo-font"],
    extra: {
      eas: {
        projectId: "e70421d7-bd0c-4677-90b5-2f8d26945831",
      },
    },
    experiments: {
      typedRoutes: true,
    },
  },
};
