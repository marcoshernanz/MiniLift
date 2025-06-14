import Button from "@/components/ui/Button";
import SafeArea from "@/components/ui/SafeArea";
import Chart from "@/components/ui/SimpleChart";
import Title from "@/components/ui/Title";
import { useRouter } from "expo-router";
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

const timeFrames = ["7D", "1M", "3M", "1Y", "All"];

export default function FullscreenChartScreen() {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("7D");

  const router = useRouter();
  const { width, height } = Dimensions.get("window");

  return (
    <SafeArea style={styles.container}>
      <View style={styles.headerContainer}>
        <Title style={styles.title}>Statistics</Title>
        <View style={styles.timeFramesContainer}>
          {timeFrames.map((option) => (
            <Button
              key={option}
              variant={selectedTimeFrame === option ? "primary" : "secondary"}
              onPress={() => setSelectedTimeFrame(option)}
              containerStyle={styles.timeFrameButtonContainer}
              pressableStyle={styles.timeFrameButton}
            >
              {option}
            </Button>
          ))}
        </View>
      </View>

      <Chart
        data={dummyData}
        width={width}
        height={height - 100}
        labelCount={6}
      />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  headerContainer: {
    paddingHorizontal: 16,
  },
  title: {
    marginBottom: 12,
  },
  timeFramesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  timeFrameButtonContainer: {
    flex: 1,
  },
  timeFrameButton: {
    paddingVertical: 4,
    flex: 1,
  },
});
