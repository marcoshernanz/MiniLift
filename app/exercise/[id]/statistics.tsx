import StatisticsTimeFrameSelector from "@/components/statistics/StatisticsTimeFrameSelector";
import StatisticsTypeSelector from "@/components/statistics/StatisticsTypeSelector";
import Chart from "@/components/ui/Chart";
import SafeArea from "@/components/ui/SafeArea";
import Title from "@/components/ui/Title";
import useDailyData from "@/lib/data/getDailyData";
import useMonthlyData from "@/lib/data/getMonthlyData";
import useWeeklyData from "@/lib/data/getWeeklyData";
import { format, parseISO } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

export type TimeFrame = "7D" | "1M" | "3M" | "1Y" | "All";
export type StatisticsType = "score" | "oneRepMax";

export default function StatisticsScreen() {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("7D");
  const [selectedType, setSelectedType] = useState<StatisticsType>("score");
  const [chartHeight, setChartHeight] = useState<number>(0);

  const { id } = useLocalSearchParams<{ id: string }>();

  const { score: dailyScore, oneRepMax: dailyOneRepMax } = useDailyData(id);
  const { score: weeklyScore, oneRepMax: weeklyOneRepMax } = useWeeklyData(id);
  const { score: monthlyScore, oneRepMax: monthlyOneRepMax } =
    useMonthlyData(id);
  const { width } = Dimensions.get("window");

  let dataMap: Record<string, number>;
  if (selectedTimeFrame === "7D" || selectedTimeFrame === "1M") {
    dataMap = selectedType === "score" ? dailyScore : dailyOneRepMax;
  } else if (selectedTimeFrame === "3M") {
    dataMap = selectedType === "score" ? weeklyScore : weeklyOneRepMax;
  } else {
    dataMap = selectedType === "score" ? monthlyScore : monthlyOneRepMax;
  }

  const chartData = Object.entries(dataMap)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .reduce<Record<string, number>>((acc, [key, val]) => {
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
    }, {} as Record<string, number>);

  const numPointsVisible =
    selectedTimeFrame === "7D"
      ? 7
      : selectedTimeFrame === "1M"
      ? 30
      : selectedTimeFrame === "3M"
      ? 12
      : selectedTimeFrame === "1Y"
      ? 12
      : Object.entries(chartData).length;

  return (
    <SafeArea style={styles.container}>
      <View style={styles.headerContainer}>
        <Title style={styles.title}>Statistics</Title>
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
          labelCount={4}
          numPointsVisible={numPointsVisible}
        />
      </View>

      <StatisticsTypeSelector
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
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
