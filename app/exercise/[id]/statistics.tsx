import StatisticsTimeFrameSelector from "@/components/statistics/StatisticsTimeFrameSelector";
import StatisticsTypeSelector from "@/components/statistics/StatisticsTypeSelector";
import SafeArea from "@/components/ui/SafeArea";
import Chart from "@/components/ui/SimpleChart";
import Title from "@/components/ui/Title";
import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const dummyData = {
  "Jan 01": 90,
  "Jan 02": 91,
  "Jan 03": 88,
  "Jan 04": 100,
  "Jan 05": 85,
  "Jan 06": 105,
  "Jan 07": 100,
  "Jan 08": 95,
  "Jan 09": 90,
  "Jan 10": 105,
  "Jan 11": 90,
  "Jan 12": 95,
  "Jan 13": 100,
  "Jan 14": 95,
  "Jan 15": 90,
  "Jan 16": 115,
  "Jan 17": 105,
  "Jan 18": 110,
  "Jan 19": 130,
  "Jan 20": 95,
  "Jan 21": 110,
  "Jan 22": 115,
  "Jan 23": 120,
  "Jan 24": 125,
  "Jan 25": 110,
  "Jan 26": 115,
  "Jan 27": 100,
  "Jan 28": 105,
  "Jan 29": 120,
  "Jan 30": 115,
};

export const timeFrames = ["7D", "1M", "3M", "1Y", "All"];

export default function StatisticsScreen() {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("7D");
  const [selectedType, setSelectedType] = useState("score");
  const [chartHeight, setChartHeight] = useState<number>(0);

  const { width } = Dimensions.get("window");

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
        {chartHeight > 0 && (
          <Chart
            data={dummyData}
            width={width}
            height={chartHeight}
            labelCount={6}
          />
        )}
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
  },
  title: {
    marginBottom: 12,
  },
});
