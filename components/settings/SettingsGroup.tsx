import React from "react";
import getColor from "@/lib/getColor";
import { StyleSheet, View } from "react-native";
import type { SettingsItemProps } from "./SettingsItem";

interface Props {
  children?:
    | React.ReactElement<SettingsItemProps>
    | React.ReactElement<SettingsItemProps>[];
}

export default function SettingsGroup({ children }: Props) {
  const items = React.Children.toArray(
    children
  ) as React.ReactElement<SettingsItemProps>[];
  return (
    <View style={styles.container}>
      {items.map((child, index) =>
        React.cloneElement(child, {
          isFirst: index === 0,
          isLast: index === items.length - 1,
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: getColor("border"),
    width: "100%",
    borderRadius: 8,
  },
});
