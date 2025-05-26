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
    return "Minilift (Dev)";
  } else if (isPreview) {
    return "Minilift (Preview)";
  } else {
    return "Minilift";
  }
};

export default ({ config }) => ({
  ...config,
  name: getAppName(),
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    ...config.android,
    package: getUniqueIdentifier(),
  },
  extra: {
    ...config.extra,
    APP_VARIANT: appVariant,
  },
});
