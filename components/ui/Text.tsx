import getColor from "@/lib/getColor";
import React from "react";
import {
  Platform,
  Text as RNText,
  StyleProp,
  TextProps,
  TextStyle,
} from "react-native";

const resolveFontFamily = (style: StyleProp<TextStyle>) => {
  const flatStyle = Array.isArray(style)
    ? Object.assign({}, ...style)
    : style || {};

  const weight = flatStyle.fontWeight || "400";
  const isItalic = flatStyle.fontStyle === "italic";

  const weightMap: Record<string, string> = {
    "100": "100Thin",
    "200": "200ExtraLight",
    "300": "300Light",
    "400": "400Regular",
    "500": "500Medium",
    "600": "600SemiBold",
    "700": "700Bold",
    "800": "800ExtraBold",
    "900": "900Black",
  };

  const expoFontName = weightMap[weight.toString()] || "400Regular";
  const fontNameAndroid = `Inter_${expoFontName}${isItalic ? "_Italic" : ""}`;

  const fontNameIOSMap: Record<string, string> = {
    "100Thin": "Inter-Thin",
    "200ExtraLight": "Inter-ExtraLight",
    "300Light": "Inter-Light",
    "400Regular": "Inter-Regular",
    "500Medium": "Inter-Medium",
    "600SemiBold": "Inter-SemiBold",
    "700Bold": "Inter-Bold",
    "800ExtraBold": "Inter-ExtraBold",
    "900Black": "Inter-Black",
  };

  let fontFamily = Platform.select({
    android: fontNameAndroid,
    ios: isItalic
      ? `${fontNameIOSMap[expoFontName]}Italic`
      : fontNameIOSMap[expoFontName],
  });

  return fontFamily;
};

export default function Text({ style, ...props }: TextProps) {
  const fontFamily = resolveFontFamily(style);
  return (
    <RNText
      {...props}
      style={[{ fontFamily, color: getColor("foreground") }, style]}
    />
  );
}
