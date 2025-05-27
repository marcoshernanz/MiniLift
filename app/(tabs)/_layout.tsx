import getColor from "@/lib/getColor";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: getColor("primary"),
        tabBarInactiveTintColor: getColor("mutedForeground"),
        tabBarStyle: {
          backgroundColor: getColor("background"),
          borderTopColor: getColor("border"),
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Lifts",
        }}
      />
      <Tabs.Screen
        name="weight"
        options={{
          tabBarLabel: "Weight",
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          tabBarLabel: "Activity",
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          tabBarLabel: "Statistics",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
        }}
      />
    </Tabs>
  );
}
