import { computeChartPaths } from "@/lib/chart/computeChartPaths";
import getColor from "@/lib/getColor";
import {
  Canvas,
  LinearGradient,
  Path,
  vec,
  processTransform2d,
  usePathValue,
  useFonts,
  SkParagraphStyle,
  TextAlign,
  SkTextStyle,
  Skia,
  Paragraph,
} from "@shopify/react-native-skia";
import React, { useMemo, useEffect } from "react";
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
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Text from "./Text";

interface Props {
  data: Record<string, number | null>;
  width: number;
  height: number;
  tooltipHeight?: number;
  tooltipWidth?: number;
  pointsPerLabel?: number;
  labelStart?: number;
}

const bottomPadding = 0.1;
const tooltipMargin = 12;
const baseLabelHeight = 24;
const circleRadius = 4;
const lineWidth = 1;
const animationDuration = 1000;

export default function SimpleChart({
  data,
  width,
  height,
  tooltipHeight = 32,
  tooltipWidth = 92,
  pointsPerLabel = 0,
  labelStart = 1,
}: Props) {
  const labelHeight = pointsPerLabel ? baseLabelHeight : 0;
  const chartHeight = height - tooltipHeight - tooltipMargin - labelHeight;
  const chartTop = tooltipHeight + tooltipMargin;
  const dataLength = Object.keys(data).length;
  const widthPerPoint = width / dataLength;
  const numTotalLabels =
    pointsPerLabel === 0 ? 0 : Math.floor(dataLength / pointsPerLabel);
  const dataKeys = Object.keys(data);

  const { linePath, areaPath, points } = useMemo(
    () =>
      computeChartPaths({
        data,
        width,
        height: chartHeight,
        bottomPadding,
        topOffset: chartTop,
        minValue: 0,
      }),
    [data, width, chartHeight, chartTop]
  );

  const pressX = useSharedValue<number>(0);
  const showTooltip = useSharedValue<boolean>(false);

  const animationProgress = useSharedValue(0);
  const animatedLinePath = usePathValue((path) => {
    "worklet";
    path.transform(
      processTransform2d([
        {
          translateY: (chartHeight + chartTop) * (1 - animationProgress.value),
        },
        { scaleY: animationProgress.value },
      ])
    );
  }, linePath);
  const animatedAreaPath = usePathValue((path) => {
    "worklet";
    path.transform(
      processTransform2d([
        {
          translateY: (chartHeight + chartTop) * (1 - animationProgress.value),
        },
        { scaleY: animationProgress.value },
      ])
    );
  }, areaPath);

  useEffect(() => {
    animationProgress.value = withTiming(1, { duration: animationDuration });
  }, [animationProgress, data, chartHeight, chartTop]);

  const selectedPoint = useDerivedValue(() => {
    if (points.length === 0) {
      return { x: 0, y: 0, key: "", value: 0 };
    }

    return points.reduce((prev, curr) =>
      Math.abs(curr.x - pressX.value) < Math.abs(prev.x - pressX.value)
        ? curr
        : prev
    );
  });

  const tooltipUpdate = (
    e: GestureUpdateEvent<PanGestureHandlerEventPayload>
  ) => {
    if (points.length === 0) {
      showTooltip.value = false;
      return;
    }

    const closest = points.reduce((prev, curr) =>
      Math.abs(curr.x - e.x) < Math.abs(prev.x - e.x) ? curr : prev
    );
    pressX.value = closest.x;
    showTooltip.value = true;
  };

  const gesture = Gesture.Pan()
    .activateAfterLongPress(200)
    .onStart(tooltipUpdate)
    .onUpdate(tooltipUpdate)
    .onEnd(() => {
      showTooltip.value = false;
    });

  const animatedStyles = {
    tooltipContainer: useAnimatedStyle(() => ({
      display: showTooltip.value ? "flex" : "none",
      position: "absolute",
    })),
    tooltipLine: useAnimatedStyle(() => ({
      position: "absolute",
      left: pressX.value - lineWidth / 2,
      top: tooltipHeight,
      width: 1,
      height: chartHeight + tooltipMargin,
      backgroundColor: getColor("primary"),
    })),
    tooltipCircle: useAnimatedStyle(() => ({
      position: "absolute",
      left: pressX.value - circleRadius,
      top: selectedPoint.value.y - circleRadius,
      width: circleRadius * 2,
      height: circleRadius * 2,
      borderRadius: 999,
      backgroundColor: getColor("primary"),
    })),
    tooltipBox: useAnimatedStyle(() => ({
      position: "absolute",
      left: Math.min(
        Math.max(pressX.value - tooltipWidth / 2, 0),
        width - tooltipWidth
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
    fadeIn: useAnimatedStyle(() => ({
      opacity: animationProgress.value * 2,
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

  const fontManager = useFonts({
    Inter: [
      require("@/node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf"),
    ],
  });

  return (
    <GestureDetector gesture={gesture}>
      <View style={{ width, height, flexDirection: "column" }}>
        <Animated.View
          style={[{ flex: 1, width, height }, animatedStyles.fadeIn]}
        >
          <Canvas
            style={{
              flex: 1,
              height,
            }}
          >
            <Path path={animatedAreaPath} style="fill" dither>
              <LinearGradient
                start={vec(0, chartTop)}
                end={vec(0, chartTop + chartHeight)}
                colors={[getColor("primary", 0.5), getColor("primary", 0)]}
              />
            </Path>
            <Path
              path={animatedLinePath}
              color={getColor("primary")}
              style="stroke"
              strokeWidth={2}
            />

            {Array.from({ length: numTotalLabels }, (_, i) => {
              const entryIdx = i * pointsPerLabel + labelStart;
              const labelWidth = widthPerPoint * pointsPerLabel;
              const paragraph = (() => {
                if (!fontManager) return null;

                const paragraphStyle: SkParagraphStyle = {
                  textAlign: TextAlign.Center,
                };

                const textStyle: SkTextStyle = {
                  color: Skia.Color(getColor("mutedForeground")),
                  fontFamilies: ["Inter"],
                  fontSize: 12,
                };

                const labelKey = dataKeys[entryIdx] || "";
                const paragraph = Skia.ParagraphBuilder.Make(
                  paragraphStyle,
                  fontManager
                )
                  .pushStyle(textStyle)
                  .addText(labelKey)
                  .build();

                paragraph.layout(labelWidth);

                return paragraph;
              })();

              const paragraphHeight = paragraph?.getHeight() || 0;

              return (
                <Paragraph
                  key={`${i}-${entryIdx}`}
                  paragraph={paragraph}
                  x={widthPerPoint * entryIdx - labelWidth / 2}
                  y={
                    chartTop +
                    chartHeight +
                    labelHeight / 2 -
                    paragraphHeight / 2
                  }
                  width={labelWidth}
                />
              );
            })}
          </Canvas>
        </Animated.View>

        <Animated.View style={animatedStyles.tooltipContainer}>
          <Animated.View style={animatedStyles.tooltipLine} />

          <Animated.View style={animatedStyles.tooltipCircle} />

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
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
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
