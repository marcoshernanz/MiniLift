import getColor from "@/lib/getColor";
import { DumbbellIcon, WeightIcon } from "lucide-react-native";
import React from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

interface Props {
  scrollViewRef: React.RefObject<Animated.ScrollView | null>;
}

export default function LogScreenSelector({ scrollViewRef }: Props) {
  const screenWidth = Dimensions.get("screen").width;

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.pressable]}
        android_ripple={{ color: getColor("muted"), borderless: true }}
        onPress={() => {
          scrollViewRef.current?.scrollTo({ x: 0, animated: true });
        }}
      >
        <DumbbellIcon
          size={24}
          strokeWidth={1.5}
          color={getColor("foreground")}
        />
      </Pressable>
      <Pressable
        style={[styles.pressable]}
        android_ripple={{ color: getColor("muted"), borderless: true }}
        onPress={() => {
          scrollViewRef.current?.scrollTo({
            x: screenWidth,
            animated: true,
          });
        }}
      >
        <WeightIcon
          size={24}
          strokeWidth={1.5}
          color={getColor("foreground")}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 64,
    borderTopWidth: 1,
    borderTopColor: getColor("border"),
  },
  pressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
