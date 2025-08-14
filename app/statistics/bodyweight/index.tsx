import StatisticsTimeFrameSelector from "@/components/statistics/StatisticsTimeFrameSelector";
import Chart from "@/components/ui/Chart";
import SafeArea from "@/components/ui/SafeArea";
import Title from "@/components/ui/Title";
import useDailyBodyweight from "@/lib/hooks/bodyweight/useDailyBodyweight";
import useMonthlyBodyweight from "@/lib/hooks/bodyweight/useMonthlyBodyweight";
import useWeeklyBodyweight from "@/lib/hooks/bodyweight/useWeeklyBodyweight";
import { format, parseISO } from "date-fns";
import { useState, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

export type TimeFrame = "7D" | "1M" | "3M" | "1Y" | "All";

export default function StatisticsScreen() {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("7D");
  const [chartHeight, setChartHeight] = useState<number>(0);

  const dailyBodyweight = useDailyBodyweight();
  const weeklyBodyweight = useWeeklyBodyweight();
  const monthlyBodyweight = useMonthlyBodyweight();

  const { width } = Dimensions.get("window");

  const dataMap = useMemo<Record<string, number | null>>(() => {
    if (selectedTimeFrame === "7D" || selectedTimeFrame === "1M") {
      return dailyBodyweight;
    } else if (selectedTimeFrame === "3M") {
      return weeklyBodyweight;
    }
    // "1Y" or "All"
    return monthlyBodyweight;
  }, [selectedTimeFrame, dailyBodyweight, weeklyBodyweight, monthlyBodyweight]);

  const chartData = useMemo(() => {
    return Object.entries(dataMap)
      .sort(([a], [b]) => parseISO(a).getTime() - parseISO(b).getTime())
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
      }, {});
  }, [dataMap, selectedTimeFrame]);

  const numPointsVisible = useMemo(() => {
    const len = Object.keys(chartData).length;
    if (selectedTimeFrame === "7D") return 7;
    if (selectedTimeFrame === "1M") return 30;
    if (selectedTimeFrame === "3M") return 12;
    if (selectedTimeFrame === "1Y") return 12;
    // "All"
    return len === 1 ? 2 : len;
  }, [chartData, selectedTimeFrame]);

  const pointsPerLabel = useMemo(() => {
    const len = Object.keys(chartData).length;
    if (selectedTimeFrame === "7D") return 2;
    if (selectedTimeFrame === "1M") return 7;
    if (selectedTimeFrame === "3M") return 3;
    if (selectedTimeFrame === "1Y") return 3;
    // "All"
    return 3 * Math.round(1 + len / 365);
  }, [chartData, selectedTimeFrame]);

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
    paddingBottom: 16,
  },
});
