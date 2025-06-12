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

      // bumpX smoothing: port D3 Curve bumpX
      let x0 = points[0].x;
      let y0 = points[0].y;
      let pointState = 0;
      for (const { x, y } of points) {
        switch (pointState) {
          case 0:
            // first point: already moved above
            pointState = 1;
            break;
          case 1:
            // second point: set state and fall through to default smoothing
            pointState = 2;
          default:
            // apply bumpX: control points at midpoint X between x0 and x
            const mx = (x0 + x) / 2;
            linePath.cubicTo(mx, y0, mx, y, x, y);
            areaPath.cubicTo(mx, y0, mx, y, x, y);
            break;
        }
        // update previous coordinates
        x0 = x;
        y0 = y;
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
  const selectedIndex = pressX != null ? xs.findIndex((x) => x === pressX) : -1;

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
          {pressX != null && selectedIndex >= 0 && (
            <Circle
              cx={pressX}
              cy={points[selectedIndex].y}
              r={4}
              color={strokeColor}
            />
          )}
        </Canvas>
      </View>
    </GestureDetector>
  );
}
