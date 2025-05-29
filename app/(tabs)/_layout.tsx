import getColor from "@/lib/getColor";
import { Tabs } from "expo-router";
import {
  ActivityIcon,
  BarChartIcon,
  HomeIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react-native";
import React, { forwardRef } from "react";
import { Pressable, View, type PressableProps } from "react-native";

const TabBarPressableButton = forwardRef<any, PressableProps>((props, ref) => (
  <Pressable
    {...props}
    ref={ref}
    android_ripple={{ color: getColor("muted"), borderless: true }}
  />
));
TabBarPressableButton.displayName = "TabBarPressableButton";

export default function TabLayout() {
  // floating button will be a simple view overlaying the Tabs
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: getColor("primary"),
          tabBarInactiveTintColor: getColor("mutedForeground"),
          tabBarStyle: {
            backgroundColor: getColor("background"),
            borderColor: getColor("border"),
            borderTopWidth: 1,
          },
          tabBarButton: (props) => <TabBarPressableButton {...props} />,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <HomeIcon color={color} size={size} />
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
          name="add"
          options={{
            tabBarLabel: "",
            tabBarIcon: () => null,
            tabBarButton: () => <TabBarPressableButton />,
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
      <Pressable
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          width: 60,
          height: 60,
          borderRadius: 9999,
          backgroundColor: getColor("primary"),
          borderWidth: 1,
          borderColor: getColor("border"),
          transform: [{ translateX: "-50%" }],
          zIndex: 10,
          justifyContent: "center",
          alignItems: "center",
          elevation: 5,
        }}
        android_ripple={{ color: getColor("foreground", 0.25), radius: 30 }}
      >
        <PlusIcon color={getColor("primaryForeground")} size={32} />
      </Pressable>
    </View>
  );
}
