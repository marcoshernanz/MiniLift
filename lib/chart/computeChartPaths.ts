import { Skia } from "@shopify/react-native-skia";

type SkPath = ReturnType<typeof Skia.Path.Make>;

export interface ChartPoint {
  x: number;
  y: number;
  key: string;
  value: number;
}

interface Params {
  data: Record<string, number>;
  width: number;
  height: number;
  bottomPadding: number;
}

export function computeChartPaths({
  data,
  width,
  height,
  bottomPadding,
}: Params): {
  linePath: SkPath;
  areaPath: SkPath;
  points: ChartPoint[];
  minY: number;
} {
  const linePath = Skia.Path.Make();
  const areaPath = Skia.Path.Make();
  const entries = Object.entries(data) as [string, number][];

  const chartAreaHeight = height;
  const chartHeight = chartAreaHeight * (1 - bottomPadding);
  const values = entries.map(([, v]) => v);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points: ChartPoint[] = entries.map(([key, value], index) => {
    const x = (index / (entries.length - 1 || 1)) * width;
    const y = ((max - value) / (max - min || 1)) * chartHeight;
    return { x, y, key, value };
  });

  if (points.length > 0) {
    const first = points[0];
    linePath.moveTo(first.x, first.y);
    areaPath.moveTo(first.x, first.y);

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

  const minY = Math.min(...points.map((p) => p.y));
  return { linePath, areaPath, points, minY };
}
