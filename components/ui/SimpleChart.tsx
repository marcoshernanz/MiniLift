import getColor from "@/lib/getColor";
import {
  Canvas,
  LinearGradient,
  Path,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

interface Props {
  data: Record<string, number>;
  width: number;
  height: number;
}

export default function SimpleChart({ data, width, height }: Props) {
  const strokeWidth = 2;
  const bottomPadding = 0.25;
  const [pressX, setPressX] = useState<number | null>(null);

  const { linePath, areaPath, points } = useMemo(() => {
    const linePath = Skia.Path.Make();
    const areaPath = Skia.Path.Make();
    const entries = Object.entries(data) as [string, number][];
    const chartHeight = height * (1 - bottomPadding);
    const max = Math.max(...entries.map(([, v]) => v));
    const min = Math.min(...entries.map(([, v]) => v));
    const points = entries.map(([, value], index) => {
      const x = (index / (entries.length - 1 || 1)) * width;
      const y = ((max - value) / (max - min || 1)) * chartHeight;
      return { x, y };
    });

    if (points.length > 0) {
      linePath.moveTo(points[0].x, points[0].y);
      areaPath.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const midX = (prev.x + curr.x) / 2;
        const midY = (prev.y + curr.y) / 2;
        linePath.quadTo(prev.x, prev.y, midX, midY);
        areaPath.quadTo(prev.x, prev.y, midX, midY);
      }

      const last = points[points.length - 1];
      linePath.lineTo(last.x, last.y);
      areaPath.lineTo(last.x, last.y);

      areaPath.lineTo(width, height);
      areaPath.lineTo(0, height);
      areaPath.close();
    }
    return { linePath, areaPath, points };
  }, [data, width, height]);

  const xs = useMemo(() => points.map((p) => p.x), [points]);

  const indicatorPath = useMemo(() => {
    const p = Skia.Path.Make();
    if (pressX != null) {
      p.moveTo(pressX, 0);
      p.lineTo(pressX, height);
    }
    return p;
  }, [pressX, height]);

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

  return (
    <GestureDetector gesture={gesture}>
      <View style={{ width, height }}>
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
            strokeWidth={strokeWidth}
          />
          {pressX != null && (
            <Path
              path={indicatorPath}
              color={getColor("primary")}
              style="stroke"
              strokeWidth={1}
            />
          )}
        </Canvas>
      </View>
    </GestureDetector>
  );
}
