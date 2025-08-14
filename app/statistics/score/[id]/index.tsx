import StatisticsTimeFrameSelector from "@/components/statistics/StatisticsTimeFrameSelector";
import StatisticsTypeSelector from "@/components/statistics/StatisticsTypeSelector";
import Chart from "@/components/ui/Chart";
import SafeArea from "@/components/ui/SafeArea";
import Title from "@/components/ui/Title";
import { useAppContext } from "@/context/AppContext";
import useDailyScore from "@/lib/hooks/score/useDailyScore";
import useWeeklyScore from "@/lib/hooks/score/useWeeklyScore";
import useMonthlyScore from "@/lib/hooks/score/useMonthlyScore";
import useDailyGlobalScore from "@/lib/hooks/score/global/useDailyGlobalScore";
import useWeeklyGlobalScore from "@/lib/hooks/score/global/useWeeklyGlobalScore";
import useMonthlyGlobalScore from "@/lib/hooks/score/global/useMonthlyGlobalScore";
import { format, parseISO } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Button from "@/components/ui/Button";
import { ChevronLeftIcon } from "lucide-react-native";
import getColor from "@/lib/utils/getColor";

export type TimeFrame = "7D" | "1M" | "3M" | "1Y" | "All";
export type StatisticsType = "score" | "oneRepMax";

export default function StatisticsScreen() {
  const { appData } = useAppContext();

  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("7D");
  const [selectedType, setSelectedType] = useState<StatisticsType>("score");
  const [chartHeight, setChartHeight] = useState<number>(0);

  const { id } = useLocalSearchParams<{ id?: string }>();
  const exercise = id ? appData.exercises[id] : null;

  const dailyData = useDailyScore(id);
  const weeklyData = useWeeklyScore(id);
  const monthlyData = useMonthlyScore(id);

  const dailyGlobal = useDailyGlobalScore();
  const weeklyGlobal = useWeeklyGlobalScore();
  const monthlyGlobal = useMonthlyGlobalScore();

  const { width } = Dimensions.get("window");

  const dataMap = useMemo<Record<string, number | null>>(() => {
    if (selectedTimeFrame === "7D" || selectedTimeFrame === "1M") {
      return selectedType === "score"
        ? id
          ? dailyData.score
          : dailyGlobal
        : id
        ? dailyData.oneRepMax
        : {};
    } else if (selectedTimeFrame === "3M") {
      return selectedType === "score"
        ? id
          ? weeklyData.score
          : weeklyGlobal
        : id
        ? weeklyData.oneRepMax
        : {};
    }
    // "1Y" and "All"
    return selectedType === "score"
      ? id
        ? monthlyData.score
        : monthlyGlobal
      : id
      ? monthlyData.oneRepMax
      : {};
  }, [
    selectedTimeFrame,
    selectedType,
    id,
    dailyData,
    weeklyData,
    monthlyData,
    dailyGlobal,
    weeklyGlobal,
    monthlyGlobal,
  ]);

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
        acc[format(date, labelFormat)] = val;
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

  const router = useRouter();

  return (
    <SafeArea style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Button
            variant="ghost"
            containerStyle={styles.backButtonContainer}
            pressableStyle={styles.backButtonPressable}
            onPress={() => router.back()}
          >
            <ChevronLeftIcon color={getColor("foreground")} />
          </Button>
          <Title style={styles.title} numberOfLines={1}>
            {exercise ? exercise.name : "Overall"}
          </Title>
        </View>
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

      {id && (
        <StatisticsTypeSelector
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
      )}
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
    gap: 16,
  },
  titleContainer: {
    position: "relative",
  },
  backButtonContainer: {
    position: "absolute",
    zIndex: 1,
    left: -8,
    top: "50%",
    transform: [{ translateY: "-50%" }],
    borderRadius: "50%",
  },
  backButtonPressable: {
    padding: 8,
    borderRadius: "50%",
  },
  title: {
    textAlign: "center",
    paddingHorizontal: 42,
  },
});
