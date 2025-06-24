import { Skia } from "@shopify/react-native-skia";

type SkPath = ReturnType<typeof Skia.Path.Make>;

export interface ChartPoint {
  x: number;
  y: number;
  key: string;
  value: number;
}

interface Params {
  data: Record<string, number | null>;
  width: number;
  height: number;
  bottomPadding: number;
  topOffset?: number;
}

export function computeChartPaths({
  data,
  width,
  height,
  bottomPadding,
  topOffset = 0,
}: Params): {
  linePath: SkPath;
  areaPath: SkPath;
  points: ChartPoint[];
  minY: number;
} {
  const linePath = Skia.Path.Make();
  const areaPath = Skia.Path.Make();

  const entries = Object.entries(data) as [string, number | null][];
  const chartAreaHeight = height;
  const chartHeight = chartAreaHeight * (1 - bottomPadding);
  const offsetY = topOffset;
  const numericValues = entries
    .map(([, v]) => v)
    .filter((v): v is number => v != null);
  const max = numericValues.length ? Math.max(...numericValues) : 0;
  const min = numericValues.length ? Math.min(...numericValues) : 0;

  const points: ChartPoint[] = [];
  entries.forEach(([key, value], index) => {
    if (value == null) return;
    const x = (index / (entries.length - 1 || 1)) * width;
    const y = ((max - value) / (max - min || 1)) * chartHeight + offsetY;
    points.push({ x, y, key, value });
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

    areaPath.lineTo(width, height + offsetY);
    areaPath.lineTo(0, height + offsetY);
    areaPath.close();
  }

  const minY = Math.min(...points.map((p) => p.y));
  return { linePath, areaPath, points, minY };
}
