import getColor from "@/lib/getColor";
import { Tabs } from "expo-router";
import {
  ActivityIcon,
  BarChartIcon,
  DumbbellIcon,
  SettingsIcon,
  WeightIcon,
} from "lucide-react-native";
import React, { forwardRef } from "react";
import { Pressable, type PressableProps } from "react-native";

const TabBarPressableButton = forwardRef<any, PressableProps>((props, ref) => (
  <Pressable
    {...props}
    ref={ref}
    android_ripple={{ color: getColor("muted"), borderless: true }}
  />
));
TabBarPressableButton.displayName = "TabBarPressableButton";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: getColor("primary"),
        tabBarInactiveTintColor: getColor("mutedForeground"),
        tabBarButton: (props) => <TabBarPressableButton {...props} />,
        tabBarStyle: {
          backgroundColor: getColor("background"),
          borderColor: getColor("border"),
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Lifts",
          tabBarIcon: ({ color, size }) => (
            <DumbbellIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="weight"
        options={{
          tabBarLabel: "Weight",
          tabBarIcon: ({ color, size }) => (
            <WeightIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          tabBarLabel: "Activity",
          tabBarIcon: ({ color, size }) => (
            <ActivityIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          tabBarLabel: "Statistics",
          tabBarIcon: ({ color, size }) => (
            <BarChartIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <SettingsIcon color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
