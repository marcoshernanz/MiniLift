import { computeChartPaths } from "@/lib/chart/computeChartPaths";
import getColor from "@/lib/getColor";
import { Canvas, LinearGradient, Path, vec } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Text from "./Text";

interface Props {
  data: Record<string, number>;
  width: number;
  height: number;
  tooltipHeight?: number;
  tooltipWidth?: number;
  labelCount?: number;
}

const bottomPadding = 0.1;
const tooltipMargin = 12;
const baseLabelHeight = 24;
const circleRadius = 4;
const lineWidth = 1;

export default function SimpleChart({
  data,
  width,
  height,
  tooltipHeight = 32,
  tooltipWidth = 92,
  labelCount,
}: Props) {
  const labelHeight = labelCount ? baseLabelHeight : 0;
  const chartHeight = height - tooltipHeight - tooltipMargin - labelHeight;
  const chartTop = tooltipHeight + tooltipMargin;
  const widthPerPoint = width / (Object.keys(data).length - 1 || 1);

  const pressX = useSharedValue<number>(0);
  const showTooltip = useSharedValue<boolean>(false);

  const { linePath, areaPath, points } = useMemo(
    () =>
      computeChartPaths({ data, width, height: chartHeight, bottomPadding }),
    [data, width, chartHeight]
  );

  const gesture = Gesture.Pan()
    .activateAfterLongPress(200)
    .onStart((e) => {
      pressX.value = Math.round(e.x / widthPerPoint) * widthPerPoint;
      showTooltip.value = true;
    })
    .onUpdate((e) => {
      pressX.value = Math.round(e.x / widthPerPoint) * widthPerPoint;
      showTooltip.value = true;
    })
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
      width: 1,
      height: chartHeight + tooltipMargin,
      left: pressX.value - lineWidth / 2,
      top: tooltipHeight,
      backgroundColor: getColor("primary"),
    })),
  };

  // const indicatorY = useDerivedValue(() => {
  //   const idx =
  //     pressX.value != null ? xs.findIndex((x) => x === pressX.value) : -1;
  //   return idx >= 0 ? points[idx].y : -9999;
  // });
  // const canvasHeight = height - (labelCount ? labelHeight : 0);

  // const circleStyleAnim = useAnimatedStyle(() => ({
  //   left: pressX.value - circleRadius,
  //   top: indicatorY.value - circleRadius,
  // }));

  // const strokeColor = getColor("primary");
  // const gradientStart = getColor("primary", 0.5);
  // const gradientEnd = getColor("primary", 0);

  // const [selectedIndex, setSelectedIndex] = React.useState(-1);

  // useAnimatedReaction(
  //   () => {
  //     const idx =
  //       pressX.value != null ? xs.findIndex((x) => x === pressX.value) : -1;
  //     return { idx };
  //   },
  //   (res) => {
  //     runOnJS(setSelectedIndex)(res.idx);
  //   },
  //   [xs]
  // );

  // const tooltipStyle = useAnimatedStyle(() => ({
  //   left: Math.min(
  //     Math.max(pressX.value - tooltipWidth / 2, 0),
  //     width - tooltipWidth
  //   ),
  // }));

  return (
    <GestureDetector gesture={gesture}>
      <View style={{ width, height, flexDirection: "column" }}>
        <Canvas
          style={{
            flex: 1,
            height: chartHeight,
            marginTop: chartTop,
          }}
        >
          <Path path={areaPath} style="fill">
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

        <Animated.View style={[animatedStyles.tooltipContainer]}>
          <Animated.View
            style={[styles.indicatorLine, animatedStyles.tooltipLine]}
          />

          {/* <Animated.View
                style={[
                  styles.indicatorCircle,
                  {
                    width: circleRadius * 2,
                    height: circleRadius * 2,
                    borderRadius: circleRadius,
                    backgroundColor: strokeColor,
                  },
                  circleStyleAnim,
                ]}
              />

              <Animated.View
                style={[
                  styles.tooltipContainer,
                  {
                    width: tooltipWidth,
                    height: tooltipHeight,
                  },
                  tooltipStyle,
                ]}
              >
                <Text style={styles.tooltipText}>
                  <Text style={styles.tooltipKeyText}>
                    {points[selectedIndex]?.key}
                  </Text>
                  <Text> &bull; </Text>
                  <Text>{points[selectedIndex]?.value}</Text>
                </Text>
              </Animated.View> */}
        </Animated.View>

        {points.length > 0 && labelCount && (
          <View style={[styles.labelsContainer, { height: labelHeight }]}>
            {Array.from({ length: labelCount }, (_, i) => {
              const idx = Math.round(
                ((i + 1) * points.length) / (labelCount + 1) - 1
              );
              return (
                <Text key={idx} style={styles.labelText}>
                  {points[idx].key}
                </Text>
              );
            })}
          </View>
        )}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  tooltipContainer: {
    position: "absolute",
    top: 0,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: getColor("primary"),
    backgroundColor: getColor("primary", 0.1),
    borderRadius: 3,
  },
  tooltipText: {
    fontSize: 12,
  },
  tooltipKeyText: {
    fontWeight: 500,
  },
  labelsContainer: {
    alignItems: "center",
    // height: labelHeight,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  labelText: {
    fontSize: 12,
    textAlign: "center",
    color: getColor("mutedForeground"),
  },
  indicatorLine: {
    position: "absolute",
    width: 1,
    backgroundColor: getColor("primary"),
  },
  indicatorCircle: {
    position: "absolute",
  },
});
