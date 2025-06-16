import { computeChartPaths } from "@/lib/chart/computeChartPaths";
import getColor from "@/lib/getColor";
import { Canvas, LinearGradient, Path, vec } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import AnimateableText from "react-native-animateable-text";
import {
  Gesture,
  GestureDetector,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Text from "./Text";

interface Props {
  data: Record<string, number>;
  width: number;
  height: number;
  tooltipHeight?: number;
  tooltipWidth?: number;
  labelCount?: number;
  padding?: number;
  numPointsVisible?: number;
}

const bottomPadding = 0.1;
const tooltipMargin = 16;
const baseLabelHeight = 32;
const lineWidth = 1;

export default function Chart({
  data,
  width,
  height,
  tooltipHeight = 32,
  tooltipWidth = 92,
  labelCount = 0,
  padding = 16,
  numPointsVisible = Object.keys(data).length,
}: Props) {
  const labelHeight = labelCount ? baseLabelHeight : 0;
  const chartHeight = height - tooltipHeight - tooltipMargin - labelHeight;
  const chartTop = tooltipHeight + tooltipMargin;
  const widthPerPoint = (width - padding * 2) / (numPointsVisible - 1);
  const dataLength = Object.keys(data).length;
  const chartWidth = widthPerPoint * (dataLength - 1);
  const numTotalLabels =
    labelCount * Math.round((dataLength - 1) / (numPointsVisible - 1));

  const { linePath, areaPath, points } = useMemo(
    () =>
      computeChartPaths({
        data,
        width: chartWidth,
        height: chartHeight,
        bottomPadding,
      }),
    [data, chartWidth, chartHeight]
  );

  const pressX = useSharedValue<number>(0);
  const showTooltip = useSharedValue<boolean>(false);

  const minPanX =
    -(chartWidth - (numPointsVisible - 1) * widthPerPoint) + padding;
  const startingPanX = useSharedValue(minPanX);
  const panX = useSharedValue(minPanX);

  const tooltipX = useDerivedValue(() => pressX.value - panX.value);
  const selectedPoint = useDerivedValue(() => {
    const target = Math.round(tooltipX.value / widthPerPoint);
    const index = Math.min(points.length - 1, Math.max(0, target));
    return points[index];
  });

  const tooltipUpdate = (
    e: GestureUpdateEvent<PanGestureHandlerEventPayload>
  ) => {
    const x = e.x;
    const target =
      Math.round((x - padding) / widthPerPoint) * widthPerPoint + padding;
    pressX.value = Math.max(padding, Math.min(target, width - padding));
    showTooltip.value = true;
  };

  const tooltipGesture = Gesture.Pan()
    .activateAfterLongPress(200)
    .onStart(tooltipUpdate)
    .onUpdate(tooltipUpdate)
    .onEnd(() => {
      showTooltip.value = false;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      panX.value = startingPanX.value + e.translationX;
    })
    .onEnd(() => {
      startingPanX.value = panX.value;
    });

  const gesture = Gesture.Race(tooltipGesture, panGesture);

  useAnimatedReaction(
    () => startingPanX.value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        const translate =
          Math.round((panX.value - padding) / widthPerPoint) * widthPerPoint +
          padding;
        const fixedTranslate = Math.min(padding, Math.max(minPanX, translate));

        panX.value = withTiming(fixedTranslate);
        startingPanX.value = withTiming(fixedTranslate);
      }
    }
  );

  const animatedStyles = {
    chartContainer: useAnimatedStyle(() => ({
      flex: 1,
      height: chartHeight,
      paddingTop: chartTop,
      width: chartWidth,
      transform: [{ translateX: panX.value }],
    })),
    tooltipContainer: useAnimatedStyle(() => ({
      display: showTooltip.value ? "flex" : "none",
      position: "absolute",
    })),
    tooltipLine: useAnimatedStyle(() => ({
      position: "absolute",
      left: tooltipX.value - lineWidth / 2,
      top: tooltipHeight,
      width: 1,
      height: chartHeight + tooltipMargin,
      backgroundColor: getColor("primary"),
    })),
    tooltipBox: useAnimatedStyle(() => ({
      position: "absolute",
      left: Math.max(
        -panX.value,
        Math.min(
          tooltipX.value - tooltipWidth / 2,
          -panX.value + width - tooltipWidth
        )
      ),
      top: 0,
      width: tooltipWidth,
      height: tooltipHeight,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: getColor("primary"),
      backgroundColor: getColor("primary", 0.1),
      borderRadius: 4,
    })),
  };

  const animatedProps = {
    selectedPointKey: useAnimatedProps(() => ({
      text: selectedPoint.value.key,
    })),
    selectedPointValue: useAnimatedProps(() => ({
      text: selectedPoint.value.value.toString(),
    })),
  };

  return (
    <GestureDetector gesture={gesture}>
      <View style={{ width, height, flexDirection: "column" }}>
        <Animated.View style={animatedStyles.chartContainer}>
          <Canvas
            style={{
              flex: 1,
              height: chartHeight,
            }}
          >
            <Path path={areaPath} style="fill" dither>
              <LinearGradient
                start={vec(0, chartTop)}
                end={vec(0, chartHeight)}
                colors={[getColor("primary", 0.5), getColor("primary", 0)]}
              />
            </Path>
            <Path
              path={linePath}
              color={getColor("primary")}
              style="stroke"
              strokeWidth={2}
            />
          </Canvas>

          <Animated.View style={animatedStyles.tooltipContainer}>
            <Animated.View style={animatedStyles.tooltipLine} />

            <Animated.View style={animatedStyles.tooltipBox}>
              <AnimateableText
                animatedProps={animatedProps.selectedPointKey}
                style={[
                  styles.tooltipText,
                  styles.tooltipKeyText,
                  { fontFamily: "Inter_500Medium" },
                ]}
              />
              <Text> &bull; </Text>
              <AnimateableText
                animatedProps={animatedProps.selectedPointValue}
                style={[styles.tooltipText, { fontFamily: "Inter_400Regular" }]}
              />
            </Animated.View>
          </Animated.View>

          {points.map((p, idx) => (
            <View
              key={idx}
              style={[
                styles.chartDot,
                {
                  left: p.x - 5.5,
                  top: chartTop + p.y - 5.5,
                },
              ]}
            />
          ))}

          {points.length > 0 && numTotalLabels && (
            <View style={[styles.labelsContainer, { height: labelHeight }]}>
              {Array.from({ length: numTotalLabels }, (_, i) => {
                const idx = Math.round(
                  ((i + 1) * points.length) / (numTotalLabels + 1) - 1
                );
                return (
                  <Text key={idx} style={styles.labelText}>
                    {points[idx].key}
                  </Text>
                );
              })}
            </View>
          )}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  chartDot: {
    position: "absolute",
    width: 11,
    height: 11,
    borderRadius: 999,
    backgroundColor: getColor("background"),
    borderColor: getColor("primary"),
    borderWidth: 1.5,
    zIndex: 1,
  },
  tooltipText: {
    fontSize: 12,
    color: getColor("foreground"),
  },
  tooltipKeyText: {
    fontWeight: 500,
  },
  labelsContainer: {
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  labelText: {
    fontSize: 12,
    textAlign: "center",
    color: getColor("mutedForeground"),
  },
});
