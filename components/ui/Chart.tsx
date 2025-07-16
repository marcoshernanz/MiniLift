import { computeChartPaths } from "@/lib/chart/computeChartPaths";
import getColor from "@/lib/utils/getColor";
import {
  Canvas,
  Circle,
  Group,
  LinearGradient,
  Paragraph,
  Path,
  processTransform2d,
  Skia,
  SkParagraphStyle,
  SkTextStyle,
  TextAlign,
  useFonts,
  usePathValue,
  vec,
} from "@shopify/react-native-skia";
import React, { useEffect, useMemo } from "react";
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
  data: Record<string, number | null>;
  width: number;
  height: number;
  tooltipHeight?: number;
  tooltipWidth?: number;
  pointsPerLabel?: number;
  padding?: number;
  numPointsVisible?: number;
}

const bottomPadding = 0.1;
const tooltipMargin = 16;
const baseLabelHeight = 32;
const lineWidth = 1;
const animationDuration = 1000;

export default function Chart({
  data,
  width,
  height,
  tooltipHeight = 32,
  tooltipWidth = 92,
  pointsPerLabel = 0,
  padding = 16,
  numPointsVisible = Object.keys(data).length,
}: Props) {
  const labelHeight = pointsPerLabel ? baseLabelHeight : 0;
  const chartHeight = height - tooltipHeight - tooltipMargin - labelHeight;
  const chartTop = tooltipHeight + tooltipMargin;
  const widthPerPoint = (width - padding * 2) / (numPointsVisible - 1);
  const dataLength = Object.keys(data).length;
  const chartWidth = widthPerPoint * (dataLength - 1);
  const numTotalLabels =
    pointsPerLabel === 0 ? 0 : Math.floor(dataLength / pointsPerLabel);
  const minValue = Math.min(...Object.values(data).filter((v) => v !== null));

  const { linePath, visibleLinePath, areaPath, visibleAreaPath, points } =
    useMemo(
      () =>
        computeChartPaths({
          data,
          width: chartWidth,
          height: chartHeight,
          bottomPadding,
          topOffset: chartTop,
          minValue: minValue,
          numVisiblePoints: numPointsVisible * 2,
        }),
      [data, chartWidth, chartHeight, chartTop, minValue, numPointsVisible]
    );

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
  }, visibleLinePath);

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
  }, visibleAreaPath);

  const ChartPoint = ({ x, y }: { x: number; y: number }) => {
    const cy = useDerivedValue(
      () =>
        (chartHeight + chartTop) * (1 - animationProgress.value) +
        y * animationProgress.value
    );
    return (
      <>
        <Circle cx={x} cy={cy} r={5.5} color={getColor("background")} />
        <Circle
          cx={x}
          cy={cy}
          r={5.5}
          color={getColor("primary")}
          style="stroke"
          strokeWidth={1.5}
        />
      </>
    );
  };

  const dataKeys = Object.keys(data);

  const pressX = useSharedValue<number>(0);
  const showTooltip = useSharedValue<boolean>(false);

  const minPanX =
    -(chartWidth - (numPointsVisible - 1) * widthPerPoint) + padding;
  const startingPanX = useSharedValue(minPanX);
  const panX = useSharedValue(minPanX);

  useEffect(() => {
    panX.value = minPanX;
    startingPanX.value = minPanX;
    animationProgress.value = 0;
    animationProgress.value = withTiming(1, { duration: animationDuration });
  }, [animationProgress, data, minPanX, panX, startingPanX]);

  const selectedPoint = useDerivedValue(() => {
    if (points.length === 0) {
      return { x: 0, y: 0, key: "", value: 0 };
    }

    const offsetX = pressX.value - panX.value;
    return points.reduce((prev, curr) => {
      return Math.abs(curr.x - offsetX) < Math.abs(prev.x - offsetX)
        ? curr
        : prev;
    });
  });
  const transform = useDerivedValue(() => [{ translateX: panX.value }]);

  const tooltipUpdate = (
    e: GestureUpdateEvent<PanGestureHandlerEventPayload>
  ) => {
    const x = e.x;
    if (points.length === 0) {
      showTooltip.value = false;
      return;
    }

    const closest = points.reduce((prev, curr) => {
      const prevX = prev.x + panX.value;
      const currX = curr.x + panX.value;
      return Math.abs(currX - x) < Math.abs(prevX - x) ? curr : prev;
    });

    const screenX = closest.x + panX.value;
    pressX.value = screenX;
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
        if (dataLength < numPointsVisible) {
          panX.value = withTiming(minPanX);
          startingPanX.value = withTiming(minPanX);
          return;
        }

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
    tooltipContainer: useAnimatedStyle(() => ({
      display: showTooltip.value ? "flex" : "none",
    })),
    tooltipLine: useAnimatedStyle(() => ({
      left: pressX.value - lineWidth / 2,
    })),
    tooltipBox: useAnimatedStyle(() => ({
      left: Math.max(
        0,
        Math.min(pressX.value - tooltipWidth / 2, width - tooltipWidth)
      ),
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
      text: selectedPoint.value.value.toFixed(1),
    })),
  };

  const fontManager = useFonts({
    Inter: [
      require("@/node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf"),
    ],
  });

  if (points.length === 0) {
    return (
      <View
        style={{
          width,
          height,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: getColor("mutedForeground") }}>
          No Data Available
        </Text>
      </View>
    );
  }

  return (
    <GestureDetector gesture={gesture}>
      <View style={{ width, height, flexDirection: "column" }}>
        <Animated.View
          style={[
            styles.chartContainer,
            animatedStyles.fadeIn,
            { height, width },
          ]}
        >
          <Canvas style={{ flex: 1, height }}>
            <Group transform={transform}>
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

              <Path path={areaPath} style="fill" dither>
                <LinearGradient
                  start={vec(0, chartTop)}
                  end={vec(0, chartTop + chartHeight)}
                  colors={[getColor("primary", 0.5), getColor("primary", 0)]}
                />
              </Path>
              <Path
                path={linePath}
                color={getColor("primary")}
                style="stroke"
                strokeWidth={2}
              />

              {points.map((p, idx) => {
                if (p.x >= chartWidth - width * 2) {
                  return <ChartPoint key={idx} x={p.x} y={p.y} />;
                }

                return (
                  <React.Fragment key={idx}>
                    <Circle
                      key={`bg-${idx}`}
                      cx={p.x}
                      cy={p.y}
                      r={5.5}
                      color={getColor("background")}
                    />
                    <Circle
                      key={`fg-${idx}`}
                      cx={p.x}
                      cy={p.y}
                      r={5.5}
                      color={getColor("primary")}
                      style="stroke"
                      strokeWidth={1.5}
                    />
                  </React.Fragment>
                );
              })}

              {Array.from({ length: numTotalLabels }, (_, i) => {
                const entryIdx = i * pointsPerLabel + 1;
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
            </Group>
          </Canvas>

          <Animated.View
            style={[animatedStyles.tooltipContainer, styles.tooltipContainer]}
          >
            <Animated.View
              style={[
                animatedStyles.tooltipLine,
                styles.tooltipLine,
                {
                  top: tooltipHeight,
                  height: chartHeight + tooltipMargin,
                },
              ]}
            />

            <Animated.View
              style={[
                animatedStyles.tooltipBox,
                styles.tooltipBox,
                {
                  width: tooltipWidth,
                  height: tooltipHeight,
                },
              ]}
            >
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
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    flex: 1,
  },
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
  tooltipContainer: {
    position: "absolute",
  },
  tooltipBox: {
    position: "absolute",
    top: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: getColor("primary"),
    backgroundColor: getColor("primary", 0.1),
    borderRadius: 4,
  },
  tooltipLine: {
    position: "absolute",
    width: 1,
    backgroundColor: getColor("primary"),
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
