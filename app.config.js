export default {
  expo: {
    name: "lookforward",
    slug: "lookforward",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      googleServicesFile:
        process.env.GOOGLE_SERVICE_PLIST ?? "./GoogleService-Info.secret.plist",
      bundleIdentifier: "com.lookforward.app",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    plugins: [
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
          },
        },
      ],
    ],
    experiments: {
      tsconfigPaths: true,
    },
    extra: {
      eas: {
        projectId: "4ebe5d26-ee4a-4228-9d28-e757244e31b0",
      },
      TMDB_KEY: process.env.TMDB_KEY || null,
      IGDB_AWS_KEY: process.env.IGDB_AWS_KEY || null,
    },
  },
};
