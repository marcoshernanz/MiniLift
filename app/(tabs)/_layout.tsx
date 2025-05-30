import TabsAddButton from "@/components/screens/TabsAddButton";
import getColor from "@/lib/getColor";
import { Tabs } from "expo-router";
import {
  ActivityIcon,
  BarChartIcon,
  HomeIcon,
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

      <TabsAddButton />
    </View>
  );
}
