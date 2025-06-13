import getColor from "@/lib/getColor";
import {
  Canvas,
  Circle,
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
}

const bottomPadding = 0.1;
const tooltipMargin = 12;

export default function SimpleChart({
  data,
  width,
  height,
  tooltipHeight = 32,
  tooltipWidth = 92,
}: Props) {
  const chartTop = tooltipHeight + tooltipMargin;

  const [pressX, setPressX] = useState<number | null>(null);

  const { linePath, areaPath, points } = useMemo(() => {
    const linePath = Skia.Path.Make();
    const areaPath = Skia.Path.Make();
    const entries = Object.entries(data) as [string, number][];

    const chartHeight = height - chartTop - height * bottomPadding;
    const max = Math.max(...entries.map(([, v]) => v));
    const min = Math.min(...entries.map(([, v]) => v));
    const points = entries.map(([key, value], index) => {
      const x = (index / (entries.length - 1 || 1)) * width;
      const y = chartTop + ((max - value) / (max - min || 1)) * chartHeight;
      return { x, y, key, value };
    });

    if (points.length > 0) {
      linePath.moveTo(points[0].x, points[0].y);
      areaPath.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cx = (prev.x + curr.x) / 2;
        linePath.cubicTo(cx, prev.y, cx, curr.y, curr.x, curr.y);
        areaPath.cubicTo(cx, prev.y, cx, curr.y, curr.x, curr.y);
      }

      const last = points[points.length - 1];
      linePath.lineTo(last.x, last.y);
      areaPath.lineTo(last.x, last.y);

      areaPath.lineTo(width, height);
      areaPath.lineTo(0, height);
      areaPath.close();
    }
    return { linePath, areaPath, points };
  }, [data, width, height, chartTop]);

  const xs = useMemo(() => points.map((p) => p.x), [points]);

  const indicatorPath = useMemo(() => {
    const p = Skia.Path.Make();
    if (pressX != null) {
      p.moveTo(pressX, tooltipHeight);
      p.lineTo(pressX, height);
    }
    return p;
  }, [pressX, height, tooltipHeight]);

  const longPress = Gesture.LongPress()
    .minDuration(200)
    .onStart((e) => {
      const target = xs.reduce(
        (prev, curr) =>
          Math.abs(curr - e.x) < Math.abs(prev - e.x) ? curr : prev,
        xs[0]
      );
      runOnJS(setPressX)(target);
    })
    .onEnd(() => {
      runOnJS(setPressX)(null);
    });
  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (pressX !== null) {
        const target = xs.reduce(
          (prev, curr) =>
            Math.abs(curr - e.x) < Math.abs(prev - e.x) ? curr : prev,
          xs[0]
        );
        runOnJS(setPressX)(target);
      }
    })
    .onEnd(() => {
      runOnJS(setPressX)(null);
    });
  const gesture = Gesture.Simultaneous(longPress, pan);

  const strokeColor = getColor("primary");
  const gradientStart = getColor("primary", 0.5);
  const gradientEnd = getColor("primary", 0);
  const selectedIndex = pressX != null ? xs.findIndex((x) => x === pressX) : -1;

  const tooltipLeft =
    pressX != null
      ? Math.min(Math.max(pressX - tooltipWidth / 2, 0), width - tooltipWidth)
      : 0;

  return (
    <GestureDetector gesture={gesture}>
      <View style={{ width, height, position: "relative" }}>
        <Canvas style={{ flex: 1 }}>
          <Path path={areaPath} style="fill">
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, height)}
              colors={[gradientStart, gradientEnd]}
            />
          </Path>
          <Path
            path={linePath}
            color={strokeColor}
            style="stroke"
            strokeWidth={2}
          />
          {pressX != null && (
            <>
              <Path
                path={indicatorPath}
                color={getColor("primary")}
                style="stroke"
                strokeWidth={1}
              />

              <Circle
                cx={pressX}
                cy={points[selectedIndex].y}
                r={4}
                color={strokeColor}
              />
            </>
          )}
        </Canvas>
        {pressX != null && selectedIndex >= 0 && (
          <View
            style={[
              { left: tooltipLeft, width: tooltipWidth, height: tooltipHeight },
              styles.tooltipContainer,
            ]}
          >
            <Text style={styles.tooltipText}>
              <Text style={styles.tooltipKeyText}>
                {points[selectedIndex].key}
              </Text>
              <Text> &bull; </Text>
              <Text>{points[selectedIndex].value}</Text>
            </Text>
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
});
