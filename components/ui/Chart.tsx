import { ChartPoint, computeChartPaths } from "@/lib/chart/computeChartPaths";
import getColor from "@/lib/getColor";
import {
  Canvas,
  Circle,
  Group,
  LinearGradient,
  Path,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import Text from "./Text";

interface Props {
  data: Record<string, number>;
  width: number;
  height: number;
  tooltipHeight?: number;
  tooltipWidth?: number;
  labelCount?: number;
  numPointsVisible?: number;
}

const bottomPadding = 0.1;
const tooltipMargin = 12;
const labelHeight = 24;

export default function Chart({
  data,
  width,
  height,
  tooltipHeight = 32,
  tooltipWidth = 92,
  labelCount,
  numPointsVisible,
}: Props) {
  const chartTop = tooltipHeight + tooltipMargin;
  const canvasHeight = height - (labelCount ? labelHeight : 0);

  // determine effective chart width based on number of visible points
  const totalPoints = Object.keys(data).length;
  const visibleCount =
    numPointsVisible && numPointsVisible < totalPoints
      ? numPointsVisible
      : totalPoints;
  const totalSegments = totalPoints > 1 ? totalPoints - 1 : 1;
  const visibleSegments = visibleCount > 1 ? visibleCount - 1 : 1;
  const chartWidth = (width * totalSegments) / visibleSegments;

  const [pressX, setPressX] = useState<number | null>(null);
  const [offsetX, setOffsetX] = useState(0);

  // compute paths with scaled width for panning
  const { linePath, areaPath, points } = useMemo(
    () =>
      computeChartPaths({
        data,
        width: chartWidth,
        height,
        chartTop,
        bottomPadding,
        labelHeight,
      }),
    [data, chartWidth, height, chartTop]
  );
  const xs = useMemo(() => points.map((p) => p.x), [points]);

  // gesture for tooltip (long press)
  const indicatorPath = useMemo(() => {
    const p = Skia.Path.Make();
    if (pressX != null) {
      p.moveTo(pressX, tooltipHeight);
      p.lineTo(pressX, height);
    }
    return p;
  }, [pressX, height, tooltipHeight]);

  const tooltipGesture = Gesture.Pan()
    .activateAfterLongPress(200)
    .onStart((e) => {
      const x = e.x - offsetX;
      const target = xs.reduce(
        (prev: number, curr: number) =>
          Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev,
        xs[0]
      );
      runOnJS(setPressX)(target);
    })
    .onUpdate((e) => {
      const x = e.x - offsetX;
      const target = xs.reduce(
        (prev: number, curr: number) =>
          Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev,
        xs[0]
      );
      runOnJS(setPressX)(target);
    })
    .onEnd(() => runOnJS(setPressX)(null));

  // gesture for horizontal pan
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      runOnJS(setOffsetX)((prev: number) => {
        const next = prev + (e.translationX as number);
        const minOffset = Math.min(0, width - chartWidth);
        return Math.max(minOffset, Math.min(next, 0));
      });
    })
    .onEnd(() => {});

  const gesture = Gesture.Simultaneous(panGesture, tooltipGesture);
  const strokeColor = getColor("primary");
  const gradientStart = getColor("primary", 0.5);
  const gradientEnd = getColor("primary", 0);
  const selectedIndex =
    pressX != null ? xs.findIndex((x: number) => x === pressX) : -1;
  const tooltipLeft =
    pressX != null
      ? Math.min(
          Math.max(pressX + offsetX - tooltipWidth / 2, 0),
          width - tooltipWidth
        )
      : 0;

  return (
    <GestureDetector gesture={gesture}>
      <View style={{ width, height, flexDirection: "column" }}>
        <View
          style={{
            width,
            height: canvasHeight,
            position: "relative",
          }}
        >
          <Canvas style={{ flex: 1 }}>
            <Group transform={[{ translateX: offsetX }]}>
              <Path path={areaPath} style="fill">
                <LinearGradient
                  start={vec(0, chartTop)}
                  end={vec(0, canvasHeight)}
                  colors={[gradientStart, gradientEnd]}
                />
              </Path>
              <Path
                path={linePath}
                color={strokeColor}
                style="stroke"
                strokeWidth={2}
              />
              {/* hollow dots */}
              {points.map((p: ChartPoint) => (
                <Circle
                  key={p.key}
                  cx={p.x}
                  cy={p.y}
                  r={4}
                  color={strokeColor}
                  style="stroke"
                  strokeWidth={2}
                />
              ))}
              {pressX != null && (
                <Path
                  path={indicatorPath}
                  color={strokeColor}
                  style="stroke"
                  strokeWidth={1}
                />
              )}
            </Group>
          </Canvas>
          {pressX != null && selectedIndex >= 0 && (
            <View
              style={[
                {
                  left: tooltipLeft,
                  width: tooltipWidth,
                  height: tooltipHeight,
                },
                styles.tooltipContainer,
              ]}
            >
              <Text style={styles.tooltipText}>
                <Text style={styles.tooltipKeyText}>
                  {points[selectedIndex].key}
                </Text>
                <Text> • </Text>
                <Text>{points[selectedIndex].value}</Text>
              </Text>
            </View>
          )}
        </View>

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
    fontWeight: "500",
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
