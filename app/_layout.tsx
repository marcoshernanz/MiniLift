import ToastProvider from "@/components/ui/Toast";
import AppContextProvider from "@/context/AppContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <AppContextProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </AppContextProvider>
      <ToastProvider />
    </GestureHandlerRootView>
  );
}
