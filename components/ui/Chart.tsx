import { computeChartPaths } from "@/lib/chart/computeChartPaths";
import getColor from "@/lib/getColor";
import {
  Canvas,
  Circle,
  Group,
  LinearGradient,
  Paragraph,
  Path,
  Skia,
  SkParagraphStyle,
  SkTextStyle,
  TextAlign,
  useFonts,
  vec,
} from "@shopify/react-native-skia";
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
  const numTotalLabels = Math.floor(dataLength / pointsPerLabel);

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

  const selectedPoint = useDerivedValue(() => {
    const target = Math.round((pressX.value - panX.value) / widthPerPoint);
    const index = Math.min(points.length - 1, Math.max(0, target));
    return points[index];
  });
  const transform = useDerivedValue(() => [{ translateX: panX.value }]);

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
          style={[
            styles.chartContainer,
            {
              height,
              paddingTop: chartTop,
              width: width,
            },
          ]}
        >
          <Canvas
            style={{
              flex: 1,
              height,
            }}
          >
            <Group transform={transform}>
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

              {points.map((p, idx) => (
                <React.Fragment key={idx}>
                  <Circle
                    cx={p.x}
                    cy={p.y}
                    r={5.5}
                    color={getColor("background")}
                  />
                  <Circle
                    cx={p.x}
                    cy={p.y}
                    r={5.5}
                    color={getColor("primary")}
                    style="stroke"
                    strokeWidth={1.5}
                  />
                </React.Fragment>
              ))}

              {Array.from({ length: numTotalLabels }, (_, i) => {
                const idx = i * pointsPerLabel + 1;
                const width = widthPerPoint * pointsPerLabel;
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

                  const paragraph = Skia.ParagraphBuilder.Make(
                    paragraphStyle,
                    fontManager
                  )
                    .pushStyle(textStyle)
                    .addText(points[idx].key)
                    .build();

                  paragraph.layout(width);

                  return paragraph;
                })();

                const paragraphHeight = paragraph?.getHeight() || 0;

                return (
                  <Paragraph
                    key={idx}
                    paragraph={paragraph}
                    x={widthPerPoint * idx - width / 2}
                    y={chartHeight + labelHeight / 2 - paragraphHeight / 2}
                    width={width}
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
