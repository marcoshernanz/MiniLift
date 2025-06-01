import { ConfigContext, ExpoConfig } from "expo/config";

const appVariant = process.env.APP_VARIANT;
const isDevelopment = appVariant === "development";
const isPreview = appVariant === "preview";

const getUniqueIdentifier = () => {
  if (isDevelopment) {
    return "com.marcoshernanz.minilift.dev";
  } else if (isPreview) {
    return "com.marcoshernanz.minilift.preview";
  } else {
    return "com.marcoshernanz.minilift";
  }
};

const getAppName = () => {
  if (isDevelopment) {
    return "MiniLift (Dev)";
  } else if (isPreview) {
    return "MiniLift (Preview)";
  } else {
    return "MiniLift";
  }
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: "MiniLift",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "minilift",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    bundleIdentifier: getUniqueIdentifier(),
    supportsTablet: true,
  },
  android: {
    package: getUniqueIdentifier(),
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    softwareKeyboardLayoutMode: "pan",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    [
      "expo-font",
      {
        fonts: [
          "node_modules/@expo-google-fonts/inter/100Thin/Inter_100Thin.ttf",
          "node_modules/@expo-google-fonts/inter/100Thin_Italic/Inter_100Thin_Italic.ttf",
          "node_modules/@expo-google-fonts/inter/200ExtraLight/Inter_200ExtraLight.ttf",
          "node_modules/@expo-google-fonts/inter/200ExtraLight_Italic/Inter_200ExtraLight_Italic.ttf",
          "node_modules/@expo-google-fonts/inter/300Light/Inter_300Light.ttf",
          "node_modules/@expo-google-fonts/inter/300Light_Italic/Inter_300Light_Italic.ttf",
          "node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf",
          "node_modules/@expo-google-fonts/inter/400Regular_Italic/Inter_400Regular_Italic.ttf",
          "node_modules/@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf",
          "node_modules/@expo-google-fonts/inter/500Medium_Italic/Inter_500Medium_Italic.ttf",
          "node_modules/@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf",
          "node_modules/@expo-google-fonts/inter/600SemiBold_Italic/Inter_600SemiBold_Italic.ttf",
          "node_modules/@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf",
          "node_modules/@expo-google-fonts/inter/700Bold_Italic/Inter_700Bold_Italic.ttf",
          "node_modules/@expo-google-fonts/inter/800ExtraBold/Inter_800ExtraBold.ttf",
          "node_modules/@expo-google-fonts/inter/800ExtraBold_Italic/Inter_800ExtraBold_Italic.ttf",
          "node_modules/@expo-google-fonts/inter/900Black/Inter_900Black.ttf",
          "node_modules/@expo-google-fonts/inter/900Black_Italic/Inter_900Black_Italic.ttf",
        ],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: "3155cbf7-8362-43bd-b48c-ea4fbb91bbec",
    },
    APP_VARIANT: appVariant,
  },
});
