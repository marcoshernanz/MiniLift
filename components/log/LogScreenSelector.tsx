import getColor from "@/lib/getColor";
import { DumbbellIcon, WeightIcon } from "lucide-react-native";
import React from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface Props {
  scrollViewRef: React.RefObject<Animated.ScrollView | null>;
  scrollX: SharedValue<number>;
}

export default function LogScreenSelector({ scrollViewRef, scrollX }: Props) {
  const screenWidth = Dimensions.get("screen").width;
  const primaryColor = getColor("primary");
  const foregroundColor = getColor("foreground");

  const dumbbellStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, [0, screenWidth], [1, 0]),
  }));
  const weightStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, [0, screenWidth], [0, 1]),
  }));

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.pressable}
        android_ripple={{ color: getColor("muted"), borderless: true }}
        onPress={() =>
          scrollViewRef.current?.scrollTo({ x: 0, animated: true })
        }
      >
        <View style={styles.iconWrapper}>
          <DumbbellIcon size={24} strokeWidth={1.5} color={foregroundColor} />
          <Animated.View style={[StyleSheet.absoluteFill, dumbbellStyle]}>
            <DumbbellIcon size={24} strokeWidth={1.5} color={primaryColor} />
          </Animated.View>
        </View>
      </Pressable>
      <Pressable
        style={styles.pressable}
        android_ripple={{ color: getColor("muted"), borderless: true }}
        onPress={() =>
          scrollViewRef.current?.scrollTo({ x: screenWidth, animated: true })
        }
      >
        <View style={styles.iconWrapper}>
          <WeightIcon size={24} strokeWidth={1.5} color={foregroundColor} />
          <Animated.View style={[StyleSheet.absoluteFill, weightStyle]}>
            <WeightIcon size={24} strokeWidth={1.5} color={primaryColor} />
          </Animated.View>
        </View>
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
  iconWrapper: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
});
