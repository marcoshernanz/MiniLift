import StatisticsTimeFrameSelector from "@/components/statistics/StatisticsTimeFrameSelector";
import StatisticsTypeSelector from "@/components/statistics/StatisticsTypeSelector";
import Chart from "@/components/ui/Chart";
import SafeArea from "@/components/ui/SafeArea";
import Title from "@/components/ui/Title";
import { useAppContext } from "@/context/AppContext";
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
  const { appData } = useAppContext();

  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("7D");
  const [selectedType, setSelectedType] = useState<StatisticsType>("score");
  const [chartHeight, setChartHeight] = useState<number>(0);

  const { id } = useLocalSearchParams<{ id: string }>();
  const exercise = appData.exercises[id];

  const { score: dailyScore, oneRepMax: dailyOneRepMax } = useDailyData(id);
  const { score: weeklyScore, oneRepMax: weeklyOneRepMax } = useWeeklyData(id);
  const { score: monthlyScore, oneRepMax: monthlyOneRepMax } =
    useMonthlyData(id);
  const { width } = Dimensions.get("window");

  let dataMap: Record<string, number | null>;
  if (selectedTimeFrame === "7D" || selectedTimeFrame === "1M") {
    dataMap = selectedType === "score" ? dailyScore : dailyOneRepMax;
  } else if (selectedTimeFrame === "3M") {
    dataMap = selectedType === "score" ? weeklyScore : weeklyOneRepMax;
  } else {
    dataMap = selectedType === "score" ? monthlyScore : monthlyOneRepMax;
  }

  // const chartData = Object.entries(dataMap)
  const x = Object.entries(dataMap)
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

  const chartData: Record<string, number | null> = Object.entries(x)
    .slice(0, 2)
    .reduce((acc, [key, val]) => {
      acc[key] = val;
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
        <Title style={styles.title}>{exercise.name}</Title>
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
