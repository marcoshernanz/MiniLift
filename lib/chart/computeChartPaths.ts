import { Skia } from "@shopify/react-native-skia";

type SkPath = ReturnType<typeof Skia.Path.Make>;

export interface ChartPoint {
  x: number;
  y: number;
  key: string;
  value: number;
  entryIndex: number;
}

interface Params {
  data: Record<string, number | null>;
  width: number;
  height: number;
  bottomPadding: number;
  topOffset?: number;
  minValue?: number;
  numVisiblePoints?: number;
}

export function computeChartPaths({
  data,
  width,
  height,
  bottomPadding,
  topOffset = 0,
  minValue,
  numVisiblePoints = 0,
}: Params): {
  linePath: SkPath;
  visibleLinePath: SkPath;
  areaPath: SkPath;
  visibleAreaPath: SkPath;
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
  const dataMin = numericValues.length ? Math.min(...numericValues) : 0;
  const min = minValue !== undefined ? minValue : dataMin;

  const points: ChartPoint[] = [];
  entries.forEach(([key, value], index) => {
    if (value == null) return;
    const x = (index / (entries.length - 1 || 1)) * width;
    const y = ((max - value) / (max - min || 1)) * chartHeight + offsetY;
    points.push({ x, y, key, value, entryIndex: index });
  });

  const splitEntryIndex = Math.max(entries.length - numVisiblePoints, 0);
  const initialPoints = points.filter((p) => p.entryIndex <= splitEntryIndex);
  const visiblePoints = points.filter((p) => p.entryIndex >= splitEntryIndex);

  if (initialPoints.length > 0 && visiblePoints.length > 0) {
    initialPoints.push(visiblePoints[0]);
  }

  if (initialPoints.length > 0) {
    const first = initialPoints[0];

    linePath.moveTo(0, first.y);
    linePath.lineTo(first.x, first.y);
    areaPath.moveTo(0, first.y);
    areaPath.lineTo(first.x, first.y);

    for (let i = 1; i < initialPoints.length; i++) {
      const prev = initialPoints[i - 1];
      const curr = initialPoints[i];
      const cx = (prev.x + curr.x) / 2;

      linePath.cubicTo(cx, prev.y, cx, curr.y, curr.x, curr.y);
      areaPath.cubicTo(cx, prev.y, cx, curr.y, curr.x, curr.y);
    }

    const last = initialPoints[initialPoints.length - 1];

    if (visiblePoints.length === 0) {
      linePath.lineTo(width, last.y);
      areaPath.lineTo(width, last.y);
      areaPath.lineTo(width, height + offsetY);
    } else {
      areaPath.lineTo(last.x, height + offsetY);
    }

    areaPath.lineTo(0, height + offsetY);
    areaPath.close();
  }

  const visibleLinePath = Skia.Path.Make();
  const visibleAreaPath = Skia.Path.Make();

  if (visiblePoints.length > 0) {
    const firstV = visiblePoints[0];
    const splitX = firstV.x;

    visibleLinePath.moveTo(splitX, firstV.y);
    visibleLinePath.lineTo(firstV.x, firstV.y);
    visibleAreaPath.moveTo(splitX, firstV.y);
    visibleAreaPath.lineTo(firstV.x, firstV.y);

    for (let i = 1; i < visiblePoints.length; i++) {
      const prev = visiblePoints[i - 1];
      const curr = visiblePoints[i];
      const cx = (prev.x + curr.x) / 2;

      visibleLinePath.cubicTo(cx, prev.y, cx, curr.y, curr.x, curr.y);
      visibleAreaPath.cubicTo(cx, prev.y, cx, curr.y, curr.x, curr.y);
    }

    const lastV = visiblePoints[visiblePoints.length - 1];

    visibleLinePath.lineTo(width, lastV.y);
    visibleAreaPath.lineTo(width, lastV.y);
    visibleAreaPath.lineTo(width, height + offsetY);
    visibleAreaPath.lineTo(firstV.x, height + offsetY);
    visibleAreaPath.close();
  }

  const minY = Math.min(...points.map((p) => p.y));
  return {
    linePath,
    visibleLinePath,
    areaPath,
    visibleAreaPath,
    points,
    minY,
  };
}
