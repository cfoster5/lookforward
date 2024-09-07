export default {
  expo: {
    name: "LookForward",
    slug: "lookforward",
    version: "6.2.5",
    orientation: "portrait",
    icon: "./assets/icon.png",
    scheme: "lookforward",
    userInterfaceStyle: "dark",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      googleServicesFile:
        process.env.GOOGLE_SERVICE_PLIST ?? "./GoogleService-Info.secret.plist",
      bundleIdentifier: "com.lookforward.app",
      associatedDomains: ["applinks:getlookforward.app"],
      entitlements: {
        "aps-environment": "production",
      },
      buildNumber: "1",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#000000",
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
      TMDB_TOKEN: process.env.TMDB_TOKEN || null,
      IGDB_AWS_KEY: process.env.IGDB_AWS_KEY || null,
      TRAKT_KEY: process.env.TRAKT_KEY || null,
      OMDB_KEY: process.env.OMDB_KEY || null,
    },
  },
};
