import Constants from "expo-constants";

const appVariant = Constants.expoConfig?.extra?.APP_VARIANT;
const storageKeyBase = "appState";

const storageKey =
  appVariant === "development"
    ? `${storageKeyBase}-dev`
    : appVariant === "preview"
    ? `${storageKeyBase}-preview`
    : storageKeyBase;

export const appConfig = {
  storageKey,
} as const;
