import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="weight" />
      <Tabs.Screen name="activity" />
      <Tabs.Screen name="statistics" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
