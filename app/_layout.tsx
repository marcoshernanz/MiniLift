import AppContextProvider from "@/context/AppContext";
import getColor from "@/lib/getColor";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: getColor("background"),
      }}
    >
      <AppContextProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </AppContextProvider>
    </View>
  );
}
