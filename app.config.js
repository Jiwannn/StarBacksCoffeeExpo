export default {
  expo: {
    name: "StarBacks Coffee",
    slug: "starbacks-coffee",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/logo.jpg",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/logo.jpg",
      resizeMode: "contain",
      backgroundColor: "#333333"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.starbacks.coffee"
    },
    android: {
      package: "com.anonymous.starbackscoffeeexpo",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#333333"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    }
  }
};