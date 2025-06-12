import getColor from "@/lib/getColor";
import {
  Canvas,
  LinearGradient,
  Path,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";

interface ChartProps {
  data: Record<string, number>;
  width: number;
  height: number;
}

export default function Chart({ data, width, height }: ChartProps) {
  const strokeWidth = 2;

  const { linePath, areaPath } = useMemo(() => {
    const linePath = Skia.Path.Make();
    const areaPath = Skia.Path.Make();
    const entries = Object.entries(data) as [string, number][];
    const points = entries.map(([, value], index) => {
      const x = (index / (entries.length - 1 || 1)) * width;
      const y =
        height -
        ((value - Math.min(...entries.map(([, v]) => v))) /
          (Math.max(...entries.map(([, v]) => v)) -
            Math.min(...entries.map(([, v]) => v)) || 1)) *
          height;
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
    return { linePath, areaPath };
  }, [data, width, height]);

  const strokeColor = getColor("primary");
  const gradientStart = getColor("primary", 0.5);
  const gradientEnd = getColor("primary", 0);

  return (
    <Canvas style={{ width, height }}>
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
    </Canvas>
  );
}
