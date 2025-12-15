import { version } from "./package.json";

export default {
  expo: {
    name: "LookForward",
    slug: "lookforward",
    owner: "cfoster",
    version: version,
    orientation: "portrait",
    icon: "./assets/icon.png",
    scheme: "lookforward",
    // TODO: allow switching appearance
    // userInterfaceStyle: "automatic",
    userInterfaceStyle: "dark",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      googleServicesFile:
        process.env.GOOGLE_SERVICE_PLIST ?? "./GoogleService-Info.plist",
      bundleIdentifier: "com.lookforward.app",
      associatedDomains: ["applinks:getlookforward.app"],
      entitlements: {
        "aps-environment": "production",
        "com.apple.developer.applesignin": ["Default"],
      },
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      appStoreUrl: "https://apps.apple.com/app/id1492748952",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#000000",
      },
      package: "com.lookforward.app",
      googleServicesFile:
        process.env.GOOGLE_SERVICE_JSON ?? "./google-services.json",
    },
    plugins: [
      "expo-font",
      "expo-router",
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      "@bacons/apple-colors",
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
            forceStaticLinking: ["RNFBApp"],
          },
        },
      ],
    ],
    experiments: {
      tsconfigPaths: true,
      typedRoutes: true,
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
