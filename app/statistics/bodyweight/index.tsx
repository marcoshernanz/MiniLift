import StatisticsTimeFrameSelector from "@/components/statistics/StatisticsTimeFrameSelector";
import Chart from "@/components/ui/Chart";
import SafeArea from "@/components/ui/SafeArea";
import Title from "@/components/ui/Title";
import useDailyBodyweight from "@/lib/hooks/bodyweight/useDailyBodyweight";
import useMonthlyBodyweight from "@/lib/hooks/bodyweight/useMonthlyBodyweight";
import useWeeklyBodyweight from "@/lib/hooks/bodyweight/useWeeklyBodyweight";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

export type TimeFrame = "7D" | "1M" | "3M" | "1Y" | "All";

export default function StatisticsScreen() {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("7D");
  const [chartHeight, setChartHeight] = useState<number>(0);

  const dailyBodyweight = useDailyBodyweight();
  const weeklyBodyweight = useWeeklyBodyweight();
  const monthlyBodyweight = useMonthlyBodyweight();

  const { width } = Dimensions.get("window");

  let dataMap: Record<string, number | null>;
  if (selectedTimeFrame === "7D" || selectedTimeFrame === "1M") {
    dataMap = dailyBodyweight;
  } else if (selectedTimeFrame === "3M") {
    dataMap = weeklyBodyweight;
  } else {
    dataMap = monthlyBodyweight;
  }

  const chartData = Object.entries(dataMap)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .reduce<Record<string, number | null>>((acc, [key, val]) => {
      const date = parseISO(key);
      const labelFormat =
        selectedTimeFrame === "7D" ||
        selectedTimeFrame === "1M" ||
        selectedTimeFrame === "3M"
          ? "MMM dd"
          : "MMM yyyy";
      const label = format(date, labelFormat);
      acc[label] = val;
      return acc;
    }, {} as Record<string, number | null>);

  const numPointsVisible = {
    "7D": 7,
    "1M": 30,
    "3M": 12,
    "1Y": 12,
    All:
      Object.entries(chartData).length === 1
        ? 2
        : Object.entries(chartData).length,
  }[selectedTimeFrame];

  const pointsPerLabel = {
    "7D": 2,
    "1M": 7,
    "3M": 3,
    "1Y": 3,
    All: 3 * Math.round(1 + Object.entries(chartData).length / 365),
  }[selectedTimeFrame];

  return (
    <SafeArea style={styles.container}>
      <View style={styles.headerContainer}>
        <Title style={styles.title} numberOfLines={1}>
          Bodyweight
        </Title>
        <StatisticsTimeFrameSelector
          selectedTimeFrame={selectedTimeFrame}
          setSelectedTimeFrame={setSelectedTimeFrame}
        />
      </View>

      <View
        style={{ flex: 1 }}
        onLayout={(e) => setChartHeight(e.nativeEvent.layout.height)}
      >
        <Chart
          data={chartData}
          width={width}
          height={chartHeight}
          pointsPerLabel={pointsPerLabel}
          numPointsVisible={numPointsVisible}
          tooltipWidth={110}
        />
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    justifyContent: "space-between",
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    paddingBottom: 12,
  },
});
